import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types/crm";

export const JWT_SECRET = process.env.JWT_SECRET || "dental_crm_super_secret_jwt_key_2026_xyz";
export const TOKEN_COOKIE_NAME = "dental_crm_token";
export const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  clinic_id?: string;
  iat?: number;
  exp?: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // 1. Authorization header: "Bearer <token>" or raw token
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      return authHeader.substring(7).trim();
    }
    return authHeader.trim();
  }

  // 2. Cookie
  const cookie = req.cookies.get(TOKEN_COOKIE_NAME);
  if (cookie?.value) {
    return cookie.value;
  }

  return null;
}

export const CRM_API_KEY = process.env.CRM_API_KEY || "dental_crm_api_secret_key_2026";

export function authenticateRequest(req: NextRequest): JWTPayload | null {
  // 1. Check x-api-key header (for Voice Agent / automated CRM clients)
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKeyHeader && apiKeyHeader.trim() === CRM_API_KEY.trim()) {
    return {
      id: "api_service",
      email: "service@dentalcrm.internal",
      name: "API Service Key",
      role: "admin",
      clinic_id: "clinic_001",
    };
  }

  // 2. Check token (from Authorization Bearer or dental_crm_token Cookie)
  const token = getTokenFromRequest(req);
  if (!token) return null;

  // Check if Bearer token is the API Key
  if (token.trim() === CRM_API_KEY.trim()) {
    return {
      id: "api_service",
      email: "service@dentalcrm.internal",
      name: "API Service Key",
      role: "admin",
      clinic_id: "clinic_001",
    };
  }

  // 3. Verify JWT token
  return verifyToken(token);
}

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function sanitizeUser(row: any): User {
  return {
    id: row.id,
    clinic_id: row.clinic_id,
    name: row.name,
    email: row.email,
    role: row.role || "admin",
    created_at: row.created_at,
  };
}
