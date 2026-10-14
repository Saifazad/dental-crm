"use client";

import React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Service } from "@/types/crm";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  newPatientName: string;
  setNewPatientName: (name: string) => void;
  newPatientPhone: string;
  setNewPatientPhone: (phone: string) => void;
  newAppDate: string;
  setNewAppDate: (date: string) => void;
  newAppTime: string;
  setNewAppTime: (time: string) => void;
  newTreatment: string;
  setNewTreatment: (treatment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  services,
  newPatientName,
  setNewPatientName,
  newPatientPhone,
  setNewPatientPhone,
  newAppDate,
  setNewAppDate,
  newAppTime,
  setNewAppTime,
  newTreatment,
  setNewTreatment,
  onSubmit,
}: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="p-6 max-w-md w-full rounded-2xl border border-slate-200 bg-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-sky-600" />
            <span>Book Patient Appointment</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Patient Full Name</label>
            <input
              type="text"
              required
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
              placeholder="e.g. Varun Dhawan"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mobile Contact Number</label>
            <input
              type="text"
              required
              value={newPatientPhone}
              onChange={(e) => setNewPatientPhone(e.target.value)}
              placeholder="+91 98111 00000"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Consultation Date</label>
              <input
                type="date"
                required
                value={newAppDate}
                onChange={(e) => setNewAppDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Time Slot</label>
              <select
                value={newAppTime}
                onChange={(e) => setNewAppTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:15 AM">11:15 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:15 PM">04:15 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="05:30 PM">05:30 PM</option>
                <option value="06:30 PM">06:30 PM</option>
                <option value="07:30 PM">07:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Dental Treatment / Procedure</label>
            <select
              value={newTreatment}
              onChange={(e) => setNewTreatment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
            >
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.price_range})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-xs cursor-pointer"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
