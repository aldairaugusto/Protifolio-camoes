"use server";

import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, SESSION_SECONDS, signToken } from "@/lib/jwt";
import { requireAdmin } from "@/lib/dal";

export type FormState = { error?: string; ok?: string } | undefined;

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
// Hash falso: garante o mesmo tempo de resposta quando o e-mail não existe
const DUMMY_HASH = bcrypt.hashSync("senha-falsa-para-tempo-constante", 12);

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Preencha o e-mail e a senha." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "desconhecido";
  const key = `${ip}|${email}`;
  const now = new Date();

  const attempt = await prisma.loginAttempt.findUnique({ where: { key } });
  const active = attempt && attempt.resetAt > now ? attempt : null;

  if (active && active.count >= MAX_ATTEMPTS) {
    const minutes = Math.ceil((active.resetAt.getTime() - now.getTime()) / 60000);
    return { error: `Demasiadas tentativas. Tente novamente dentro de ${minutes} min.` };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !valid) {
    await prisma.loginAttempt.upsert({
      where: { key },
      create: { key, count: 1, resetAt: new Date(now.getTime() + WINDOW_MS) },
      update: active
        ? { count: { increment: 1 } }
        : { count: 1, resetAt: new Date(now.getTime() + WINDOW_MS) },
    });
    return { error: "E-mail ou senha incorrectos." };
  }

  await prisma.loginAttempt.deleteMany({ where: { key } });

  (await cookies()).set(COOKIE_NAME, await signToken(admin.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });

  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8) return { error: "A nova senha deve ter pelo menos 8 caracteres." };
  if (next !== confirm) return { error: "A confirmação não coincide com a nova senha." };

  const record = await prisma.admin.findUnique({ where: { id: admin.id } });
  if (!record || !(await bcrypt.compare(current, record.passwordHash))) {
    return { error: "A senha actual está incorrecta." };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(next, 12) },
  });
  return { ok: "Senha alterada com sucesso." };
}
