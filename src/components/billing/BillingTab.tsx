"use client";

import React, { useState } from "react";
import { 
  Printer, 
  MessageCircle, 
  Plus, 
  Search, 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Clock
} from "lucide-react";
import { Invoice, Service, Clinic, Patient } from "@/types/crm";
import InvoiceReceiptModal from "./InvoiceReceiptModal";
import CreateInvoiceModal from "./CreateInvoiceModal";
import CollectPaymentModal from "./CollectPaymentModal";

interface BillingTabProps {
  clinic: Clinic;
  services: Service[];
  invoices: Invoice[];
  patients: Patient[];
  onRefresh: () => void;
}

export default function BillingTab({
  clinic,
  services,
  invoices,
  patients,
  onRefresh,
}: BillingTabProps) {
  // Modal states
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<Invoice | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">("all");

  // Calculations
  const totalBilled = invoices.reduce((acc, curr) => acc + (Number(curr.amount_total) || 0), 0);
  const totalPaid = invoices.reduce((acc, curr) => acc + (Number(curr.amount_paid) || 0), 0);
  const totalBalance = invoices.reduce((acc, curr) => acc + (Number(curr.amount_balance) || 0), 0);

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      inv.patient_name.toLowerCase().includes(q) ||
      inv.patient_phone.includes(q) ||
      inv.id.toLowerCase().includes(q) ||
      inv.treatment_name.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (statusFilter === "paid") {
      return inv.payment_status === "Paid in Full" || inv.amount_balance <= 0;
    }
    if (statusFilter === "pending") {
      return inv.amount_balance > 0;
    }
    return true;
  });

  const handleOpenReceipt = (inv: Invoice) => {
    setSelectedInvoiceForReceipt(inv);
    setIsReceiptOpen(true);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoiceForPayment(inv);
    setIsPaymentOpen(true);
  };

  const handleQuickWhatsApp = (inv: Invoice) => {
    const cleanPhone = inv.patient_phone.replace(/[^0-9]/g, "");
    const message = 
`🦷 *${clinic.name}*
📄 *PAYMENT RECEIPT & BILL SUMMARY*

• *Invoice No:* ${inv.id.toUpperCase()}
• *Date:* ${inv.invoice_date}
• *Patient Name:* ${inv.patient_name}
• *Treatment:* ${inv.treatment_name}

━━━━━━━━━━━━━━━━━━━━━
💰 *Total Amount:* ₹${inv.amount_total.toLocaleString("en-IN")}
✅ *Amount Paid:* ₹${inv.amount_paid.toLocaleString("en-IN")} (${inv.payment_method})
⏳ *Balance Due:* ₹${inv.amount_balance.toLocaleString("en-IN")}
📌 *Payment Status:* ${inv.payment_status}
━━━━━━━━━━━━━━━━━━━━━

📍 *Clinic Address:* ${clinic.address}
📞 *Contact:* ${clinic.phone}

_Thank you for visiting Apex Dental Clinic!_`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* 1. FINANCIAL KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Billed</div>
            <div className="text-lg font-bold text-slate-900 font-mono">₹{totalBilled.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Collected</div>
            <div className="text-lg font-bold text-emerald-700 font-mono">₹{totalPaid.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Balance</div>
            <div className="text-lg font-bold text-amber-700 font-mono">₹{totalBalance.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Invoices</div>
            <div className="text-lg font-bold text-indigo-900 font-mono">{invoices.length} Receipts</div>
          </div>
        </div>
      </div>

      {/* 2. INVOICE MANAGER */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Invoices &amp; Payment Receipts</span>
            </h2>
            <p className="text-xs text-slate-500">
              Print official clinic receipts, send via WhatsApp, and track pending dues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate New Invoice</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient, phone, invoice #..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-sky-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setStatusFilter("paid")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === "paid" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === "pending" ? "bg-white text-amber-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pending Dues
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Patient Details</th>
                <th className="py-3 px-3">Treatment</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Paid</th>
                <th className="py-3 px-3">Balance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-sky-700">{inv.id}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{inv.invoice_date}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{inv.patient_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{inv.patient_phone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{inv.treatment_name}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 font-mono">
                      ₹{inv.amount_total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold font-mono">
                      ₹{inv.amount_paid.toLocaleString("en-IN")}
                      <span className="block text-[10px] text-slate-400 font-normal">{inv.payment_method}</span>
                    </td>
                    <td className="py-3 px-3 font-bold font-mono">
                      {inv.amount_balance > 0 ? (
                        <span className="text-amber-700">₹{inv.amount_balance.toLocaleString("en-IN")}</span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.payment_status === "Paid in Full" || inv.amount_balance <= 0
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {inv.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Collect due button if balance exists */}
                        {inv.amount_balance > 0 && (
                          <button
                            type="button"
                            onClick={() => handleOpenPayment(inv)}
                            title="Collect Remaining Balance"
                            className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Collect Due
                          </button>
                        )}

                        {/* Print Receipt button */}
                        <button
                          type="button"
                          onClick={() => handleOpenReceipt(inv)}
                          title="Print Official Receipt"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>

                        {/* WhatsApp Receipt button */}
                        <button
                          type="button"
                          onClick={() => handleQuickWhatsApp(inv)}
                          title="Send Receipt to WhatsApp"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. TREATMENTS & CHARGES CATALOG */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Standard Dental Treatment Tariff</h2>
            <p className="text-xs text-slate-500">Official procedure catalog, duration, and baseline pricing.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {services.length} Procedures
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div key={srv.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 uppercase">
                  {srv.category}
                </span>
                <span className="text-xs font-bold text-emerald-700">{srv.price_range}</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{srv.name}</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{srv.description}</p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{srv.duration_mins} mins</span>
                </span>
                <span className="font-semibold text-slate-800">Base: ₹{srv.base_price.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Official Receipt Print/WhatsApp Modal */}
      <InvoiceReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        invoice={selectedInvoiceForReceipt}
        clinic={clinic}
      />

      {/* 2. Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        services={services}
        patients={patients}
        onCreated={onRefresh}
      />

      {/* 3. Collect Payment Modal */}
      <CollectPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        invoice={selectedInvoiceForPayment}
        onUpdated={onRefresh}
      />
    </div>
  );
}
