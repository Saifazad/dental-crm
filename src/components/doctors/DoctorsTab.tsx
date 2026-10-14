"use client";

import React, { useState, useMemo } from "react";
import { Doctor } from "@/types/crm";
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  Sun,
  Moon,
  Sparkles,
  Search,
  Filter,
  Stethoscope,
  Calendar,
  X,
  Check,
} from "lucide-react";

interface DoctorsTabProps {
  doctors: Doctor[];
  onToggleDoctor: (docId: string, current: number) => void;
  onCreateDoctor: (doc: Partial<Doctor>) => Promise<boolean>;
  onUpdateDoctor: (doc: Partial<Doctor>) => Promise<boolean>;
  onDeleteDoctor: (docId: string) => Promise<boolean>;
}

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SPECIALIZATION_PRESETS = [
  "Senior Implantologist",
  "Root Canal Specialist (Endodontist)",
  "Kids & Aesthetic Dentist (Pedodontist)",
  "Orthodontist & Dentofacial Orthopedics",
  "Oral & Maxillofacial Surgeon",
  "Periodontist (Gum Specialist)",
  "Prosthodontist & Crown Specialist",
  "General Dental Practitioner",
];

const SHIFT_PRESETS = [
  {
    label: "Morning OPD Session",
    timing: "09:30 AM - 01:30 PM (Morning OPD)",
    type: "morning",
    icon: Sun,
  },
  {
    label: "Evening Clinical Shift",
    timing: "02:30 PM - 08:30 PM (Evening Shift)",
    type: "evening",
    icon: Moon,
  },
  {
    label: "Full Day Clinical Shift",
    timing: "10:00 AM - 07:00 PM (Full Day Shift)",
    type: "fullday",
    icon: Sparkles,
  },
];

