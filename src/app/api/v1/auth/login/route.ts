import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { comparePassword, signToken, setAuthCookie, sanitizeUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password" },
        { status: 400 }
      );
    }

    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
      [trimmedEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sanitized = sanitizeUser(user);

    // Sign JWT
    const token = signToken({
      id: sanitized.id,
      email: sanitized.email,
      name: sanitized.name,
      role: sanitized.role,
      clinic_id: sanitized.clinic_id,
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: sanitized,
      token,
    });

    // Set HTTP-only Cookie
    setAuthCookie(response, token);

    return response;
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to log in" },
      { status: 500 }
    );
  }
}
