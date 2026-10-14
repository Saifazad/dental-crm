export type TabType =
  | "overview"
  | "calendar"
  | "appointments"
  | "patients"
  | "doctors"
  | "billing"
  | "clinic";

export interface Clinic {
  id?: string;
  name: string;
  tagline: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  api_key?: string;
  opening_time?: string;
  closing_time?: string;
  lunch_start?: string;
  lunch_end?: string;
}

export interface Appointment {
  id: string;
  clinic_id?: string;
  patient_id?: string;
  patient_name: string;
  patient_phone: string;
  doctor_id?: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  treatment_name: string;
  status: string;
  is_emergency: number;
  booked_by: string;
  notes?: string;
  created_at?: string;
}

export interface Patient {
  id: string;
  clinic_id?: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  blood_group: string;
  medical_alerts: string;
  total_visits: number;
  last_visit: string;
  created_at?: string;
}

export interface Doctor {
  id: string;
  clinic_id?: string;
  name: string;
  qualification: string;
  specialization: string;
  experience_years: number;
  fee: number;
  is_available: number;
  working_days: string;
  shift_time?: string;
}

export interface Service {
  id: string;
  clinic_id?: string;
  category: string;
  name: string;
  price_range: string;
  base_price: number;
  duration_mins: number;
  description: string;
}

export interface Invoice {
  id: string;
  clinic_id?: string;
  patient_name: string;
  patient_phone: string;
  treatment_name: string;
  amount_total: number;
  amount_paid: number;
  amount_balance: number;
  payment_status: string;
  payment_method: string;
  invoice_date: string;
}

export type UserRole = "admin" | "doctor" | "receptionist" | "staff";

export interface User {
  id: string;
  clinic_id?: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}
