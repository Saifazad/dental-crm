"use client";

import React, { useState } from "react";
import { Plus, Calendar, MessageSquare, Trash2, Search } from "lucide-react";
import { Appointment } from "@/types/crm";

interface AppointmentsTabProps {
  appointments: Appointment[];
  onOpenBooking: () => void;
  onNavigateCalendar: () => void;
  onUpdateStatus: (appId: string, newStatus: string) => void;
  onDeleteAppointment: (appId: string) => void;
  onSendWhatsApp: (app: Appointment) => void;
}

export default function AppointmentsTab({
  appointments,
  onOpenBooking,
  onNavigateCalendar,
  onUpdateStatus,
  onDeleteAppointment,
  onSendWhatsApp,
}: AppointmentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = appointments.filter(
    (app) =>
      app.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient_phone.includes(searchTerm) ||
      app.treatment_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Dental Chair Appointments &amp; Patient Queue</h2>
          <p className="text-xs text-slate-500">Live PostgreSQL bookings synchronized with reception desk.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search patient, phone, procedure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 w-56"
            />
          </div>
          <button
            onClick={onNavigateCalendar}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Calendar View</span>
          </button>
          <button
            onClick={onOpenBooking}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Book New</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Patient Details</th>
              <th className="py-3 px-3">Treatment Procedure</th>
              <th className="py-3 px-3">Attending Doctor</th>
              <th className="py-3 px-3">Date &amp; Time</th>
              <th className="py-3 px-3">Booked By</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/70 transition-all">
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900">{app.patient_name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{app.patient_phone}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-slate-800">{app.treatment_name}</div>
                  {app.notes && <div className="text-[10px] text-slate-500 italic mt-0.5">{app.notes}</div>}
                </td>
                <td className="py-3.5 px-3 text-slate-700 font-medium">{app.doctor_name}</td>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-sky-700">{app.appointment_time}</div>
                  <div className="text-[10px] text-slate-500">{app.appointment_date}</div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                    {app.booked_by}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                    className="text-[10px] font-bold px-2 py-1 rounded-md border cursor-pointer focus:outline-none bg-slate-50 text-slate-800"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Waiting in OPD">Waiting in OPD</option>
                    <option value="In Chair">In Chair</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSendWhatsApp(app)}
                      title="Send WhatsApp Reminder"
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAppointment(app.id)}
                      title="Cancel & Delete"
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
