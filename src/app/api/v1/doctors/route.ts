import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

// GET: Fetch all doctors & their shifts
export async function GET() {
  const pool = getPool();
  try {
    const { rows } = await pool.query("SELECT * FROM doctors ORDER BY id ASC");
    return NextResponse.json({ success: true, doctors: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add new Doctor & Shift
export async function POST(req: NextRequest) {
  const pool = getPool();
  try {
    const body = await req.json();
    const {
      name,
      qualification = "BDS",
      specialization = "General Dentist",
      experience_years = 5,
      fee = 500,
      is_available = 1,
      working_days = "Mon,Tue,Wed,Thu,Fri,Sat",
      shift_time = "09:30 AM - 01:30 PM (Morning OPD)",
      clinic_id = "clinic_001",
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Doctor name is required" }, { status: 400 });
    }

    const newId = `doc_${Date.now()}`;

    const query = `
      INSERT INTO doctors (id, clinic_id, name, qualification, specialization, experience_years, fee, is_available, working_days, shift_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      newId,
      clinic_id,
      name.trim(),
      qualification.trim(),
      specialization.trim(),
      Number(experience_years) || 0,
      Number(fee) || 0,
      is_available ? 1 : 0,
      working_days,
      shift_time,
    ];

    const { rows } = await pool.query(query, values);
    return NextResponse.json({ success: true, doctor: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Edit existing Doctor & Shift details
export async function PUT(req: NextRequest) {
  const pool = getPool();
  try {
    const body = await req.json();
    const {
      id,
      name,
      qualification,
      specialization,
      experience_years,
      fee,
      is_available,
      working_days,
      shift_time,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Doctor ID is required" }, { status: 400 });
    }

    const query = `
      UPDATE doctors
      SET 
        name = COALESCE($1, name),
        qualification = COALESCE($2, qualification),
        specialization = COALESCE($3, specialization),
        experience_years = COALESCE($4, experience_years),
        fee = COALESCE($5, fee),
        is_available = COALESCE($6, is_available),
        working_days = COALESCE($7, working_days),
        shift_time = COALESCE($8, shift_time)
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      name ? name.trim() : null,
      qualification ? qualification.trim() : null,
      specialization ? specialization.trim() : null,
      experience_years !== undefined ? Number(experience_years) : null,
      fee !== undefined ? Number(fee) : null,
      is_available !== undefined ? (is_available ? 1 : 0) : null,
      working_days || null,
      shift_time || null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, doctor: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH: Quick toggle availability status
export async function PATCH(req: NextRequest) {
  const pool = getPool();
  try {
    const { id, is_available } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Doctor ID is required" }, { status: 400 });
    }

    await pool.query("UPDATE doctors SET is_available = $1 WHERE id = $2", [is_available ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Delete Doctor & Shift
export async function DELETE(req: NextRequest) {
  const pool = getPool();
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Doctor ID is required" }, { status: 400 });
    }

    // Safely detach from appointments so past history remains
    await pool.query("UPDATE appointments SET doctor_id = NULL WHERE doctor_id = $1", [id]);

    // Delete doctor record
    const result = await pool.query("DELETE FROM doctors WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Doctor shift removed successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
