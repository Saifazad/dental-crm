import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login or provide a valid API key to view clinic details." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query("SELECT * FROM clinics LIMIT 1");
    return NextResponse.json({ success: true, clinic: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
