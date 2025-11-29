// lib/auth.ts
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function signToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

/**
 * Extract customer (or any user) from Authorization header
 * Returns: { id, role, email }
 */
export function getCustomerFromRequest(req: Request | NextRequest) {
  try {
    const header =
      req.headers.get("authorization") || req.headers.get("Authorization");

    if (!header) return null;

    const token = header.replace("Bearer ", "").trim();
    if (!token) return null;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    return decoded; // { id, role, email }
  } catch (err) {
    return null;
  }
}
