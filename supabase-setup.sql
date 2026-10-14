-- ====================================================================
-- DENTAL CLINIC CRM - SUPABASE INITIAL DATABASE SETUP
-- Copy and paste this entire script into your Supabase SQL Editor and click "RUN"
-- ====================================================================

-- 1. Clinics Table
CREATE TABLE IF NOT EXISTS clinics (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  tagline VARCHAR(200),
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  api_key VARCHAR(100) NOT NULL,
  opening_time VARCHAR(20) DEFAULT '10:00 AM',
  closing_time VARCHAR(20) DEFAULT '08:30 PM',
  lunch_start VARCHAR(20) DEFAULT '01:30 PM',
  lunch_end VARCHAR(20) DEFAULT '02:30 PM',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(50) PRIMARY KEY,
  clinic_id VARCHAR(50) REFERENCES clinics(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  qualification VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  experience_years INT DEFAULT 10,
  fee INT DEFAULT 500,
  is_available INT DEFAULT 1,
  working_days VARCHAR(100) DEFAULT 'Mon,Tue,Wed,Thu,Fri,Sat',
  shift_time VARCHAR(100) DEFAULT '09:30 AM - 01:30 PM (Morning OPD)'
);

-- 3. Patients (EHR & Directory)
CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(50) PRIMARY KEY,
  clinic_id VARCHAR(50) REFERENCES clinics(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  age INT,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  medical_alerts TEXT,
  total_visits INT DEFAULT 1,
  last_visit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Dental Tooth Chart (Odontogram)
CREATE TABLE IF NOT EXISTS dental_charts (
  id VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50) REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number INT NOT NULL,
  condition VARCHAR(50) NOT NULL,
  notes TEXT
);

-- 5. Services & Pricing Catalog
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(50) PRIMARY KEY,
  clinic_id VARCHAR(50) REFERENCES clinics(id) ON DELETE SET NULL,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  price_range VARCHAR(50) NOT NULL,
  base_price INT NOT NULL,
  duration_mins INT DEFAULT 30,
  description TEXT
);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(50) PRIMARY KEY,
  clinic_id VARCHAR(50) REFERENCES clinics(id) ON DELETE SET NULL,
  patient_id VARCHAR(50),
  patient_name VARCHAR(100) NOT NULL,
  patient_phone VARCHAR(50) NOT NULL,
  doctor_id VARCHAR(50) REFERENCES doctors(id) ON DELETE SET NULL,
  doctor_name VARCHAR(100) NOT NULL,
  appointment_date VARCHAR(30) NOT NULL,
  appointment_time VARCHAR(30) NOT NULL,
  treatment_name VARCHAR(150) NOT NULL,
  status VARCHAR(50) DEFAULT 'Confirmed',
  is_emergency INT DEFAULT 0,
  booked_by VARCHAR(50) DEFAULT 'Receptionist',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Invoices & Billing
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(50) PRIMARY KEY,
  clinic_id VARCHAR(50) REFERENCES clinics(id) ON DELETE SET NULL,
  patient_name VARCHAR(100) NOT NULL,
  patient_phone VARCHAR(50) NOT NULL,
  treatment_name VARCHAR(150) NOT NULL,
  amount_total INT NOT NULL,
  amount_paid INT NOT NULL,
  amount_balance INT NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'UPI',
  invoice_date VARCHAR(50) NOT NULL
);

