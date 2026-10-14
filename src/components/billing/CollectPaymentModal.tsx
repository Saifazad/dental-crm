"use client";

import React, { useState } from "react";
import { CreditCard, X, Check } from "lucide-react";
import { Invoice } from "@/types/crm";

interface CollectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onUpdated: () => void;
}

export default function CollectPaymentModal({
  isOpen,
  onClose,
  invoice,
  onUpdated,
}: CollectPaymentModalProps) {
  const [payAmount, setPayAmount] = useState<number>(invoice?.amount_balance || 0);
  const [method, setMethod] = useState("UPI / GPay / PhonePe");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when invoice changes
  React.useEffect(() => {
    if (invoice) {
      setPayAmount(invoice.amount_balance);
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPaid = Number(invoice.amount_paid) + Number(payAmount);
      const newBalance = Math.max(0, Number(invoice.amount_total) - newPaid);
      const newStatus = newBalance === 0 ? "Paid in Full" : "Partially Paid";

      const res = await fetch("/api/v1/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: invoice.id,
          amount_paid: newPaid,
          amount_balance: newBalance,
          payment_status: newStatus,
          payment_method: method,
        }),
      });

      if (res.ok) {
        onUpdated();
        onClose();
      } else {
        alert("Failed to update payment.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="p-6 max-w-sm w-full rounded-2xl border border-slate-200 bg-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Collect Outstanding Balance</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Patient:</span>
            <span className="font-bold text-slate-800">{invoice.patient_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Treatment:</span>
            <span className="font-medium text-slate-700">{invoice.treatment_name}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-1">
            <span className="text-slate-500">Current Balance Due:</span>
            <span className="font-bold text-amber-700 font-mono text-sm">
              ₹{invoice.amount_balance.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Amount to Collect Now (₹) *
            </label>
            <input
              type="number"
              required
              min={1}
              max={invoice.amount_balance}
              value={payAmount}
              onChange={(e) => setPayAmount(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-bold font-mono focus:outline-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-sky-500"
            >
              <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
              <option value="Cash">Cash</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Updating..." : "Record Payment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
