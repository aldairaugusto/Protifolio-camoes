"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { removeOldFile, uploadFile } from "@/lib/upload";
import type { FormState } from "./actions";

function text(fd: FormData, name: string) {
  return String(fd.get(name) ?? "").trim();
}

function validUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function saveProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();

  const required: [string, string, number][] = [
    ["fullName", "Nome completo", 80],
    ["heroLabel", "Etiqueta do topo", 60],
    ["heroText", "Texto de apresentação", 500],
    ["heroBadge", "Cartão da foto (título)", 60],
    ["heroBadgeSub", "Cartão da foto (subtítulo)", 80],
    ["aboutQuote", "Frase do cartão Sobre mim", 300],
    ["aboutText", "Texto do perfil", 3000],
    ["email", "E-mail", 120],
    ["phone1", "Telefone 1", 30],
  ];

  const data: Record<string, string | null> = {};
  for (const [name, label, max] of required) {
    const v = text(fd, name);
    if (!v) return { error: `Preencha o campo "${label}".` };
    if (v.length > max) return { error: `"${label}" é demasiado longo (máximo ${max} caracteres).` };
    data[name] = v;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email!)) return { error: "O e-mail não é válido." };

  const whatsapp = text(fd, "whatsapp").replace(/\D/g, "");
  if (whatsapp.length < 9 || whatsapp.length > 15) {
    return { error: "WhatsApp inválido. Escreva só números com o indicativo, ex.: 244974959145." };
  }
  data.whatsapp = whatsapp;

  const phone2 = text(fd, "phone2");
  if (phone2.length > 30) return { error: "Telefone 2 é demasiado longo." };
  data.phone2 = phone2 || null;

  for (const [name, label] of [["facebook", "Facebook"], ["linkedin", "LinkedIn"]] as const) {
    const v = text(fd, name);
    if (v && !validUrl(v)) return { error: `O link do ${label} deve começar por https://` };
    data[name] = v || null;
  }

  const current = await prisma.profile.findUnique({ where: { id: 1 } });

  // Uploads (opcionais)
  const uploads: { photoUrl?: string; cvUrl?: string } = {};
  const photo = fd.get("photo");
  const cv = fd.get("cv");

  if (photo instanceof File && photo.size > 0) {
    const r = await uploadFile(photo, "foto");
    if ("error" in r) return { error: r.error };
    uploads.photoUrl = r.url;
  }
  if (cv instanceof File && cv.size > 0) {
    const r = await uploadFile(cv, "cv");
    if ("error" in r) return { error: r.error };
    uploads.cvUrl = r.url;
  }

  const payload = { ...data, ...uploads } as Record<string, string | null> & {
    fullName: string; heroLabel: string; heroText: string; heroBadge: string; heroBadgeSub: string;
    aboutQuote: string; aboutText: string; email: string; phone1: string; whatsapp: string;
  };

  await prisma.profile.upsert({ where: { id: 1 }, update: payload, create: { id: 1, ...payload } });

  if (uploads.photoUrl) await removeOldFile(current?.photoUrl);
  if (uploads.cvUrl) await removeOldFile(current?.cvUrl);

  revalidatePath("/");
  revalidatePath("/admin/perfil");
  return { ok: "Perfil guardado. O site já está actualizado." };
}
