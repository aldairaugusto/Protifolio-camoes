"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { SECTIONS, isSectionKey, parseFields } from "@/lib/sections";
import type { FormState } from "./actions";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Delegate = {
  findMany(args?: any): Promise<any[]>;
  create(args: any): Promise<any>;
  update(args: any): any;
  delete(args: any): Promise<any>;
};

function getSection(raw: FormDataEntryValue | null) {
  const key = String(raw ?? "");
  if (!isSectionKey(key)) throw new Error("Secção inválida.");
  const cfg = SECTIONS[key];
  const delegate = (prisma as unknown as Record<string, Delegate>)[cfg.model];
  return { key, cfg, delegate };
}

function refresh(key: string) {
  revalidatePath("/");
  revalidatePath(`/admin/${key}`);
  revalidatePath("/admin");
}

export async function saveItem(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const { key, cfg, delegate } = getSection(fd.get("secao"));

  const parsed = parseFields(cfg, fd);
  if ("error" in parsed) return { error: parsed.error };

  const id = Number(fd.get("id") || 0);
  if (id) {
    await delegate.update({ where: { id }, data: parsed.data });
  } else {
    const last = await delegate.findMany({ orderBy: { order: "desc" }, take: 1 });
    await delegate.create({ data: { ...parsed.data, order: (last[0]?.order ?? 0) + 1 } });
  }

  refresh(key);
  return { ok: "Guardado." };
}

export async function deleteItem(fd: FormData) {
  await requireAdmin();
  const { key, delegate } = getSection(fd.get("secao"));
  const id = Number(fd.get("id"));
  if (id) await delegate.delete({ where: { id } });
  refresh(key);
}

export async function moveItem(fd: FormData) {
  await requireAdmin();
  const { key, delegate } = getSection(fd.get("secao"));
  const id = Number(fd.get("id"));
  const dir = fd.get("dir") === "up" ? -1 : 1;

  const items = await delegate.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  const from = items.findIndex((i) => i.id === id);
  const to = from + dir;
  if (from < 0 || to < 0 || to >= items.length) return;

  [items[from], items[to]] = [items[to], items[from]];
  await prisma.$transaction(
    items.map((item, index) => delegate.update({ where: { id: item.id }, data: { order: index + 1 } }))
  );
  refresh(key);
}
