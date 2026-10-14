"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { apiLogger, ApiLogEntry } from "@/lib/api-logger";
import { useAuth } from "@/context/AuthContext";

export default function ApiTrackerModal() {
  const { user, token } = useAuth();
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "auth" | "crm">("all");

  useEffect(() => {
    const unsubscribe = apiLogger.subscribe((newLogs) => {
      setLogs([...newLogs]);
    });
    return unsubscribe;
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === "auth") return log.url.includes("/auth/");
    if (filter === "crm") return !log.url.includes("/auth/");
    return true;
  });

  const successCount = logs.filter((l) => l.status >= 200 && l.status < 300).length;
  const errorCount = logs.filter((l) => l.status >= 400 || l.status === 0).length;
  const lastLog = logs[0];

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          {status} OK
        </span>
      );
    }
    if (status === 401) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" />
          401 Auth Required
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
        <XCircle className="w-3 h-3" />
        {status || "ERR"}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-sky-500/20 text-sky-400 border-sky-500/30",
      POST: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      DELETE: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    };
    return (
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
          colors[method] || "bg-slate-700 text-slate-300 border-slate-600"
        }`}
      >
        {method}
      </span>
    );
  };

  return (
    <>
      {/* Floating Bottom Pill Trigger */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#09172d]/95 hover:bg-[#0f2444] text-white border border-sky-500/40 shadow-xl shadow-black/50 backdrop-blur-md transition-all cursor-pointer group"
        >
          <div className="relative">
            <Activity className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="text-left">
            <div className="text-[11px] font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Live API Tracker</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {logs.length} calls
              </span>
            </div>
            <div className="text-[9px] text-slate-400 truncate max-w-[140px]">
              {lastLog ? `${lastLog.method} ${lastLog.url.split("/").pop()}` : "Ready"}
            </div>
          </div>

          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Expanded API Inspector Drawer */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-[92vw] sm:w-[480px] max-h-[82vh] bg-[#0c1f38]/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden text-slate-200 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-[#09172d]/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-950">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>API Traffic &amp; JWT Monitor</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Real-time PostgreSQL API request logs &amp; responses
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => apiLogger.clear()}
                title="Clear Logs"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-[#081528] border-b border-slate-800 text-center text-xs">
            <div className="bg-[#0e213b] p-2 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400">JWT Auth Session</div>
              <div className="text-xs font-bold text-sky-400 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="truncate max-w-[90px]">{user ? user.role : "Guest"}</span>
              </div>
            </div>
            <div className="bg-[#0e213b] p-2 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400">Success Calls</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                {successCount} <span className="text-[10px] text-slate-400 font-normal">OK</span>
              </div>
            </div>
            <div className="bg-[#0e213b] p-2 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400">Status 401 / Err</div>
              <div className="text-xs font-bold text-amber-400 mt-0.5">
                {errorCount} <span className="text-[10px] text-slate-400 font-normal">calls</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-[#09172d] border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  filter === "all"
                    ? "bg-sky-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All ({logs.length})
              </button>
              <button
                onClick={() => setFilter("auth")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  filter === "auth"
                    ? "bg-sky-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Auth APIs
              </button>
              <button
                onClick={() => setFilter("crm")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  filter === "crm"
                    ? "bg-sky-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                CRM Data
              </button>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Console logs synced</span>
          </div>

          {/* Logs List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[460px]">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No API calls captured yet. Perform actions to view live requests!
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-[#09172d]/80 hover:bg-[#102444] border border-slate-700/60 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getMethodBadge(log.method)}
                      <span className="text-xs font-mono font-bold text-white truncate max-w-[170px]">
                        {log.url}
                      </span>
                      {log.bearerAttached && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Bearer JWT
                        </span>
                      )}
                    </div>
                    {getStatusBadge(log.status)}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-slate-300 truncate max-w-[280px]">
                      {log.summary || log.url}
                    </span>
                    <span className="font-mono text-teal-400 shrink-0">
                      {log.durationMs}ms • {log.time}
                    </span>
                  </div>

                  {log.status === 401 && (
                    <div className="text-[10px] text-amber-300/90 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                      ℹ️ <strong>401 Expected:</strong> Initial session check when not logged in.
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-[#081528] border-t border-slate-800 text-center text-[10px] text-slate-400">
            Open DevTools Network tab (<kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">Cmd+Option+I</kbd>) to view raw headers and payload.
          </div>
        </div>
      )}
    </>
  );
}
