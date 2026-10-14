"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Database,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/crm";

export default function AuthScreen() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("admin");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const res = await login(loginEmail, loginPassword);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Login failed. Please check credentials.");
    } else {
      setSuccessMsg("Logged in successfully! Redirecting...");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg("Please enter a valid work email.");
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please re-check.");
      return;
    }

    setLoading(true);
    const res = await register(regName, regEmail, regPassword, regRole);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Registration failed. Try again.");
    } else {
      setSuccessMsg("Account created and authenticated via JWT! Welcome aboard.");
    }
  };

  // Quick Demo Logins
  const handleQuickLogin = (email: string, pass: string) => {
    setMode("login");
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06101e] via-[#0b1b36] to-[#040914] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 rounded-2xl shadow-xl shadow-sky-950/50 ring-1 ring-white/20">
            <Stethoscope className="w-8 h-8 text-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Apex Dental Clinic
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                JWT Auth
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-Specialty &amp; Implant Hospital EHR System
            </p>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-[#0f2444]/80 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#09172d]/90 rounded-2xl border border-slate-700/60 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === "login"
                  ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md shadow-sky-950/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === "register"
                  ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md shadow-sky-950/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="doctor@apexdental.com"
                    className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-sky-400 font-medium cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-3.5 h-3.5 rounded bg-[#0a182d] border-slate-700 text-sky-600 focus:ring-0"
                  />
                  <span className="text-[11px]">Remember for 7 days</span>
                </label>
                <span className="text-[10px] text-teal-400 font-mono">JWT Bearer Cookie</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-sky-900/40 hover:shadow-sky-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to CRM Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Credentials Quick-Fill */}
              <div className="pt-4 border-t border-slate-700/60 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                  Quick Demo Access (One-Click)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@apexdental.com", "admin123")}
                    className="p-2 rounded-xl bg-[#09172d] hover:bg-[#122849] border border-slate-700/80 hover:border-sky-500/50 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[11px] font-semibold text-white group-hover:text-sky-300 flex items-center justify-between">
                      <span>Admin Doctor</span>
                      <ShieldCheck className="w-3 h-3 text-sky-400" />
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">admin@apexdental.com</div>
                    <div className="text-[9px] text-slate-500 font-mono">Pass: admin123</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin("reception@apexdental.com", "clinic123")}
                    className="p-2 rounded-xl bg-[#09172d] hover:bg-[#122849] border border-slate-700/80 hover:border-teal-500/50 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-[11px] font-semibold text-white group-hover:text-teal-300 flex items-center justify-between">
                      <span>Reception Desk</span>
                      <UserCheck className="w-3 h-3 text-teal-400" />
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">reception@apexdental.com</div>
                    <div className="text-[9px] text-slate-500 font-mono">Pass: clinic123</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Dr. Rajesh Mehra"
                    className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-4 py-2 text-xs outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="rajesh@apexdental.com"
                    className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-4 py-2 text-xs outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Clinic Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "admin", label: "Clinic Admin", desc: "Full Access" },
                    { id: "doctor", label: "Dentist / Doctor", desc: "OPD & Charts" },
                    { id: "receptionist", label: "Front Desk", desc: "Appointments" },
                    { id: "staff", label: "Clinic Staff", desc: "Assistance" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegRole(r.id as UserRole)}
                      className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                        regRole === r.id
                          ? "bg-sky-600/20 border-sky-500 text-white shadow-sm shadow-sky-950"
                          : "bg-[#09172d] border-slate-700/70 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <div className="text-[11px] font-bold text-slate-200">{r.label}</div>
                      <div className="text-[9px] text-slate-500">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-10 py-2 text-xs outline-none transition-all placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-4 py-2 text-xs outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-sky-900/40 hover:shadow-sky-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Register &amp; Get JWT Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info badge */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-sky-400" />
            <span>JWT Signed Session</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>PostgreSQL: dental_crm</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bcrypt Hashed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
