"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Clock,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Appointment, Clinic, Doctor } from "@/types/crm";

interface CalendarTabProps {
  clinic: Clinic;
  appointments: Appointment[];
  doctors: Doctor[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  doctorFilter: string;
  setDoctorFilter: (doc: string) => void;
  onOpenBookingSlot: (timeSlot: string) => void;
  onUpdateStatus: (appId: string, newStatus: string) => void;
  onDeleteAppointment: (appId: string) => void;
  onSendWhatsApp: (app: Appointment) => void;
}

export default function CalendarTab({
  clinic,
  appointments,
  doctors,
  selectedDate,
  setSelectedDate,
  doctorFilter,
  setDoctorFilter,
  onOpenBookingSlot,
  onUpdateStatus,
  onDeleteAppointment,
  onSendWhatsApp,
}: CalendarTabProps) {
  const todayISO = new Date().toISOString().split("T")[0];
  const [calendarViewMonth, setCalendarViewMonth] = useState<Date>(new Date());

  // Date normalization helper
  const isDateMatch = (appDate: string, targetDateStr: string) => {
    if (!appDate) return false;
    const tomorrowISO = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    if (appDate.toLowerCase() === "today" && targetDateStr === todayISO) return true;
    if (appDate.toLowerCase() === "tomorrow" && targetDateStr === tomorrowISO) return true;
    return appDate === targetDateStr;
  };

  // Filtered appointments for selected date in Calendar
  const calendarAppointments = appointments.filter((app) => {
    const dateMatches = isDateMatch(app.appointment_date, selectedDate);
    const doctorMatches = doctorFilter === "all" || app.doctor_name === doctorFilter;
    return dateMatches && doctorMatches;
  });

  // Mini Calendar Month calculations
  const year = calendarViewMonth.getFullYear();
  const month = calendarViewMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = calendarViewMonth.toLocaleString("default", { month: "long", year: "numeric" });

  // Standard OPD Clinical Slots
  const scheduleSlots = [
    { time: "10:00 AM", label: "Morning Session 1" },
    { time: "11:00 AM", label: "Morning Session 2" },
    { time: "11:15 AM", label: "Rotary RCT Slot" },
    { time: "12:00 PM", label: "Prosthetics / Crown" },
    { time: "12:30 PM", label: "OPD Consultation" },
    { time: "01:00 PM", label: "Pre-Lunch Procedure" },
    { time: "LUNCH_BREAK", label: "Sterilization & Doctor Break (01:30 PM - 02:30 PM)" },
    { time: "02:30 PM", label: "Afternoon Session" },
    { time: "03:30 PM", label: "Aligners & Orthodontics" },
    { time: "04:15 PM", label: "Crown Trial & Laser" },
    { time: "05:00 PM", label: "Evening Session 1" },
    { time: "05:30 PM", label: "Evening Session 2" },
    { time: "06:30 PM", label: "Late OPD Patient" },
    { time: "07:30 PM", label: "Closing Consultation" },
  ];

  return (
    <div className="space-y-6">
      {/* Calendar Filter & Navigation Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split("T")[0]);
              }}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-all cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(todayISO)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedDate === todayISO ? "bg-sky-600 text-white shadow-2xs" : "text-slate-700 hover:bg-white"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split("T")[0]);
              }}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-all cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <span className="text-[11px] text-slate-500">
              {calendarAppointments.length} appointment(s) scheduled for this date
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Date Picker Input */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <CalendarIcon className="w-3.5 h-3.5 text-sky-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
            />
          </div>

          {/* Doctor Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onOpenBookingSlot("11:15 AM")}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book on this Date</span>
          </button>
        </div>
      </div>

      {/* Main Calendar View: Mini Calendar + Daily Timetable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mini Monthly Calendar Widget */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">{monthName}</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCalendarViewMonth(new Date(year, month - 1, 1))}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCalendarViewMonth(new Date(year, month + 1, 1))}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="py-1 text-[11px] font-bold text-slate-400">
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="py-2" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const thisDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const isSelected = selectedDate === thisDateStr;
                const isToday = todayISO === thisDateStr;
                const countOnDay = appointments.filter((a) => isDateMatch(a.appointment_date, thisDateStr)).length;

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDate(thisDateStr)}
                    className={`py-2 rounded-xl text-xs font-semibold relative transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-600 text-white font-bold shadow-xs"
                        : isToday
                        ? "bg-sky-50 text-sky-700 font-bold border border-sky-300"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {countOnDay > 0 && (
                      <span
                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-white" : "bg-sky-600"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Summary Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Date Schedule Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Total Bookings:</span>
                <span className="font-bold text-slate-900">{calendarAppointments.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
                <span>Confirmed Patients:</span>
                <span className="font-bold">
                  {calendarAppointments.filter((a) => a.status === "Confirmed").length}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
                <span>In Chair / Waiting:</span>
                <span className="font-bold">
                  {calendarAppointments.filter((a) => a.status === "In Chair" || a.status === "Waiting in OPD").length}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-800">
                <span>Emergency Cases:</span>
                <span className="font-bold">
                  {calendarAppointments.filter((a) => a.is_emergency === 1).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hourly Dental Chair Timetable / Slot Schedule */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Daily Dental Chair Timetable</span>
              </h3>
              <p className="text-xs text-slate-500">Live chair occupancy, doctor assignments, and slot status.</p>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmed
              </span>
              <span className="flex items-center gap-1 text-blue-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> In Chair
              </span>
              <span className="flex items-center gap-1 text-slate-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-slate-300" /> Free Slot
              </span>
            </div>
          </div>

          {/* Hourly Timetable Slots */}
          <div className="space-y-3">
            {scheduleSlots.map((slot) => {
              if (slot.time === "LUNCH_BREAK") {
                return (
                  <div
                    key={slot.time}
                    className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>{slot.label}</span>
                  </div>
                );
              }

              const appInSlot = calendarAppointments.find(
                (a) => a.appointment_time.trim().toUpperCase() === slot.time.toUpperCase()
              );

              if (appInSlot) {
                return (
                  <div
                    key={slot.time}
                    className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs font-mono shrink-0 shadow-2xs">
                        {slot.time}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{appInSlot.patient_name}</span>
                          {appInSlot.is_emergency === 1 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300">
                              EMERGENCY
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {appInSlot.treatment_name} • Attending:{" "}
                          <span className="font-semibold text-slate-800">{appInSlot.doctor_name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Phone: {appInSlot.patient_phone} • Booked via {appInSlot.booked_by}
                        </div>
                      </div>
                    </div>

                    {/* Actions & Status Dropdown */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={appInSlot.status}
                        onChange={(e) => onUpdateStatus(appInSlot.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                          appInSlot.status === "In Chair"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : appInSlot.status === "Waiting in OPD"
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : appInSlot.status === "Completed"
                            ? "bg-slate-100 text-slate-700 border-slate-300"
                            : appInSlot.status === "Cancelled"
                            ? "bg-rose-100 text-rose-800 border-rose-300"
                            : "bg-emerald-100 text-emerald-800 border-emerald-300"
                        }`}
                      >
                        <option value="Confirmed">🟢 Confirmed</option>
                        <option value="Waiting in OPD">🟡 Waiting in OPD</option>
                        <option value="In Chair">🔵 In Chair</option>
                        <option value="Completed">⚪ Completed</option>
                        <option value="Cancelled">🔴 Cancelled</option>
                      </select>

                      <button
                        onClick={() => onSendWhatsApp(appInSlot)}
                        title="Send WhatsApp Reminder"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteAppointment(appInSlot.id)}
                        title="Cancel & Delete Appointment"
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              }

              // Empty Slot
              return (
                <div
                  key={slot.time}
                  className="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 w-20">
                      {slot.time}
                    </span>
                    <span className="text-xs text-slate-400 italic">
                      Available Dental Chair Slot ({slot.label})
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenBookingSlot(slot.time)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Book Slot</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
