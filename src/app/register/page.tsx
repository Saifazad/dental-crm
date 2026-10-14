"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Database,
  Sparkles,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/crm";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "None", color: "bg-slate-700" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) || /[A-Z]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-red-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-sky-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "Too short", color: "bg-slate-700" };
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg("Please enter your full name (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid work or personal email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify both fields.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("Please accept the terms and clinical EHR data privacy policy.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(trimmedName, trimmedEmail, password, role);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to create account. Please try again.");
        setLoading(false);
      } else {
        setSuccessMsg("Account created and authenticated via JWT! Redirecting to clinic...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 400);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  const roleOptions: { id: UserRole; title: string; desc: string }[] = [
    { id: "admin", title: "Clinic Admin", desc: "Full permissions & settings" },
    { id: "doctor", title: "Dentist / Doctor", desc: "OPD, Tooth Charts & Rx" },
    { id: "receptionist", title: "Front Desk", desc: "Queue & Appointments" },
    { id: "staff", title: "Clinic Staff", desc: "Chairside & Operations" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06101e] via-[#0b1b36] to-[#040914] text-slate-100 flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[32rem] h-[32rem] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg z-10 space-y-6">
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
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Staff Onboarding
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Create your clinical account &amp; receive a verified JWT session
            </p>
          </div>
        </div>

        {/* Card Box */}
        <div className="bg-[#0f2444]/80 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
          {/* Navigation Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#09172d]/90 rounded-2xl border border-slate-700/60 mb-6">
            <Link
              href="/login"
              className="py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
            <button
              type="button"
              className="py-2.5 text-xs font-bold rounded-xl transition-all cursor-default flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-md shadow-sky-950/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Feedback Alerts */}
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

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Full Name &amp; Title
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Mehra"
                  className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Work / Clinic Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@apexdental.com"
                  className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Assign Clinic Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all relative ${
                        isSelected
                          ? "bg-sky-600/25 border-sky-500 text-white shadow-sm shadow-sky-950"
                          : "bg-[#09172d] border-slate-700/70 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-200">
                          {r.title}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {r.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
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

              {/* Password strength meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Strength:</span>
                    <span
                      className={`font-semibold ${
                        passwordStrength.score >= 3
                          ? "text-emerald-400"
                          : passwordStrength.score === 2
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"
                      }`}
                    />
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.score >= 4 ? passwordStrength.color : "bg-transparent"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full bg-[#0a182d] border border-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-red-400 mt-1">Passwords do not match</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 rounded bg-[#0a182d] border-slate-700 text-sky-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 leading-tight">
                I agree to the Clinic EHR Security Guidelines and acknowledge patient data privacy standards.
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-sky-900/40 hover:shadow-sky-800/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account &amp; Issuing Token...</span>
                </>
              ) : (
                <>
                  <span>Register &amp; Issue JWT Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick link to login */}
          <div className="mt-4 pt-4 border-t border-slate-700/60 text-center">
            <span className="text-xs text-slate-400">Already registered on Apex Clinic? </span>
            <Link
              href="/login"
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold hover:underline"
            >
              Sign In here
            </Link>
          </div>
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