export default function DoctorsTab({
  doctors,
  onToggleDoctor,
  onCreateDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
}: DoctorsTabProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    specialization: "",
    experience_years: 5,
    fee: 500,
    is_available: 1,
    working_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    shift_time: "09:30 AM - 01:30 PM (Morning OPD)",
    customShift: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Open modal for Adding new Doctor
  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingDoctorId(null);
    setFormData({
      name: "",
      qualification: "BDS, MDS",
      specialization: "General Dental Practitioner",
      experience_years: 5,
      fee: 500,
      is_available: 1,
      working_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      shift_time: "09:30 AM - 01:30 PM (Morning OPD)",
      customShift: false,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // Open modal for Editing existing Doctor
  const handleOpenEdit = (doc: Doctor) => {
    setModalMode("edit");
    setEditingDoctorId(doc.id);
    const daysArray = doc.working_days
      ? doc.working_days.split(",").map((d) => d.trim()).filter(Boolean)
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const isPreset = SHIFT_PRESETS.some((s) => s.timing === doc.shift_time);

    setFormData({
      name: doc.name || "",
      qualification: doc.qualification || "",
      specialization: doc.specialization || "",
      experience_years: doc.experience_years || 0,
      fee: doc.fee || 500,
      is_available: doc.is_available === 1 ? 1 : 0,
      working_days: daysArray,
      shift_time: doc.shift_time || "09:30 AM - 01:30 PM (Morning OPD)",
      customShift: !isPreset && !!doc.shift_time,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // Toggle day selection
  const handleToggleDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.working_days.includes(day);
      if (exists) {
        if (prev.working_days.length === 1) return prev; // Keep at least one
        return { ...prev, working_days: prev.working_days.filter((d) => d !== day) };
      } else {
        return { ...prev, working_days: [...prev.working_days, day] };
      }
    });
  };

  // Set day preset
  const handleSetDayPreset = (preset: "mon-sat" | "mon-fri" | "all" | "weekends") => {
    if (preset === "mon-sat") {
      setFormData((p) => ({ ...p, working_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }));
    } else if (preset === "mon-fri") {
      setFormData((p) => ({ ...p, working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"] }));
    } else if (preset === "all") {
      setFormData((p) => ({ ...p, working_days: ALL_DAYS }));
    } else if (preset === "weekends") {
      setFormData((p) => ({ ...p, working_days: ["Sat", "Sun"] }));
    }
  };

  // Submit Add or Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Doctor's name is required.");
      return;
    }
    if (!formData.shift_time.trim()) {
      setErrorMessage("Shift timing is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload: Partial<Doctor> = {
        name: formData.name.trim(),
        qualification: formData.qualification.trim(),
        specialization: formData.specialization.trim(),
        experience_years: Number(formData.experience_years) || 0,
        fee: Number(formData.fee) || 0,
        is_available: formData.is_available,
        working_days: formData.working_days.join(","),
        shift_time: formData.shift_time.trim(),
      };

      let success = false;
      if (modalMode === "add") {
        success = await onCreateDoctor(payload);
      } else if (modalMode === "edit" && editingDoctorId) {
        success = await onUpdateDoctor({ ...payload, id: editingDoctorId });
      }

      if (success) {
        setIsModalOpen(false);
      } else {
        setErrorMessage("Failed to save doctor shift. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete with Confirmation
  const handleDeleteClick = async (doc: Doctor) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${doc.name} and their clinical shifts?\n\nExisting past appointment records will be preserved safely.`
    );
    if (!isConfirmed) return;

    const ok = await onDeleteDoctor(doc.id);
    if (!ok) {
      alert("Failed to delete doctor shift. Please try again.");
    }
  };

  // Helper for Shift Badge styling
  const getShiftBadge = (shiftStr?: string) => {
    const s = (shiftStr || "").toLowerCase();
    if (s.includes("morning") || s.includes("subah")) {
      return {
        label: shiftStr || "Morning OPD",
        bg: "bg-amber-50 text-amber-900 border-amber-200/80",
        icon: Sun,
        iconColor: "text-amber-600",
      };
    }
    if (s.includes("evening") || s.includes("shaam") || s.includes("night")) {
      return {
        label: shiftStr || "Evening Shift",
        bg: "bg-indigo-50 text-indigo-900 border-indigo-200/80",
        icon: Moon,
        iconColor: "text-indigo-600",
      };
    }
    return {
      label: shiftStr || "Full Day OPD",
      bg: "bg-sky-50 text-sky-900 border-sky-200/80",
      icon: Sparkles,
      iconColor: "text-sky-600",
    };
  };

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Search
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.shift_time || "").toLowerCase().includes(searchQuery.toLowerCase());

      // Shift filter
      let matchesShift = true;
      const s = (doc.shift_time || "").toLowerCase();
      if (shiftFilter === "morning") {
        matchesShift = s.includes("morning") || s.includes("subah");
      } else if (shiftFilter === "evening") {
        matchesShift = s.includes("evening") || s.includes("shaam");
      } else if (shiftFilter === "fullday") {
        matchesShift = s.includes("full") || (!s.includes("morning") && !s.includes("evening"));
      }

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "available") {
        matchesStatus = doc.is_available === 1;
      } else if (statusFilter === "leave") {
        matchesStatus = doc.is_available === 0;
      }

      return matchesSearch && matchesShift && matchesStatus;
    });
  }, [doctors, searchQuery, shiftFilter, statusFilter]);

  // Statistics
  const totalDoctors = doctors.length;
  const activeDutyCount = doctors.filter((d) => d.is_available === 1).length;
  const morningShiftCount = doctors.filter((d) => (d.shift_time || "").toLowerCase().includes("morning")).length;
  const eveningShiftCount = doctors.filter((d) => (d.shift_time || "").toLowerCase().includes("evening")).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Stethoscope className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Doctors &amp; Clinical Shift Management
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Add new doctors, set morning/evening shift timings, manage weekly working rosters, and update consultation availability.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Doctor &amp; Shift</span>
          </button>
        </div>

        {/* Quick Shift Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Doctors</div>
              <div className="text-lg font-bold text-slate-900">{totalDoctors}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">On Active Duty</div>
              <div className="text-lg font-bold text-emerald-900">{activeDutyCount}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Morning OPD</div>
              <div className="text-lg font-bold text-amber-900">{morningShiftCount}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">Evening Shifts</div>
              <div className="text-lg font-bold text-indigo-900">{eveningShiftCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor by name, qualification, or specialty..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Shift Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Shifts</option>
              <option value="morning">Morning OPD</option>
              <option value="evening">Evening Shift</option>
              <option value="fullday">Full Day Shift</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Availability</option>
              <option value="available">● Available On Duty</option>
              <option value="leave">○ On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Shift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDoctors.map((d) => {
          const shiftBadge = getShiftBadge(d.shift_time);
          const ShiftIcon = shiftBadge.icon;
          const workingDaysList = d.working_days
            ? d.working_days.split(",").map((s) => s.trim())
            : ALL_DAYS.slice(0, 6);

          return (
            <div
              key={d.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              {/* Doctor Card Top Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {d.name.replace("Dr. ", "").charAt(0) || "D"}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{d.name}</div>
                      <div className="text-xs text-sky-700 font-semibold">{d.qualification}</div>
                      <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {d.specialization}
                      </span>
                    </div>
                  </div>

                  {/* Availability Toggle Button */}
                  <button
                    onClick={() => onToggleDoctor(d.id, d.is_available)}
                    title={d.is_available === 1 ? "Click to set On Leave" : "Click to set Available"}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                      d.is_available === 1
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
                    }`}
                  >
                    {d.is_available === 1 ? "● Available" : "○ On Leave"}
                  </button>
                </div>

                {/* Shift Timings Badge */}
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${shiftBadge.bg}`}>
                  <ShiftIcon className={`w-4 h-4 shrink-0 ${shiftBadge.iconColor}`} />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Shift Timing:
                    </span>
                    <span className="truncate">{d.shift_time || "10:00 AM - 02:00 PM (Morning)"}</span>
                  </div>
                </div>

                {/* Working Days Roster */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Weekly Shift Schedule:
                    </span>
                    <span className="font-semibold text-slate-700">
                      {workingDaysList.length} Days/Wk
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {ALL_DAYS.map((day) => {
                      const isActive = workingDaysList.includes(day);
                      return (
                        <span
                          key={day}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isActive
                              ? "bg-sky-600 text-white border-sky-600 shadow-2xs"
                              : "bg-slate-100 text-slate-400 border-slate-200"
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Consultation Details & Edit/Delete Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Consultation Fee</span>
                    <span className="font-bold text-emerald-700 text-sm">₹{d.fee}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Experience</span>
                    <span className="font-semibold text-slate-800">{d.experience_years} Years</span>
                  </div>
                </div>

                {/* Action Buttons: Edit Shift & Delete */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleOpenEdit(d)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Shift</span>
                  </button>

                  <button
                    onClick={() => handleDeleteClick(d)}
                    title="Delete Doctor & Shift"
                    className="py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 font-semibold text-xs transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredDoctors.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Doctor Shifts Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No doctors match your filter criteria. Try adjusting the search query or click Add Doctor to create a new shift schedule.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Doctor Shift</span>
            </button>
          </div>
        )}
      </div>

      {/* ADD / EDIT DOCTOR & SHIFT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {modalMode === "add" ? "Add Doctor & Shift Schedule" : "Edit Doctor & Shift Schedule"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {modalMode === "add"
                      ? "Create a new doctor profile and set shift roster."
                      : "Modify consultation shift timings and working days."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 overflow-y-auto text-xs">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Doctor Name & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Doctor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. BDS, MDS (Prostho)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Specialization</label>
                <div className="space-y-2">
                  <select
                    value={
                      SPECIALIZATION_PRESETS.includes(formData.specialization)
                        ? formData.specialization
                        : "Other"
                    }
                    onChange={(e) => {
                      if (e.target.value !== "Other") {
                        setFormData({ ...formData, specialization: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                  >
                    {SPECIALIZATION_PRESETS.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                    <option value="Other">Custom Specialty / Other</option>
                  </select>

                  {(!SPECIALIZATION_PRESETS.includes(formData.specialization) ||
                    formData.specialization === "Other") && (
                    <input
                      type="text"
                      value={formData.specialization === "Other" ? "" : formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="Type custom specialization..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  )}
                </div>
              </div>

              {/* Shift Timing Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Clinical Shift &amp; Timings *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, customShift: !formData.customShift })}
                    className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold cursor-pointer underline"
                  >
                    {formData.customShift ? "Choose Preset Shift" : "Enter Custom Timing"}
                  </button>
                </div>

                {!formData.customShift ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SHIFT_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = formData.shift_time === preset.timing;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, shift_time: preset.timing })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-sky-50 border-sky-400 text-sky-900 shadow-2xs ring-1 ring-sky-400"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon
                              className={`w-3.5 h-3.5 ${
                                preset.type === "morning"
                                  ? "text-amber-600"
                                  : preset.type === "evening"
                                  ? "text-indigo-600"
                                  : "text-sky-600"
                              }`}
                            />
                            <span className="font-bold text-[11px]">{preset.label}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {preset.timing.replace(/ \(.*\)/, "")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.shift_time}
                    onChange={(e) => setFormData({ ...formData, shift_time: e.target.value })}
                    placeholder="e.g. 10:30 AM - 02:30 PM (Morning Specialty Shift)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                )}
              </div>

              {/* Working Days Roster Picker */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Working Days (Shift Schedule)</span>
                  </label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleSetDayPreset("mon-sat")}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer font-medium"
                    >
                      Mon-Sat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetDayPreset("mon-fri")}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer font-medium"
                    >
                      Mon-Fri
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetDayPreset("all")}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer font-medium"
                    >
                      All 7 Days
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {ALL_DAYS.map((day) => {
                    const isSelected = formData.working_days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-sky-600 text-white border-sky-600 shadow-2xs"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Fee & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={formData.experience_years}
                    onChange={(e) =>
                      setFormData({ ...formData, experience_years: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Availability Status */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Current Status</div>
                  <div className="text-[11px] text-slate-500">
                    Set whether this doctor is currently on duty or on leave.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_available: formData.is_available === 1 ? 0 : 1 })
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    formData.is_available === 1
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-rose-50 text-rose-800 border-rose-300"
                  }`}
                >
                  {formData.is_available === 1 ? "● Available on Shift" : "○ On Leave"}
                </button>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{modalMode === "add" ? "Create Doctor & Shift" : "Save Changes"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
