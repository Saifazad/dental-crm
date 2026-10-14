export interface ApiLogEntry {
  id: string;
  time: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  durationMs: number;
  summary?: string;
  error?: string;
  bearerAttached?: boolean;
}

type LogListener = (logs: ApiLogEntry[]) => void;

class ApiLoggerStore {
  private logs: ApiLogEntry[] = [];
  private listeners: Set<LogListener> = new Set();

  addLog(entry: ApiLogEntry) {
    this.logs = [entry, ...this.logs].slice(0, 50); // keep last 50
    this.notify();

    // Colored console logs in Browser DevTools
    if (typeof window !== "undefined") {
      const isSuccess = entry.status >= 200 && entry.status < 300;
      const isWarning = entry.status === 401 || entry.status === 404;
      const badgeColor = isSuccess ? "#10b981" : isWarning ? "#f59e0b" : "#ef4444";

      console.groupCollapsed(
        `%c ${entry.method} %c ${entry.status} %c ${entry.url} (${entry.durationMs}ms) ${
          entry.bearerAttached ? "🔑 [Bearer JWT]" : ""
        }`,
        `background: #0f172a; color: #38bdf8; font-weight: bold; border-radius: 4px; padding: 2px 6px;`,
        `background: ${badgeColor}; color: white; font-weight: bold; border-radius: 4px; padding: 2px 6px;`,
        `color: #cbd5e1; font-weight: normal;`
      );
      if (entry.summary) console.log("Summary:", entry.summary);
      if (entry.bearerAttached) {
        console.log(
          "%c🔑 Authorization: Bearer <JWT Token Sent>",
          "color: #38bdf8; font-weight: bold;"
        );
      }
      if (entry.error) console.error("Error:", entry.error);
      console.log("Full Request/Response Details:", entry);
      console.groupEnd();
    }
  }

  getLogs(): ApiLogEntry[] {
    return this.logs;
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener(this.logs);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.logs);
    }
  }
}

export const apiLogger = new ApiLoggerStore();

/**
 * Enhanced fetch wrapper that:
 * 1. Automatically attaches "Authorization: Bearer <JWT>" from localStorage / session
 * 2. Sends cookies with credentials: "include"
 * 3. Tracks and logs all API calls with metrics
 */
export async function trackedFetch(
  url: string,
  options?: RequestInit,
  summary?: string
): Promise<Response> {
  const start = performance.now();
  const method = options?.method || "GET";

  // Build enhanced headers with Bearer token
  const headers = new Headers(options?.headers || {});

  let bearerAttached = false;
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("dental_crm_jwt");
    if (token) {
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
        bearerAttached = true;
      } else {
        bearerAttached = true;
      }
    }
  }

  const enhancedOptions: RequestInit = {
    ...options,
    headers,
    credentials: options?.credentials || "include",
  };

  try {
    const res = await fetch(url, enhancedOptions);
    const durationMs = Math.round(performance.now() - start);

    apiLogger.addLog({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      time: new Date().toLocaleTimeString(),
      method,
      url,
      status: res.status,
      statusText: res.statusText || (res.ok ? "OK" : "Error"),
      durationMs,
      summary: summary || `${method} ${url}`,
      bearerAttached,
    });

    return res;
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    apiLogger.addLog({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      time: new Date().toLocaleTimeString(),
      method,
      url,
      status: 0,
      statusText: "Network Error",
      durationMs,
      summary: summary || `${method} ${url}`,
      error: err.message,
      bearerAttached,
    });
    throw err;
  }
}
