"use client";

import React from "react";
import { Clock, Plus, LogOut, User as UserIcon } from "lucide-react";
import { TabType } from "@/types/crm";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  activeTab: TabType;
  onOpenBooking: () => void;
}

export default function Header({ activeTab, onOpenBooking }: HeaderProps) {
  const { user, logout } = useAuth();

  const titles: Record<TabType, string> = {
    overview: "Dental Clinic Executive Dashboard",
    calendar: "Interactive Clinical Appointment Calendar & Timetable",
    appointments: "Patient Queue & Dental Chair Appointments",
    patients: "Patient Directory & 32-Teeth Digital EHR Chart",
    doctors: "Doctor Roster & Timetable Schedules",
    billing: "Dental Procedures, Pricing & Invoices",
    clinic: "Clinic Profile, Operating Hours & Facilities",
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "doctor":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "receptionist":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
          {titles[activeTab]}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span className="font-semibold text-slate-800">OPD Hours:</span>
          <span>10:00 AM – 08:30 PM</span>
        </div>

        <button
          onClick={onOpenBooking}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Book Patient</span>
        </button>

        {/* User Profile Chip & Logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {user.name}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out / Logout"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
