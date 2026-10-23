import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login or provide a valid API key to view services." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query("SELECT * FROM services ORDER BY base_price ASC");
    return NextResponse.json({ success: true, services: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please login or provide a valid API key to modify services." },
      { status: 401 }
    );
  }

  const pool = getPool();
  try {
    const { id, price_range, base_price } = await req.json();
    await pool.query(
      "UPDATE services SET price_range = $1, base_price = $2 WHERE id = $3",
      [price_range, base_price, id]
    );
    return NextResponse.json({ success: true, message: "Price updated in Dental CRM" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
