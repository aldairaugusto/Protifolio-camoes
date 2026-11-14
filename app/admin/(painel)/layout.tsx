import { requireAdmin } from "@/lib/dal";
import { logout } from "../actions";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin(); // protecção extra, além do middleware

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">Painel<span>.</span></div>
        <nav>
          <a href="/admin">Resumo</a>
          <a href="/admin/perfil">Perfil e contactos</a>
          <a href="/admin/experiencia">Experiência</a>
          <a href="/admin/educacao">Educação</a>
          <a href="/admin/habilidades">Habilidades</a>
          <a href="/admin/formacoes">Formações</a>
          <a href="/admin/idiomas">Idiomas</a>
          <a href="/admin/conta">Conta e senha</a>
          <a href="/" target="_blank" rel="noopener noreferrer">Ver site ↗</a>
        </nav>
        <div className="admin-user">
          <small>{admin.email}</small>
          <form action={logout}>
            <button className="btn btn-outline" type="submit">Sair</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
