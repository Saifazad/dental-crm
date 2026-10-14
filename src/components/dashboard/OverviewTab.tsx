"use client";

import React from "react";
import {
  Calendar,
  CheckCircle2,
  Building2,
  Stethoscope,
  AlertTriangle,
} from "lucide-react";
import { Appointment, Clinic, Doctor, Patient, TabType } from "@/types/crm";

interface OverviewTabProps {
  clinic: Clinic;
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  totalRevenue: number;
  pendingBalance: number;
  emergencyCount: number;
  onNavigateTab: (tab: TabType) => void;
}

export default function OverviewTab({
  clinic,
  appointments,
  patients,
  doctors,
  totalRevenue,
  pendingBalance,
  emergencyCount,
  onNavigateTab,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Emergency Alert Banner */}
      {emergencyCount > 0 && (
        <div className="p-4 px-5 rounded-2xl border border-rose-200 bg-rose-50 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">
                {emergencyCount} Emergency Triage Cases Flagged:
              </span>
              <span className="text-xs text-rose-700 ml-2 font-medium">
                Patient requires immediate dental intervention for acute pain/trauma. Doctor review priority.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("calendar")}
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            View in Calendar →
          </button>
        </div>
      )}

      {/* EXECUTIVE CLINICAL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered Patients</div>
          <div className="text-2xl font-bold text-slate-900">{patients.length}</div>
          <div className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>PostgreSQL EHR Records</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Appointments</div>
          <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reception &amp; Scheduled Bookings</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Revenue Collected</div>
          <div className="text-2xl font-bold text-emerald-600">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-amber-700 font-semibold">
            Pending Balance: ₹{pendingBalance.toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clinic Operating Status</div>
          <div className="text-2xl font-bold text-sky-600">OPEN NOW</div>
          <div className="text-[11px] text-slate-600 font-medium">
            {clinic.opening_time || "10:00 AM"} – {clinic.closing_time || "08:30 PM"} (Mon-Sat)
          </div>
        </div>
      </div>

      {/* Doctor & Hospital Welcome Card */}
      <div className="p-6 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-blue-50/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 text-[11px] font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-sky-700" />
            <span>Multi-Specialty Dental Hospital</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-2">
            {clinic.name || "Apex Dental Multi-Specialty & Implant Clinic"}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            Comprehensive clinical workstation for dental surgeons, receptionists, and medical staff. Manage patient digital records, odontogram tooth charting, appointment queue, and daily treatment billings.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab("calendar")}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Open Appointment Calendar</span>
        </button>
      </div>

      {/* Recent Appointments & Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Today's Patient Appointments</span>
            </h3>
            <button
              onClick={() => onNavigateTab("calendar")}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
            >
              View Calendar ({appointments.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {appointments.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>{app.patient_name}</span>
                    {app.is_emergency === 1 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                        EMERGENCY
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {app.patient_phone} • <span className="font-semibold text-slate-800">{app.treatment_name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Doctor: {app.doctor_name} • Booked via {app.booked_by}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                    {app.appointment_time}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{app.appointment_date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctors On Duty Column */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Doctors On Duty</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">{doctors.length} Doctors</span>
          </div>

          <div className="space-y-3">
            {doctors.map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      doc.is_available === 1
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {doc.is_available === 1 ? "Available" : "On Leave"}
                  </span>
                </div>
                <div className="text-[11px] text-sky-700 font-semibold">{doc.specialization}</div>
                <div className="text-[10px] text-slate-500">
                  {doc.qualification} • {doc.experience_years} yrs exp
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
