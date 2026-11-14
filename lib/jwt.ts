import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "admin_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function getKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET em falta ou demasiado curta (mínimo 32 caracteres).");
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(adminId: number) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(adminId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(getKey());
}

// Seguro para o Edge (usado no middleware)
export async function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return payload.sub ? { adminId: Number(payload.sub) } : null;
  } catch {
    return null;
  }
}
