import { requireAdmin } from "@/lib/dal";
import PasswordForm from "./PasswordForm";

export default async function ContaPage() {
  const admin = await requireAdmin();
  return (
    <>
      <h1 className="admin-title">Conta e senha</h1>
      <p className="admin-sub">Sessão iniciada como {admin.email}.</p>
      <PasswordForm />
    </>
  );
}
