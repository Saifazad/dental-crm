"use client";

import React from "react";
import { Printer, MessageCircle, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Invoice, Clinic } from "@/types/crm";

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  clinic: Clinic;
}

export default function InvoiceReceiptModal({
  isOpen,
  onClose,
  invoice,
  clinic,
}: InvoiceReceiptModalProps) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const cleanPhone = invoice.patient_phone.replace(/[^0-9]/g, "");
    const message = 
`🦷 *${clinic.name}*
📄 *OFFICIAL PAYMENT RECEIPT*

• *Invoice No:* ${invoice.id.toUpperCase()}
• *Date:* ${invoice.invoice_date}
• *Patient:* ${invoice.patient_name} (${invoice.patient_phone})
• *Treatment:* ${invoice.treatment_name}

━━━━━━━━━━━━━━━━━━━━━
💰 *Total Billed:* ₹${invoice.amount_total.toLocaleString("en-IN")}
✅ *Amount Paid:* ₹${invoice.amount_paid.toLocaleString("en-IN")} (${invoice.payment_method})
⏳ *Balance Due:* ₹${invoice.amount_balance.toLocaleString("en-IN")}
📌 *Status:* ${invoice.payment_status}
━━━━━━━━━━━━━━━━━━━━━

📍 *Address:* ${clinic.address}
📞 *Contact:* ${clinic.phone}

_Thank you for choosing Apex Dental Clinic. Wishing you a healthy smile!_`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const isPaidInFull = invoice.payment_status === "Paid in Full" || invoice.amount_balance <= 0;

  return (
    <>
      {/* Dedicated Print stylesheet */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          .receipt-no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
          {/* Action Toolbar (Hidden during print) */}
          <div className="receipt-no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">Receipt Preview</span>
              <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-mono">
                {invoice.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Receipt Paper Container */}
          <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 bg-slate-50/50">
            <div
              id="printable-receipt"
              className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-slate-800 space-y-6"
            >
              {/* Clinic Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-sky-600 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🦷</span>
                    <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {clinic.name}
                    </h1>
                  </div>
                  <p className="text-xs font-medium text-sky-700 mt-0.5">{clinic.tagline}</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm leading-relaxed">
                    {clinic.address}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Phone: <span className="font-semibold text-slate-700">{clinic.phone}</span>
                    {clinic.email && <> | Email: <span className="font-semibold text-slate-700">{clinic.email}</span></>}
                  </p>
                </div>

                <div className="text-left sm:text-right flex flex-col sm:items-end">
                  <span className="inline-block px-3 py-1 rounded bg-sky-50 border border-sky-200 text-sky-900 font-extrabold text-xs uppercase tracking-wider">
                    Tax Invoice / Receipt
                  </span>
                  <div className="mt-2 text-xs space-y-0.5">
                    <p className="text-slate-500">
                      Receipt #: <span className="font-bold text-slate-900 font-mono">{invoice.id}</span>
                    </p>
                    <p className="text-slate-500">
                      Date: <span className="font-semibold text-slate-800">{invoice.invoice_date}</span>
                    </p>
                    <p className="text-slate-500">
                      Payment Mode: <span className="font-semibold text-slate-800">{invoice.payment_method}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient Details Banner */}
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Patient Name
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{invoice.patient_name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Phone / Contact
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">{invoice.patient_phone}</span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-3">Treatment / Procedure</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3 text-center text-slate-400 font-medium">1</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{invoice.treatment_name}</div>
                        <div className="text-[11px] text-slate-500">Dental procedure &amp; consultation</div>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">1</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                        ₹{invoice.amount_total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation & Status Stamp */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
                {/* Official Stamp */}
                <div className="order-2 sm:order-1">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-black text-xs uppercase tracking-wider ${
                      isPaidInFull
                        ? "border-emerald-500 text-emerald-700 bg-emerald-50/80"
                        : "border-amber-500 text-amber-700 bg-amber-50/80"
                    }`}
                  >
                    {isPaidInFull ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Payment Received: Paid in Full</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Partially Paid: Balance Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount Totals */}
                <div className="order-1 sm:order-2 w-full sm:w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{invoice.amount_total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="font-mono text-sm">₹{invoice.amount_total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Amount Paid:</span>
                    <span className="font-mono text-sm">₹{invoice.amount_paid.toLocaleString("en-IN")}</span>
                  </div>
                  <div
                    className={`flex justify-between font-bold pt-1 border-t border-slate-200 ${
                      invoice.amount_balance > 0 ? "text-amber-700" : "text-slate-500"
                    }`}
                  >
                    <span>Balance Due:</span>
                    <span className="font-mono text-sm">
                      {invoice.amount_balance > 0 ? `₹${invoice.amount_balance.toLocaleString("en-IN")}` : "₹0 (NIL)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Footer & Signatures */}
              <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-6">
                <div className="leading-relaxed">
                  <p className="font-semibold text-slate-700">Post-Treatment Notes &amp; Terms:</p>
                  <p>1. Please retain this receipt for follow-up appointments and procedure warranty records.</p>
                  <p>2. Take prescribed medications on time and follow oral hygiene guidelines.</p>
                </div>

                <div className="flex items-end justify-between pt-8 text-xs text-slate-700 font-medium">
                  <div className="text-center border-t border-slate-300 pt-1 w-40">
                    Patient / Representative
                  </div>
                  <div className="text-center border-t border-slate-300 pt-1 w-44">
                    Authorized Signatory
                    <span className="block text-[10px] text-slate-400 font-normal">Apex Dental Clinic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
