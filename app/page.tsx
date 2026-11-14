import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import RevealObserver from "@/components/RevealObserver";

// Os dados vêm da base de dados em cada pedido
export const dynamic = "force-dynamic";

const byOrder = { orderBy: [{ order: "asc" as const }, { id: "asc" as const }] };

export default async function Home() {
  const [profile, experiences, educations, skills, courses, languages] =
    await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 } }),
      prisma.experience.findMany(byOrder),
      prisma.education.findMany(byOrder),
      prisma.skill.findMany(byOrder),
      prisma.course.findMany(byOrder),
      prisma.language.findMany(byOrder),
    ]);

  if (!profile) {
    return (
      <main style={{ padding: 40 }}>
        Perfil ainda não configurado. Corre <code>npm run db:seed</code>.
      </main>
    );
  }

  const words = profile.fullName.trim().split(/\s+/);
  const lastWord = words[words.length - 1];
  const firstWords = words.slice(0, -1).join(" ");
  const initials = words.map((w) => w[0]).join("").toUpperCase();
  const paragraphs = profile.aboutText.split(/\n\s*\n/).filter(Boolean);
  const phone2Digits = profile.phone2?.replace(/[^\d+]/g, "");
  const phone1Digits = profile.phone1.replace(/[^\d+]/g, "");

  return (
    <>
      <RevealObserver />
      <div className="background-glow" />
      <Header initials={initials} />

      <main>
        {/* HERO */}
        <section className="hero" id="inicio">
          <div className="container hero-content">
            <div className="hero-text reveal">
              <div className="hero-label">{profile.heroLabel}</div>

              <h1>
                {firstWords.toUpperCase()}
                <span>{lastWord.toUpperCase()}.</span>
              </h1>

              <p className="hero-description">{profile.heroText}</p>

              <div className="hero-buttons">
                <a href="#experiencia" className="btn btn-primary">
                  Conhecer percurso <i className="fas fa-arrow-right" />
                </a>
                <a href="#contacto" className="btn btn-outline">
                  Entrar em contacto
                </a>
                {profile.cvUrl && (
                  <a href={profile.cvUrl} className="btn btn-outline" download>
                    <i className="fas fa-file-pdf" /> Descarregar CV
                  </a>
                )}
              </div>

              <div className="hero-socials">
                <a href={`mailto:${profile.email}`} aria-label="Email">
                  <i className="fas fa-envelope" />
                </a>
                <a
                  href={`https://wa.me/${profile.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp" />
                </a>
                <a href={`tel:${phone1Digits}`} aria-label="Telefone">
                  <i className="fas fa-phone" />
                </a>
                {profile.facebook && (
                  <a href={profile.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i className="fab fa-facebook-f" />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in" />
                  </a>
                )}
              </div>
            </div>

            {/* FOTO DE PERFIL */}
            <div className="hero-photo-area reveal">
              <div className="photo-decoration" />
              <div className="photo-frame">
                {profile.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photoUrl} alt={`Fotografia de ${profile.fullName}`} />
                )}
              </div>
              <div className="photo-card">
                <strong>
                  <i className="fas fa-microchip" />
                  {profile.heroBadge}
                </strong>
                <small>{profile.heroBadgeSub}</small>
              </div>
            </div>
          </div>
        </section>

        {/* PERFIL */}
        <section className="about" id="perfil">
          <div className="container about-grid">
            <div className="about-card reveal">
              <i className="fas fa-user-tie" />
              <h3>Sobre mim</h3>
              <p>{profile.aboutQuote}</p>
            </div>

            <div className="about-text reveal">
              <div className="section-heading">
                <small>01 / Perfil profissional</small>
                <h2>Conheça o meu <span>perfil.</span></h2>
              </div>

              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <div className="about-highlights">
                {["Espírito empreendedor", "Liderança e colaboração", "Resolução de problemas", "Aprendizagem contínua"].map((t) => (
                  <div className="highlight" key={t}>
                    <i className="fas fa-check-circle" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIÊNCIA */}
        <section id="experiencia">
          <div className="container">
            <div className="section-heading reveal">
              <small>02 / Percurso profissional</small>
              <h2>Experiência de <span>trabalho.</span></h2>
              <p>Experiências que contribuíram para o meu desenvolvimento técnico e profissional.</p>
            </div>

            <div className="timeline">
              {experiences.map((e) => (
                <div className="timeline-item reveal" key={e.id}>
                  <div className="timeline-card">
                    <span className="timeline-date">{e.date}</span>
                    <h3>{e.title}</h3>
                    <span className="timeline-company">{e.company}</span>
                    <p>{e.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCAÇÃO */}
        <section className="education" id="educacao">
          <div className="container">
            <div className="section-heading reveal">
              <small>03 / Formação académica</small>
              <h2>Educação e <span>formação.</span></h2>
              <p>A minha base académica e o caminho para o desenvolvimento profissional.</p>
            </div>

            <div className="education-grid">
              {educations.map((e) => (
                <div className="education-card reveal" key={e.id}>
                  <div className="education-icon">
                    <i className={`fas ${e.icon}`} />
                  </div>
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HABILIDADES */}
        <section id="habilidades">
          <div className="container">
            <div className="section-heading reveal">
              <small>04 / Competências</small>
              <h2>Principais <span>habilidades.</span></h2>
              <p>Competências técnicas e interpessoais desenvolvidas ao longo do meu percurso.</p>
            </div>

            <div className="skills-grid">
              {skills.map((s) => (
                <div className="skill-card reveal" key={s.id}>
                  <i className={`fas ${s.icon}`} />
                  <h3>{s.text}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORMAÇÕES COMPLEMENTARES */}
        <section className="courses" id="formacoes">
          <div className="container">
            <div className="section-heading reveal">
              <small>05 / Desenvolvimento profissional</small>
              <h2>Formações <span>complementares.</span></h2>
              <p>Conhecimentos adquiridos em diferentes áreas de formação.</p>
            </div>

            <div className="courses-grid">
              {courses.map((c) => (
                <div className="course-item reveal" key={c.id}>
                  <i className={`fas ${c.icon}`} />
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LÍNGUAS */}
        <section id="linguas">
          <div className="container">
            <div className="section-heading reveal">
              <small>06 / Comunicação</small>
              <h2>Idiomas e <span>línguas.</span></h2>
            </div>

            <div className="languages">
              {languages.map((l) => (
                <div className="language-card reveal" key={l.id}>
                  <h3>{l.name}</h3>
                  <p>{l.level}</p>
                  <div className="language-level">
                    <span style={{ width: `${Math.min(100, Math.max(0, l.percent))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section className="contact" id="contacto">
          <div className="container contact-content reveal">
            <div className="section-heading">
              <small>07 / Vamos conversar</small>
              <h2>Vamos criar algo <span>extraordinário?</span></h2>
            </div>

            <p>
              Estou aberto a oportunidades profissionais, novos desafios, parcerias e projetos que
              promovam a inovação e o desenvolvimento tecnológico.
            </p>

            <div className="contact-cards">
              <a href={`tel:${phone1Digits}`} className="contact-card">
                <i className="fas fa-phone" />
                <strong>Telefone 01</strong>
                <span>{profile.phone1}</span>
              </a>
              {profile.phone2 && (
                <a href={`tel:${phone2Digits}`} className="contact-card">
                  <i className="fas fa-mobile-alt" />
                  <strong>Telefone 02</strong>
                  <span>{profile.phone2}</span>
                </a>
              )}
              <a href={`mailto:${profile.email}`} className="contact-card">
                <i className="fas fa-envelope" />
                <strong>E-mail</strong>
                <span>{profile.email}</span>
              </a>
            </div>

            <a
              href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Olá Leonel! Visitei o teu portfólio.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <i className="fab fa-whatsapp" /> Conversar pelo WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-content">
          <p>
            © {new Date().getFullYear()} {profile.fullName}. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido com <span>criatividade e tecnologia.</span>
          </p>
          <a href="#inicio" className="back-top" aria-label="Voltar ao topo">
            <i className="fas fa-arrow-up" />
          </a>
        </div>
      </footer>
    </>
  );
}
