import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  await requireAdmin();

  const [experience, education, skills, courses, languages] = await Promise.all([
    prisma.experience.count(),
    prisma.education.count(),
    prisma.skill.count(),
    prisma.course.count(),
    prisma.language.count(),
  ]);

  const items = [
    ["Experiências", experience, "experiencia"],
    ["Educação", education, "educacao"],
    ["Habilidades", skills, "habilidades"],
    ["Formações", courses, "formacoes"],
    ["Idiomas", languages, "idiomas"],
  ] as const;

  return (
    <>
      <h1 className="admin-title">Resumo</h1>
      <p className="admin-sub">Conteúdo actualmente publicado no site.</p>
      <div className="stat-grid">
        {items.map(([label, n, href]) => (
          <a className="stat" key={label} href={`/admin/${href}`}>
            <strong>{n}</strong>
            <span>{label}</span>
          </a>
        ))}
      </div>
    </>
  );
}
