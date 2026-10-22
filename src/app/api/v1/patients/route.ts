import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login to access patient records." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query("SELECT * FROM patients ORDER BY created_at DESC");
    return NextResponse.json({ success: true, patients: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login to register patients." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const body = await req.json();
    const { name, phone, age, gender, blood_group, medical_alerts } = body;
    const patId = `pat_${Date.now()}`;
    await pool.query(
      "INSERT INTO patients (id, clinic_id, name, phone, age, gender, blood_group, medical_alerts, total_visits, last_visit) VALUES ($1, 'clinic_001', $2, $3, $4, $5, $6, $7, 1, 'Today')",
      [patId, name, phone, age || 30, gender || 'Other', blood_group || 'O+', medical_alerts || 'None']
    );
    return NextResponse.json({ success: true, patient_id: patId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
