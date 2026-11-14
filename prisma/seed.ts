import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------- ADMIN ----------
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Define ADMIN_EMAIL e ADMIN_PASSWORD no .env");
  }
  await prisma.admin.upsert({
    where: { email },
    update: {}, // não repõe a senha se o admin já existir (a senha muda no painel)
    create: { email, passwordHash: await bcrypt.hash(password, 12) },
  });

  // ---------- PERFIL ----------
  const profile = {
    fullName: "Leonel Ganga Camões",
    heroLabel: "Portfólio profissional",
    heroText:
      "Técnico Médio de Eletrónica Industrial e Automação, profissional de informática e estudante de Engenharia Eletromecânica. Apaixonado por tecnologia, inovação e desenvolvimento de soluções.",
    heroBadge: "Tecnologia & Inovação",
    heroBadgeSub: "Conhecimento em constante evolução",
    aboutQuote:
      "Acredito que o conhecimento, a disciplina e a capacidade de adaptação são fundamentais para transformar desafios em oportunidades.",
    aboutText: [
      "Técnico Médio de Eletrónica Industrial e Automação, com formação profissional complementar na área de informática.",
      "Tenho facilidade em integrar e liderar equipas, combinando pensamento técnico com escuta ativa e comunicação eficaz. Destaco-me pela capacidade de aprender rapidamente, resolver problemas com foco e atuar com responsabilidade em ambientes dinâmicos e tecnológicos.",
      "Procuro sempre unir conhecimento prático e teórico para oferecer soluções eficientes e inovadoras.",
    ].join("\n\n"),
    photoUrl: "/leonel.jpeg",
    cvUrl: "/cv-leonel-camoes.pdf",
    email: "leonelcamoes7@gmail.com",
    phone1: "+244 974 959 145",
    phone2: "+244 957 045 925",
    whatsapp: "244974959145",
    facebook: "https://www.facebook.com/delciokey",
    linkedin: "https://www.linkedin.com/in/leonel-cam%C3%B5es-5bb618389/",
  };
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...profile },
  });

  // ---------- LISTAS (só insere se estiverem vazias) ----------
  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({
      data: [
        {
          date: "Empreendedorismo",
          title: "Sócio e Cofundador",
          company: "7VEN SERVICES",
          text: "Participação na criação e desenvolvimento de uma startup, contribuindo para a iniciativa empreendedora e identificação de oportunidades de negócio.",
          order: 1,
        },
        {
          date: "Março de 2025",
          title: "Técnico de Informática",
          company: "HEMBETEC, LDA · Icolo e Bengo",
          text: "Experiência profissional na área de informática, com atuação em atividades técnicas e suporte informático.",
          order: 2,
        },
        {
          date: "Abril – Junho de 2026",
          title: "Estagiário – Técnico de Transmissão",
          company: "ADVANLINK",
          text: "Estágio profissional na área de transmissão, permitindo contacto com o ambiente técnico e operacional das telecomunicações.",
          order: 3,
        },
      ],
    });
  }

  if ((await prisma.education.count()) === 0) {
    await prisma.education.createMany({
      data: [
        {
          title: "Engenharia Eletromecânica",
          text: "Estudante do 1.º ano de Engenharia Eletromecânica na Universidade Jean Piaget.",
          icon: "fa-university",
          order: 1,
        },
        {
          title: "Técnico Médio de Eletrónica Industrial e Automação",
          text: 'Instituto Politécnico Industrial do Zango "17 de Dezembro", Icolo e Bengo – Angola.',
          icon: "fa-graduation-cap",
          order: 2,
        },
      ],
    });
  }

  if ((await prisma.skill.count()) === 0) {
    const skills: [string, string][] = [
      ["fa-laptop-code", "Manutenção e suporte técnico em equipamentos de informática e eletrónica"],
      ["fa-video", "Instalação e configuração de sistemas CCTV"],
      ["fa-screwdriver-wrench", "Diagnóstico e resolução de problemas técnicos e operacionais"],
      ["fa-comments", "Comunicação clara e eficaz"],
      ["fa-lightbulb", "Desenvolvimento de soluções criativas e inovadoras"],
      ["fa-rocket", "Espírito empreendedor e identificação de oportunidades"],
      ["fa-users", "Trabalho em equipa e liderança de grupos"],
      ["fa-brain", "Adaptabilidade e rápida aprendizagem"],
    ];
    await prisma.skill.createMany({
      data: skills.map(([icon, text], i) => ({ icon, text, order: i + 1 })),
    });
  }

  if ((await prisma.course.count()) === 0) {
    const courses: [string, string][] = [
      ["fa-computer", "Informática na Ótica do Utilizador"],
      ["fa-chart-line", "Empreendedorismo, Marketing e Logística Empresarial"],
      ["fa-calculator", "Contabilidade Geral"],
      ["fa-briefcase", "Secretariado Executivo"],
      ["fa-microphone", "Oratória"],
      ["fa-book-open", "Pedagogia"],
      ["fa-bolt", "Eletricidade"],
    ];
    await prisma.course.createMany({
      data: courses.map(([icon, name], i) => ({ icon, name, order: i + 1 })),
    });
  }

  if ((await prisma.language.count()) === 0) {
    await prisma.language.createMany({
      data: [
        { name: "Português", level: "Falado e escrito", percent: 100, order: 1 },
        { name: "Inglês", level: "Nível iniciante", percent: 25, order: 2 },
      ],
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
