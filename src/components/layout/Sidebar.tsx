"use client";

import React from "react";
import {
  Stethoscope,
  Activity,
  Calendar,
  FileText,
  Users,
  UserCheck,
  DollarSign,
  Building2,
  LogOut,
  Shield,
} from "lucide-react";
import { Clinic, TabType } from "@/types/crm";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  clinic: Clinic;
  appointmentsCount: number;
  patientsCount: number;
  doctorsCount: number;
  servicesCount: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  clinic,
  appointmentsCount,
  patientsCount,
  doctorsCount,
  servicesCount,
}: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0c1f38] flex flex-col justify-between shrink-0 hidden md:flex text-slate-300">
      <div className="p-5 space-y-6">
        {/* Logo & Clinic Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-900/40">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Apex Dental</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                CLINIC
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Hospital EHR &amp; CRM</div>
          </div>
        </div>

        {/* Branch / Active OPD Status */}
        <div className="p-3 rounded-xl bg-[#132847] border border-slate-700/60 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Branch</span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active OPD
            </span>
          </div>
          <div className="text-white font-bold truncate">{clinic.city}</div>
          <div className="text-[11px] text-sky-300 font-medium">{clinic.phone}</div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-sky-600 text-white shadow-md shadow-sky-900/40"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Clinic Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "calendar"
                ? "bg-sky-600 text-white shadow-md shadow-sky-900/40"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Calendar &amp; Schedule</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "appointments"
                ? "bg-sky-600 text-white shadow-md shadow-sky-900/40"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Appointments Hub</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-200">
              {appointmentsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("patients")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "patients"
                ? "bg-sky-600 text-white shadow-md shadow-sky-900/40"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Patients &amp; Tooth EHR</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-200">
              {patientsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("doctors")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "doctors"
                ? "bg-sky-600 text-white shadow-md shadow-sky-900/40"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Doctors &amp; Shifts</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-200">
              {doctorsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "billing"
                ? "bg-sky-600 text-white shadow-md shadow-sky-900/40"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Treatments &amp; Invoices</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-200">
              {servicesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("clinic")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "clinic"
                ? "bg-sky-600 text-white shadow-md shadow-sky-900/40"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Clinic Profile &amp; Hours</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          </button>
        </nav>
      </div>

      {/* Sidebar Footer: User profile & PostgreSQL Status */}
      <div className="border-t border-slate-800 bg-[#0a182d]">
        {user && (
          <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-sky-400 capitalize font-medium flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  <span>{user.role}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="p-3 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">PostgreSQL:</span>
            <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected (5432)
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">DB: dental_crm • JWT Verified</div>
        </div>
      </div>
    </aside>
  );
}
