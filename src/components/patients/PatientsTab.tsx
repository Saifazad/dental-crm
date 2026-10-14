"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Patient } from "@/types/crm";

interface PatientsTabProps {
  patients: Patient[];
  selectedTooth: number | null;
  setSelectedTooth: (tooth: number) => void;
}

export default function PatientsTab({
  patients,
  selectedTooth,
  setSelectedTooth,
}: PatientsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Patients List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Patient Electronic Health Records (EHR)</h2>
            <p className="text-xs text-slate-500">Medical histories, blood groups, and critical allergy alerts.</p>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search patient name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">Blood Group</th>
                <th className="py-3 px-3">Medical Alerts / Allergies</th>
                <th className="py-3 px-3">Total Visits</th>
                <th className="py-3 px-3">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-all">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{p.phone}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {p.age} yrs • {p.gender}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {p.blood_group}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {p.medical_alerts && p.medical_alerts !== "None" ? (
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ⚠️ {p.medical_alerts}
                      </span>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">{p.total_visits}</td>
                  <td className="py-3 px-3 text-slate-500">{p.last_visit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 32-TEETH ODONTOGRAM CHART */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Interactive 32-Teeth Odontogram (Digital Dental Chart)</span>
          </h3>
          <p className="text-xs text-slate-500">Standard FDI notation. Click on any tooth to view or map condition.</p>
        </div>

        {/* Upper Jaw (Teeth 1 - 16) */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Upper Jaw (Maxillary Teeth 1 – 16)
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
            {Array.from({ length: 16 }, (_, i) => i + 1).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTooth(t)}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer ${
                  selectedTooth === t
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : t === 16
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-400 hover:bg-sky-50"
                }`}
              >
                <div className="text-base">🦷</div>
                <div className="text-[10px] mt-1 font-mono font-bold">#{t}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Lower Jaw (Teeth 17 - 32) */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Lower Jaw (Mandibular Teeth 17 – 32)
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
            {Array.from({ length: 16 }, (_, i) => i + 17).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTooth(t)}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer ${
                  selectedTooth === t
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-400 hover:bg-sky-50"
                }`}
              >
                <div className="text-base">🦷</div>
                <div className="text-[10px] mt-1 font-mono font-bold">#{t}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedTooth && (
          <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-900">Selected Tooth #{selectedTooth}:</span>
              <span className="text-slate-700 ml-2 font-medium">
                {selectedTooth === 16
                  ? "Deep Occlusal Cavity (Requires RCT or Restoration)"
                  : "Healthy / Normal Anatomy"}
              </span>
            </div>
            <span className="text-[11px] text-sky-700 font-semibold bg-white px-2.5 py-1 rounded-md border border-sky-200">
              Status: Mapped in EHR
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
