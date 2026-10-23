import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login or provide a valid API key to view appointments." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query(
      "SELECT * FROM appointments ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, appointments: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login or provide a valid API key to book appointments." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const body = await req.json();
    const {
      patient_name,
      patient_phone,
      appointment_date,
      appointment_time,
      treatment_name = "General Consultation",
      doctor_id,
      notes = "",
      booked_by = "Reception Desk",
    } = body;

    if (!patient_name || !patient_phone || !appointment_time) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Conflict check
    const conflictCheck = await pool.query(
      "SELECT id FROM appointments WHERE appointment_date = $1 AND appointment_time = $2 AND status != 'Cancelled'",
      [appointment_date, appointment_time]
    );

    if (conflictCheck.rows.length > 0) {
      return NextResponse.json({
        success: false,
        conflict: true,
        message: `Slot ${appointment_time} is already booked in CRM. Please choose another slot.`,
      });
    }

    // Determine Doctor
    let docId = doctor_id;
    let docName = "Dr. Alok Aggarwal";
    if (docId) {
      const docRes = await pool.query("SELECT name FROM doctors WHERE id = $1", [docId]);
      if (docRes.rows.length > 0) docName = docRes.rows[0].name;
    } else {
      const docRes = await pool.query("SELECT id, name FROM doctors WHERE is_available = 1 LIMIT 1");
      if (docRes.rows.length > 0) {
        docId = docRes.rows[0].id;
        docName = docRes.rows[0].name;
      }
    }

    // Check emergency keywords
    const emKeywords = ["severe", "bleeding", "pain", "dard", "khoon", "broken", "accident"];
    const isEmergency = emKeywords.some((kw) =>
      `${treatment_name} ${notes}`.toLowerCase().includes(kw)
    ) ? 1 : 0;

    const appId = `app_${Date.now()}`;

    // Also link or create patient
    let patId = null;
    const patCheck = await pool.query("SELECT id FROM patients WHERE phone = $1", [patient_phone]);
    if (patCheck.rows.length > 0) {
      patId = patCheck.rows[0].id;
      await pool.query("UPDATE patients SET total_visits = total_visits + 1, last_visit = 'Today' WHERE id = $1", [patId]);
    } else {
      patId = `pat_${Date.now()}`;
      await pool.query(
        "INSERT INTO patients (id, clinic_id, name, phone, age, gender, medical_alerts, total_visits, last_visit) VALUES ($1, 'clinic_001', $2, $3, 30, 'Unknown', 'None', 1, 'Today')",
        [patId, patient_name, patient_phone]
      );
    }

    await pool.query(
      `INSERT INTO appointments (
        id, clinic_id, patient_id, patient_name, patient_phone,
        doctor_id, doctor_name, appointment_date, appointment_time,
        treatment_name, status, is_emergency, booked_by, notes
      ) VALUES ($1, 'clinic_001', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        appId,
        patId,
        patient_name,
        patient_phone,
        docId,
        docName,
        appointment_date,
        appointment_time,
        treatment_name,
        "Confirmed",
        isEmergency,
        booked_by,
        notes,
      ]
    );

    return NextResponse.json({
      success: true,
      appointment_id: appId,
      patient_name,
      doctor_name: docName,
      appointment_date,
      appointment_time,
      treatment_name,
      is_emergency: isEmergency,
      message: `Appointment successfully booked into Dental CRM for ${patient_name}`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login or provide a valid API key to update appointments." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const body = await req.json();
    const { id, status, appointment_date, appointment_time, doctor_id, doctor_name } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing appointment id" }, { status: 400 });
    }

    if (status) {
      await pool.query("UPDATE appointments SET status = $1 WHERE id = $2", [status, id]);
    }
    if (appointment_date && appointment_time) {
      await pool.query(
        "UPDATE appointments SET appointment_date = $1, appointment_time = $2 WHERE id = $3",
        [appointment_date, appointment_time, id]
      );
    }
    if (doctor_id && doctor_name) {
      await pool.query(
        "UPDATE appointments SET doctor_id = $1, doctor_name = $2 WHERE id = $3",
        [doctor_id, doctor_name, id]
      );
    }

    return NextResponse.json({ success: true, message: "Appointment updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login or provide a valid API key to delete appointments." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing appointment id" }, { status: 400 });
    }
    await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
    return NextResponse.json({ success: true, message: "Appointment deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

