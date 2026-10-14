"use client";

import React from "react";
import { MapPin, Phone, Clock, Activity, Stethoscope } from "lucide-react";
import { Clinic, Doctor, Service } from "@/types/crm";

interface ClinicProfileTabProps {
  clinic: Clinic;
  doctors: Doctor[];
  services: Service[];
}

export default function ClinicProfileTab({
  clinic,
  doctors,
  services,
}: ClinicProfileTabProps) {
  return (
    <div className="space-y-6">
      {/* Clinic Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              Verified Multi-Specialty Dental Hospital
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">{clinic.name}</h2>
            <p className="text-xs text-sky-700 font-semibold">{clinic.tagline}</p>
          </div>
          <div>
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Clinic Status: OPEN
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{clinic.address}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{clinic.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {clinic.opening_time || "10:00 AM"} – {clinic.closing_time || "08:30 PM"} (Mon-Sat)
            </span>
          </div>
        </div>
      </div>

      {/* Working Hours & Shift Timings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Daily Operating &amp; Consultation Timings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Morning OPD Session:</span>
              <span className="font-bold text-emerald-700">10:00 AM – 01:30 PM</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Sterilization &amp; Lunch Break:</span>
              <span className="font-bold text-amber-700">01:30 PM – 02:30 PM</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Evening OPD &amp; Surgeries:</span>
              <span className="font-bold text-sky-700">02:30 PM – 08:30 PM</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Sunday Operation:</span>
              <span className="font-bold text-rose-700">Closed (Emergency Only)</span>
            </div>
          </div>
        </div>

        {/* Infrastructure & System Details */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Clinic CRM Infrastructure &amp; Security</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Primary Database:</span>
              <span className="font-mono font-bold text-emerald-700">PostgreSQL (dental_crm:5432)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Data Storage:</span>
              <span className="font-bold text-sky-800">Local Clinic On-Premise EHR</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Active Medical Staff:</span>
              <span className="font-bold text-slate-900">{doctors.length} Doctors • Full Team</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Offered Procedures:</span>
              <span className="font-bold text-purple-700">{services.length} Dental Treatments Cataloged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Summary List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-sky-600" />
          <span>Doctors on Roll &amp; Duty Schedule</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.is_available === 1
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {doc.is_available === 1 ? "Available" : "On Leave"}
                </span>
              </div>
              <div className="text-[11px] text-sky-700 font-semibold">{doc.specialization}</div>
              <div className="text-[10px] text-slate-500">
                {doc.qualification} • {doc.experience_years} yrs exp
              </div>
              {doc.shift_time && (
                <div className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  🕒 {doc.shift_time}
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-600">Consultation:</span>
                <span className="font-bold text-emerald-700">₹{doc.fee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
