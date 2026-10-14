"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Database,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(trimmedEmail, password);
      if (!res.success) {
        setErrorMsg(res.error || "Invalid credentials. Please verify your email and password.");
        setLoading(false);
      } else {
        setSuccessMsg("Authentication successful! Loading clinic dashboard...");
        // Fast client router push to dashboard
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 300);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06101e] via-[#0b1b36] to-[#040914] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[32rem] h-[32rem] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

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
          {/* Navigation Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#09172d]/90 rounded-2xl border border-slate-700/60 mb-6">
            <button
              type="button"
              className="py-2.5 text-xs font-bold rounded-xl transition-all cursor-default flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md shadow-sky-950/50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <Link
              href="/register"
              className="py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@apexdental.com"
                  className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <span className="text-[10px] text-sky-400 font-medium hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#0a182d] border-slate-700 text-sky-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px]">Remember for 7 days</span>
              </label>
              <span className="text-[10px] text-teal-400 font-mono">HttpOnly JWT</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-sky-900/40 hover:shadow-sky-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to CRM Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Access Credentials */}
            <div className="pt-4 border-t border-slate-700/60 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Quick Demo Access (1-Click Fill)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill("admin@apexdental.com", "admin123")}
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
                  onClick={() => handleQuickFill("reception@apexdental.com", "clinic123")}
                  className="p-2 rounded-xl bg-[#09172d] hover:bg-[#122849] border border-slate-700/80 hover:border-teal-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-semibold text-white group-hover:text-teal-300 flex items-center justify-between">
                    <span>Front Desk</span>
                    <UserCheck className="w-3 h-3 text-teal-400" />
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">reception@apexdental.com</div>
                  <div className="text-[9px] text-slate-500 font-mono">Pass: clinic123</div>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-sky-400" />
            <span>JWT HS256 Token</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>PostgreSQL 5432</span>
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
