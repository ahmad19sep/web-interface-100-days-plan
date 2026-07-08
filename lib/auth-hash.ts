// Server-only code-hashing (scrypt) shared by the signup/login routes.

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const MIN_CODE_LENGTH = 4;
export const HANDLE_RE = /^[a-z0-9_-]{3,24}$/;

export function hashCode(code: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(code, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyCode(code: string, salt: string, hash: string): boolean {
  const candidate = scryptSync(code, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export function normalizeHandle(raw: string): string {
  return raw.trim().toLowerCase();
}
