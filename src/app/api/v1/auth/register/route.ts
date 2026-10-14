import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { hashPassword, signToken, setAuthCookie, sanitizeUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const trimmedEmail = (email || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const validRoles = ["admin", "doctor", "receptionist", "staff"];
    const userRole = validRoles.includes(role) ? role : "admin";

    const pool = getPool();

    // Check existing email
    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [trimmedEmail]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const clinicId = body.clinic_id || "clinic_001";

    const insertResult = await pool.query(
      `INSERT INTO users (id, clinic_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, clinicId, name.trim(), trimmedEmail, passwordHash, userRole]
    );

    const newUser = insertResult.rows[0];
    const sanitized = sanitizeUser(newUser);

    // Sign JWT
    const token = signToken({
      id: sanitized.id,
      email: sanitized.email,
      name: sanitized.name,
      role: sanitized.role,
      clinic_id: sanitized.clinic_id,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully!",
        user: sanitized,
        token,
      },
      { status: 201 }
    );

    // Set HTTP-only Cookie
    setAuthCookie(response, token);

    return response;
  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
