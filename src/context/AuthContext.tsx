"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/crm";
import { trackedFetch } from "@/lib/api-logger";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Auth state from server or localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("dental_crm_jwt") : null;
        
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (storedToken) {
          headers["Authorization"] = `Bearer ${storedToken}`;
        }

        const res = await trackedFetch(
          "/api/v1/auth/me",
          {
            method: "GET",
            headers,
            credentials: "include", // send cookies
          },
          "Verify JWT session cookie & load user profile"
        );

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            if (storedToken) setToken(storedToken);
          } else {
            setUser(null);
            setToken(null);
            if (typeof window !== "undefined") localStorage.removeItem("dental_crm_jwt");
          }
        } else {
          setUser(null);
          setToken(null);
          if (typeof window !== "undefined") localStorage.removeItem("dental_crm_jwt");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await trackedFetch(
        "/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        },
        `Sign in as ${email} & receive JWT cookie`
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      setToken(data.token);
      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem("dental_crm_jwt", data.token);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during login" };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "admin"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await trackedFetch(
        "/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
          credentials: "include",
        },
        `Register new account (${name} - ${role})`
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Registration failed" };
      }

      setUser(data.user);
      setToken(data.token);
      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem("dental_crm_jwt", data.token);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during registration" };
    }
  };

  const logout = async () => {
    try {
      await trackedFetch(
        "/api/v1/auth/logout",
        {
          method: "POST",
          credentials: "include",
        },
        "Sign out & invalidate JWT cookie"
      );
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("dental_crm_jwt");
        window.location.href = "/login";
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
