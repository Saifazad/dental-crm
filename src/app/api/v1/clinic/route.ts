import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  const pool = getPool();
  try {
    const { rows } = await pool.query("SELECT * FROM clinics LIMIT 1");
    return NextResponse.json({ success: true, clinic: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
