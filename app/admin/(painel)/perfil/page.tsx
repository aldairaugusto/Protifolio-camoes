import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  await requireAdmin();
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });

  if (!profile) {
    return <p className="admin-sub">Perfil não encontrado. Corre <code>npm run db:seed</code>.</p>;
  }

  return (
    <>
      <h1 className="admin-title">Perfil e contactos</h1>
      <p className="admin-sub">Textos do topo, secção Sobre mim, foto, CV e contactos.</p>
      <ProfileForm profile={profile} />
    </>
  );
}
