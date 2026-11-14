import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyToken } from "@/lib/jwt";

// Devolve o admin autenticado (ou null). Confirma sempre na base de dados.
export const getAdmin = cache(async () => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = await verifyToken(token);
  if (!session) return null;
  return prisma.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true },
  });
});

// Usar no início de TODA a página ou Server Action do painel
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
