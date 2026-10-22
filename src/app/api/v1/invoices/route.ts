import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login to view billing records & invoices." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query("SELECT * FROM invoices ORDER BY id DESC");
    return NextResponse.json({ success: true, invoices: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login to create invoices." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const body = await req.json();
    const {
      clinic_id = "clinic_001",
      patient_name,
      patient_phone,
      treatment_name,
      amount_total,
      amount_paid,
      amount_balance,
      payment_status,
      payment_method = "UPI",
      invoice_date,
    } = body;

    const id = `inv_${Date.now().toString().slice(-6)}`;
    const date = invoice_date || new Date().toISOString().split("T")[0];
    const total = parseInt(amount_total, 10) || 0;
    const paid = parseInt(amount_paid, 10) || 0;
    const balance = total - paid;
    const status = payment_status || (balance <= 0 ? "Paid in Full" : "Partially Paid");

    const result = await pool.query(
      `INSERT INTO invoices (id, clinic_id, patient_name, patient_phone, treatment_name, amount_total, amount_paid, amount_balance, payment_status, payment_method, invoice_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        id,
        clinic_id,
        patient_name,
        patient_phone,
        treatment_name,
        total,
        paid,
        balance,
        status,
        payment_method,
        date,
      ]
    );

    return NextResponse.json({ success: true, invoice: result.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login to update payments." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const body = await req.json();
    const { id, amount_paid, amount_balance, payment_status, payment_method } = body;

    const result = await pool.query(
      `UPDATE invoices 
       SET amount_paid = COALESCE($1, amount_paid),
           amount_balance = COALESCE($2, amount_balance),
           payment_status = COALESCE($3, payment_status),
           payment_method = COALESCE($4, payment_method)
       WHERE id = $5
       RETURNING *`,
      [amount_paid, amount_balance, payment_status, payment_method, id]
    );

    return NextResponse.json({ success: true, invoice: result.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
