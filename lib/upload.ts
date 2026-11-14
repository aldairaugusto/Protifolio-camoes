import { put, del } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type UploadKind = "foto" | "cv";
type UploadResult = { url: string } | { error: string };

const MAX_BYTES = 4 * 1024 * 1024; // limite do pedido na Vercel ≈ 4,5 MB

const TYPES: Record<UploadKind, Record<string, string>> = {
  foto: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" },
  cv: { "application/pdf": "pdf" },
};

// Confirma o conteúdo real do ficheiro (não só o tipo declarado)
function matchesSignature(type: string, b: Uint8Array) {
  const s = (...bytes: number[]) => bytes.every((v, i) => b[i] === v);
  if (type === "image/jpeg") return s(0xff, 0xd8, 0xff);
  if (type === "image/png") return s(0x89, 0x50, 0x4e, 0x47);
  if (type === "image/webp") return s(0x52, 0x49, 0x46, 0x46) && b[8] === 0x57 && b[9] === 0x45;
  if (type === "application/pdf") return s(0x25, 0x50, 0x44, 0x46);
  return false;
}

export async function uploadFile(file: File, kind: UploadKind): Promise<UploadResult> {
  const ext = TYPES[kind][file.type];
  const what = kind === "foto" ? "A foto" : "O CV";
  if (!ext) {
    return { error: kind === "foto" ? "A foto deve ser JPG, PNG ou WebP." : "O CV deve ser um ficheiro PDF." };
  }
  if (file.size > MAX_BYTES) return { error: `${what} não pode ultrapassar 4 MB.` };

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesSignature(file.type, bytes)) return { error: `${what} parece estar corrompido ou no formato errado.` };

  const name = `${kind}-${Date.now()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`portfolio/${name}`, file, { access: "public", addRandomSuffix: true });
    return { url: blob.url };
  }

  if (process.env.NODE_ENV === "production") {
    return { error: "Armazenamento não configurado (falta BLOB_READ_WRITE_TOKEN na Vercel)." };
  }

  // Desenvolvimento local sem Blob: guarda em public/uploads
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return { url: `/uploads/${name}` };
}

// Apaga o ficheiro antigo do Blob (ignora erros e ficheiros locais)
export async function removeOldFile(url?: string | null) {
  if (!url || !process.env.BLOB_READ_WRITE_TOKEN) return;
  if (!url.includes(".public.blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch {
    /* ficheiro já não existe */
  }
}
