"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TabType, Clinic, Appointment, Patient, Doctor, Service, Invoice } from "@/types/crm";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import OverviewTab from "@/components/dashboard/OverviewTab";
import CalendarTab from "@/components/calendar/CalendarTab";
import AppointmentsTab from "@/components/appointments/AppointmentsTab";
import PatientsTab from "@/components/patients/PatientsTab";
import DoctorsTab from "@/components/doctors/DoctorsTab";
import BillingTab from "@/components/billing/BillingTab";
import ClinicProfileTab from "@/components/clinic/ClinicProfileTab";
import BookingModal from "@/components/modals/BookingModal";
import { useAuth } from "@/context/AuthContext";
import ApiTrackerModal from "@/components/debug/ApiTrackerModal";
import { trackedFetch } from "@/lib/api-logger";
import { Stethoscope } from "lucide-react";

export default function DentalCRMPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("calendar");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // State
  const [clinic, setClinic] = useState<Clinic>({
    name: "Apex Dental Multi-Specialty & Implant Clinic",
    tagline: "Advanced Laser & Painless Dentistry",
    city: "South Delhi",
    address: "M-Block Market, Greater Kailash 2, New Delhi",
    phone: "+91 11 4982 7700",
    opening_time: "10:00 AM",
    closing_time: "08:30 PM",
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [, setLoading] = useState(true);

  // Calendar States
  const todayISO = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const [doctorFilter, setDoctorFilter] = useState<string>("all");

  // Modals & UI States
  const [selectedTooth, setSelectedTooth] = useState<number | null>(16);
  const [isWalkinOpen, setIsWalkinOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newAppDate, setNewAppDate] = useState(todayISO);
  const [newAppTime, setNewAppTime] = useState("11:15 AM");
  const [newTreatment, setNewTreatment] = useState("Teeth Cleaning & Air-Flow Polishing");

  // Fetch CRM Data from PostgreSQL APIs
  const fetchCRMData = async () => {
    try {
      const [resClinic, resApps, resPats, resDocs, resSrv, resInv] = await Promise.all([
        trackedFetch("/api/v1/clinic", undefined, "Load Clinic Profile & Working Hours"),
        trackedFetch("/api/v1/appointments", undefined, "Load Patient Appointments Queue"),
        trackedFetch("/api/v1/patients", undefined, "Load Patient Directory & EHR"),
        trackedFetch("/api/v1/doctors", undefined, "Load Doctors & Shift Roster"),
        trackedFetch("/api/v1/services", undefined, "Load Dental Services Catalog"),
        trackedFetch("/api/v1/invoices", undefined, "Load Invoices & Billing Stats"),
      ]);

      if (resClinic.ok) {
        const c = await resClinic.json();
        if (c.clinic) setClinic(c.clinic);
      }
      if (resApps.ok) {
        const a = await resApps.json();
        if (a.appointments) setAppointments(a.appointments);
      }
      if (resPats.ok) {
        const p = await resPats.json();
        if (p.patients) setPatients(p.patients);
      }
      if (resDocs.ok) {
        const d = await resDocs.json();
        if (d.doctors) setDoctors(d.doctors);
      }
      if (resSrv.ok) {
        const s = await resSrv.json();
        if (s.services) setServices(s.services);
      }
      if (resInv.ok) {
        const i = await resInv.json();
        if (i.invoices) setInvoices(i.invoices);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCRMData();
    }
  }, [isAuthenticated]);

  // Toggle Doctor availability in Postgres
  const handleToggleDoctor = async (docId: string, current: number) => {
    try {
      await trackedFetch(
        "/api/v1/doctors",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: docId, is_available: current === 1 ? 0 : 1 }),
        },
        `Toggle Doctor ${docId} availability -> ${current === 1 ? "OFF" : "ON"}`
      );
      fetchCRMData();
    } catch {}
  };

  // Add new Doctor & Shift
  const handleCreateDoctor = async (doctorData: Partial<Doctor>) => {
    try {
      const res = await trackedFetch(
        "/api/v1/doctors",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctorData),
        },
        `Add new Doctor (${doctorData.name})`
      );
      if (res.ok) {
        await fetchCRMData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Edit / Update Doctor Shift & Info
  const handleUpdateDoctor = async (doctorData: Partial<Doctor>) => {
    try {
      const res = await trackedFetch(
        "/api/v1/doctors",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctorData),
        },
        `Update Doctor (${doctorData.name})`
      );
      if (res.ok) {
        await fetchCRMData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Delete Doctor & Shift
  const handleDeleteDoctor = async (docId: string) => {
    try {
      const res = await trackedFetch(
        `/api/v1/doctors?id=${docId}`,
        {
          method: "DELETE",
        },
        `Delete Doctor record (${docId})`
      );
      if (res.ok) {
        await fetchCRMData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Update appointment status in Postgres
  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      await fetch("/api/v1/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });
      fetchCRMData();
    } catch {}
  };

  // Delete/Cancel appointment in Postgres
  const handleDeleteAppointment = async (appId: string) => {
    if (!confirm("Are you sure you want to cancel and remove this appointment?")) return;
    try {
      await fetch(`/api/v1/appointments?id=${appId}`, { method: "DELETE" });
      fetchCRMData();
    } catch {}
  };

  // 1-Click WhatsApp Reminder
  const handleSendWhatsApp = (app: Appointment) => {
    const cleanPhone = app.patient_phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Namaste ${app.patient_name},\nThis is a reminder for your Dental Appointment at Apex Dental Clinic on ${app.appointment_date} at ${app.appointment_time} with ${app.doctor_name} for ${app.treatment_name}.\n\nPlease arrive 10 minutes prior.\nAddress: ${clinic.address}\nClinic Contact: ${clinic.phone}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  // Open booking modal prefilled with slot
  const handleOpenBookingSlot = (timeSlot: string) => {
    setNewAppDate(selectedDate);
    setNewAppTime(timeSlot);
    setIsWalkinOpen(true);
  };

  // Create Walk-in appointment
  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newPatientPhone) return;

    try {
      await trackedFetch(
        "/api/v1/appointments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_name: newPatientName,
            patient_phone: newPatientPhone,
            appointment_date: newAppDate,
            appointment_time: newAppTime,
            treatment_name: newTreatment,
            booked_by: "Clinic Receptionist (Walk-in)",
          }),
        },
        `Book Appointment for ${newPatientName} (${newTreatment})`
      );
      setIsWalkinOpen(false);
      setNewPatientName("");
      setNewPatientPhone("");
      fetchCRMData();
    } catch {}
  };

  // Computed metrics
  const emergencyCount = appointments.filter((a) => a.is_emergency === 1).length;
  const totalRevenue = invoices.reduce((acc, i) => acc + (i.amount_paid || 0), 0);
  const pendingBalance = invoices.reduce((acc, i) => acc + (i.amount_balance || 0), 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#071326] flex flex-col items-center justify-center text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-sky-950/60 animate-pulse mb-4">
          <Stethoscope className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2.5 text-sm font-bold text-white tracking-wide">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Dental CRM Session...</span>
        </div>
        <div className="text-xs text-slate-400 mt-1.5 font-mono">Secured with 256-Bit JWT &amp; PostgreSQL</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071326] flex flex-col items-center justify-center text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-sky-950/60 animate-pulse mb-4">
          <Stethoscope className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2.5 text-sm font-bold text-white tracking-wide">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span>Redirecting to Apex Clinic Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clinic={clinic}
        appointmentsCount={appointments.length}
        patientsCount={patients.length}
        doctorsCount={doctors.length}
        servicesCount={services.length}
      />

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <Header activeTab={activeTab} onOpenBooking={() => setIsWalkinOpen(true)} />

        {/* BODY CONTAINER */}
        <main className="p-5 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewTab
              clinic={clinic}
              appointments={appointments}
              patients={patients}
              doctors={doctors}
              totalRevenue={totalRevenue}
              pendingBalance={pendingBalance}
              emergencyCount={emergencyCount}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarTab
              clinic={clinic}
              appointments={appointments}
              doctors={doctors}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              doctorFilter={doctorFilter}
              setDoctorFilter={setDoctorFilter}
              onOpenBookingSlot={handleOpenBookingSlot}
              onUpdateStatus={handleUpdateStatus}
              onDeleteAppointment={handleDeleteAppointment}
              onSendWhatsApp={handleSendWhatsApp}
            />
          )}

          {activeTab === "appointments" && (
            <AppointmentsTab
              appointments={appointments}
              onOpenBooking={() => setIsWalkinOpen(true)}
              onNavigateCalendar={() => setActiveTab("calendar")}
              onUpdateStatus={handleUpdateStatus}
              onDeleteAppointment={handleDeleteAppointment}
              onSendWhatsApp={handleSendWhatsApp}
            />
          )}

          {activeTab === "patients" && (
            <PatientsTab
              patients={patients}
              selectedTooth={selectedTooth}
              setSelectedTooth={setSelectedTooth}
            />
          )}

          {activeTab === "doctors" && (
            <DoctorsTab
              doctors={doctors}
              onToggleDoctor={handleToggleDoctor}
              onCreateDoctor={handleCreateDoctor}
              onUpdateDoctor={handleUpdateDoctor}
              onDeleteDoctor={handleDeleteDoctor}
            />
          )}

          {activeTab === "billing" && (
            <BillingTab
              clinic={clinic}
              services={services}
              invoices={invoices}
              patients={patients}
              onRefresh={fetchCRMData}
            />
          )}

          {activeTab === "clinic" && (
            <ClinicProfileTab clinic={clinic} doctors={doctors} services={services} />
          )}
        </main>
      </div>

      {/* BOOKING MODAL */}
      <BookingModal
        isOpen={isWalkinOpen}
        onClose={() => setIsWalkinOpen(false)}
        services={services}
        newPatientName={newPatientName}
        setNewPatientName={setNewPatientName}
        newPatientPhone={newPatientPhone}
        setNewPatientPhone={setNewPatientPhone}
        newAppDate={newAppDate}
        setNewAppDate={setNewAppDate}
        newAppTime={newAppTime}
        setNewAppTime={setNewAppTime}
        newTreatment={newTreatment}
        setNewTreatment={setNewTreatment}
        onSubmit={handleCreateWalkin}
      />

      {/* LIVE API TRAFFIC INSPECTOR */}
      <ApiTrackerModal />
    </div>
  );
}
