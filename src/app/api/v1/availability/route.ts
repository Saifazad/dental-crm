import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login or provide a valid API key to check appointment availability." },
      { status: 401 }
    );
  }

  const pool = getPool();
  const searchParams = req.nextUrl.searchParams;
  const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const timePref = (searchParams.get("time_preference") || "any").toLowerCase();
  const doctorId = searchParams.get("doctor_id");

  try {
    // Standard candidate slots
    const morningSlots = ["10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM"];
    const eveningSlots = ["04:00 PM", "04:45 PM", "05:30 PM", "06:15 PM", "07:00 PM"];

    let candidateSlots: string[] = [];
    if (timePref.includes("morning") || timePref.includes("subah")) {
      candidateSlots = morningSlots;
    } else if (timePref.includes("evening") || timePref.includes("shaam")) {
      candidateSlots = eveningSlots;
    } else {
      candidateSlots = ["11:15 AM", "12:00 PM", "04:45 PM", "05:30 PM", "06:15 PM"];
    }

    // Query booked times from PostgreSQL
    let query = "SELECT appointment_time FROM appointments WHERE appointment_date = $1 AND status != 'Cancelled'";
    const params: any[] = [dateStr];

    if (doctorId) {
      query += " AND doctor_id = $2";
      params.push(doctorId);
    }

    const { rows } = await pool.query(query, params);
    const bookedSet = new Set(rows.map((r: any) => r.appointment_time.trim().toUpperCase()));

    const freeSlots = candidateSlots.filter(
      (slot) => !bookedSet.has(slot.trim().toUpperCase())
    );

    return NextResponse.json({
      success: true,
      clinic: "Apex Dental Clinic",
      date: dateStr,
      available_slots: freeSlots.length > 0 ? freeSlots : ["07:30 PM"],
      booked_count: bookedSet.size,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
