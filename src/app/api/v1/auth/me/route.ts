import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getTokenFromRequest, verifyToken, sanitizeUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, error: "Session expired or invalid" },
        { status: 401 }
      );
    }

    const pool = getPool();
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [payload.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = sanitizeUser(result.rows[0]);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err: any) {
    console.error("Auth me API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
