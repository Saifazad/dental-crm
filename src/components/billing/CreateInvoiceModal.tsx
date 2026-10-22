"use client";

import React, { useState } from "react";
import { Receipt, X, Plus } from "lucide-react";
import { Service, Patient } from "@/types/crm";
import { trackedFetch } from "@/lib/api-logger";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  patients: Patient[];
  onCreated: () => void;
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  services,
  patients,
  onCreated,
}: CreateInvoiceModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [treatmentName, setTreatmentName] = useState(services[0]?.name || "Teeth Cleaning & Air-Flow Polishing");
  const [amountTotal, setAmountTotal] = useState<number>(services[0]?.base_price || 1800);
  const [amountPaid, setAmountPaid] = useState<number>(services[0]?.base_price || 1800);
  const [paymentMethod, setPaymentMethod] = useState("UPI / GPay / PhonePe");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePatientSelect = (pId: string) => {
    setSelectedPatientId(pId);
    const pat = patients.find((p) => p.id === pId);
    if (pat) {
      setPatientName(pat.name);
      setPatientPhone(pat.phone);
    }
  };

  const handleServiceSelect = (sName: string) => {
    setTreatmentName(sName);
    const srv = services.find((s) => s.name === sName);
    if (srv) {
      setAmountTotal(srv.base_price);
      setAmountPaid(srv.base_price);
    }
  };

  const amountBalance = Math.max(0, amountTotal - amountPaid);
  const paymentStatus = amountBalance === 0 ? "Paid in Full" : "Partially Paid";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert("Please provide patient name and phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const todayISO = new Date().toISOString().split("T")[0];
      const res = await trackedFetch(
        "/api/v1/invoices",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_name: patientName,
            patient_phone: patientPhone,
            treatment_name: treatmentName,
            amount_total: amountTotal,
            amount_paid: amountPaid,
            amount_balance: amountBalance,
            payment_status: paymentStatus,
            payment_method: paymentMethod,
            invoice_date: todayISO,
          }),
        },
        "Create Patient Invoice & Billing Record"
      );

      if (res.ok) {
        onCreated();
        onClose();
      } else {
        alert("Failed to create invoice. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="p-6 max-w-lg w-full rounded-2xl border border-slate-200 bg-white shadow-xl space-y-4 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-sky-600" />
            <span>Generate Patient Invoice &amp; Receipt</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Quick Select Existing Patient */}
          {patients.length > 0 && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Select Existing Patient (Optional)
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => handlePatientSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-sky-500"
              >
                <option value="">-- Or type new patient details below --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">WhatsApp / Phone Number *</label>
              <input
                type="text"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Treatment / Procedure *</label>
            <select
              value={treatmentName}
              onChange={(e) => handleServiceSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-sky-500"
            >
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} - ₹{s.base_price} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Total Fee Amount (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={amountTotal}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setAmountTotal(val);
                  if (amountPaid > val) setAmountPaid(val);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 font-mono focus:outline-sky-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Amount Paid Now (₹) *</label>
              <input
                type="number"
                required
                min={0}
                max={amountTotal}
                value={amountPaid}
                onChange={(e) => setAmountPaid(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-emerald-700 font-mono focus:outline-sky-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-sky-500"
              >
                <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
                <option value="Cash">Cash</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Balance Due (Calculated)</label>
              <div className="w-full px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 font-mono font-bold text-amber-700">
                ₹{amountBalance.toLocaleString("en-IN")}
                <span className="text-[10px] ml-2 font-normal text-slate-500">
                  ({paymentStatus})
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Generating..." : "Save & Generate Invoice"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