-- 8. Users (Auth & Staff Credentials)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  clinic_id VARCHAR(50) REFERENCES clinics(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SEED INITIAL DATA
-- ====================================================================

-- Seed Clinic
INSERT INTO clinics (id, name, tagline, city, address, phone, email, api_key)
VALUES (
  'clinic_001',
  'Apex Dental Multi-Specialty & Implant Clinic',
  'Advanced Laser & Painless Dentistry',
  'South Delhi',
  'M-Block Market, Greater Kailash 2, New Delhi',
  '+91 11 4982 7700',
  'contact@apexdentaldelhi.com',
  'dc_live_sec_88492019482'
) ON CONFLICT (id) DO NOTHING;

-- Seed Users (Passwords: admin123, clinic123)
INSERT INTO users (id, clinic_id, name, email, password_hash, role)
VALUES
  ('usr_admin_001', 'clinic_001', 'Dr. Alok Aggarwal', 'admin@apexdental.com', '$2b$10$0mP4jdZVVwUoOtb0QHhe/ui7EPjgNPlOfSpa84Ynw23jCrqOHunH.', 'admin'),
  ('usr_staff_002', 'clinic_001', 'Pooja Sharma', 'reception@apexdental.com', '$2b$10$SjRkQvGRIqgkDey21LjUMe/JNvKpNCbBo7AyUtksO5vIO2xC4GR3i', 'receptionist')
ON CONFLICT (email) DO NOTHING;

-- Seed Doctors
INSERT INTO doctors (id, clinic_id, name, qualification, specialization, experience_years, fee, is_available, working_days, shift_time)
VALUES 
  ('doc_101', 'clinic_001', 'Dr. Alok Aggarwal', 'BDS, MDS (Prosthodontics)', 'Senior Implantologist', 15, 700, 1, 'Mon,Tue,Wed,Thu,Fri,Sat', '09:30 AM - 01:30 PM (Morning OPD)'),
  ('doc_102', 'clinic_001', 'Dr. Meenakshi Sundaram', 'BDS, MDS (Endodontics)', 'Root Canal Specialist', 11, 600, 1, 'Mon,Tue,Wed,Thu,Fri,Sat', '02:30 PM - 08:30 PM (Evening Shift)'),
  ('doc_103', 'clinic_001', 'Dr. Tanya Khurana', 'BDS (Pedodontics)', 'Kids & Aesthetic Dentist', 8, 500, 1, 'Mon,Tue,Wed,Thu,Fri,Sat', '11:00 AM - 06:00 PM (Full Day Shift)')
ON CONFLICT (id) DO NOTHING;

-- Seed Services
INSERT INTO services (id, clinic_id, category, name, price_range, base_price, duration_mins, description)
VALUES
  ('srv_1', 'clinic_001', 'Preventive', 'Teeth Cleaning & Air-Flow Polishing', '₹1,500 - ₹2,200', 1500, 30, 'Deep scaling and stain removal'),
  ('srv_2', 'clinic_001', 'Endodontics', 'Single-Sitting Rotary Root Canal (RCT)', '₹4,500 - ₹6,500', 4500, 45, 'Microscopic painless nerve treatment'),
  ('srv_3', 'clinic_001', 'Prosthodontics', 'Zirconia Monolithic Crown (15 Yr Warranty)', '₹7,500 - ₹12,000', 7500, 40, 'CAD/CAM German aesthetic crown'),
  ('srv_4', 'clinic_001', 'Orthodontics', 'Clear Invisible Aligners', '₹55,000 - ₹1,10,000', 55000, 30, 'Custom 3D scanned aligners package'),
  ('srv_5', 'clinic_001', 'Cosmetic', 'Cold Laser Teeth Whitening', '₹6,500 - ₹9,500', 6500, 45, 'Instant 4-shade smile enhancement'),
  ('srv_6', 'clinic_001', 'Surgery', 'Surgical Wisdom Tooth Removal', '₹2,500 - ₹5,000', 2500, 35, 'Atraumatic impaction extraction')
ON CONFLICT (id) DO NOTHING;

-- Seed Patients
INSERT INTO patients (id, clinic_id, name, phone, age, gender, blood_group, medical_alerts, total_visits, last_visit)
VALUES
  ('pat_1', 'clinic_001', 'Rishabh Pant', '+91 98111 22334', 28, 'Male', 'B+', 'None', 3, 'Today 11:00 AM'),
  ('pat_2', 'clinic_001', 'Simran Bhasin', '+91 98200 44556', 34, 'Female', 'O+', 'Penicillin Allergy', 2, 'Yesterday'),
  ('pat_3', 'clinic_001', 'Gurpreet Singh', '+91 99100 88771', 52, 'Male', 'A+', 'Type-2 Diabetes, Hypertension (High BP)', 5, '3 days ago'),
  ('pat_4', 'clinic_001', 'Ananya Dixit', '+91 98188 55221', 24, 'Female', 'AB+', 'None', 1, 'First Visit')
ON CONFLICT (id) DO NOTHING;

-- Seed Appointments
INSERT INTO appointments (id, clinic_id, patient_id, patient_name, patient_phone, doctor_id, doctor_name, appointment_date, appointment_time, treatment_name, status, is_emergency, booked_by, notes)
VALUES
  ('app_1', 'clinic_001', 'pat_1', 'Rishabh Pant', '+91 98111 22334', 'doc_101', 'Dr. Alok Aggarwal', TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'), '11:00 AM', 'Teeth Cleaning & Air-Flow Polishing', 'Completed', 0, 'Receptionist', 'Routine scaling done, no bleeding'),
  ('app_2', 'clinic_001', 'pat_2', 'Simran Bhasin', '+91 98200 44556', 'doc_102', 'Dr. Meenakshi Sundaram', TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'), '12:30 PM', 'Single-Sitting Rotary Root Canal (RCT)', 'Confirmed', 1, 'Phone Call', 'Patient reported acute unbearable throbbing pain in upper left premolar. Flagged as priority emergency.'),
  ('app_3', 'clinic_001', 'pat_3', 'Gurpreet Singh', '+91 99100 88771', 'doc_101', 'Dr. Alok Aggarwal', TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'), '04:15 PM', 'Zirconia Monolithic Crown', 'In Chair', 0, 'Receptionist', 'Crown trial sitting'),
  ('app_4', 'clinic_001', 'pat_4', 'Ananya Dixit', '+91 98188 55221', 'doc_103', 'Dr. Tanya Khurana', TO_CHAR(CURRENT_DATE + INTERVAL '1 day', 'YYYY-MM-DD'), '11:15 AM', 'Clear Invisible Aligners', 'Confirmed', 0, 'Online Portal', 'Enquired about aligners pricing and booked 3D scan.')
ON CONFLICT (id) DO NOTHING;

-- Seed Invoices
INSERT INTO invoices (id, clinic_id, patient_name, patient_phone, treatment_name, amount_total, amount_paid, amount_balance, payment_status, payment_method, invoice_date)
VALUES
  ('inv_1', 'clinic_001', 'Rishabh Pant', '+91 98111 22334', 'Teeth Cleaning & Air-Flow Polishing', 1800, 1800, 0, 'Paid in Full', 'UPI / GPay', TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')),
  ('inv_2', 'clinic_001', 'Gurpreet Singh', '+91 99100 88771', 'Zirconia Monolithic Crown', 8500, 5000, 3500, 'Partially Paid', 'Credit Card', TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'))
ON CONFLICT (id) DO NOTHING;
