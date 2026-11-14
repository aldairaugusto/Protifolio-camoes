// Configuração das secções editáveis no painel (uma lista de itens cada)

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "icon";
  hint?: string;
  max?: number;
};

export type SectionConfig = {
  model: "experience" | "education" | "skill" | "course" | "language";
  title: string;
  singular: string;
  intro: string;
  fields: FieldDef[];
  titleField: string; // campo mostrado como título do item
  subField?: string;  // campo mostrado por baixo do título
  iconField?: string;
};

export const SECTIONS = {
  experiencia: {
    model: "experience",
    title: "Experiência",
    singular: "experiência",
    intro: "Percurso profissional mostrado na linha do tempo.",
    titleField: "title",
    subField: "company",
    fields: [
      { name: "date", label: "Data ou etiqueta", hint: "Ex.: Março de 2025 ou Abril – Junho de 2026", max: 60 },
      { name: "title", label: "Cargo", max: 120 },
      { name: "company", label: "Empresa / local", max: 120 },
      { name: "text", label: "Descrição", type: "textarea", max: 600 },
    ],
  },
  educacao: {
    model: "education",
    title: "Educação",
    singular: "formação académica",
    intro: "Cursos e instituições de ensino.",
    titleField: "title",
    iconField: "icon",
    fields: [
      { name: "title", label: "Curso", max: 140 },
      { name: "text", label: "Instituição / descrição", type: "textarea", max: 400 },
      { name: "icon", label: "Ícone", type: "icon" },
    ],
  },
  habilidades: {
    model: "skill",
    title: "Habilidades",
    singular: "habilidade",
    intro: "Competências técnicas e pessoais.",
    titleField: "text",
    iconField: "icon",
    fields: [
      { name: "text", label: "Habilidade", type: "textarea", max: 160 },
      { name: "icon", label: "Ícone", type: "icon" },
    ],
  },
  formacoes: {
    model: "course",
    title: "Formações complementares",
    singular: "formação",
    intro: "Cursos e formações adicionais.",
    titleField: "name",
    iconField: "icon",
    fields: [
      { name: "name", label: "Nome da formação", max: 120 },
      { name: "icon", label: "Ícone", type: "icon" },
    ],
  },
  idiomas: {
    model: "language",
    title: "Idiomas",
    singular: "idioma",
    intro: "Línguas e respectivo nível.",
    titleField: "name",
    subField: "level",
    fields: [
      { name: "name", label: "Idioma", max: 60 },
      { name: "level", label: "Descrição do nível", hint: "Ex.: Falado e escrito, Nível iniciante", max: 80 },
      { name: "percent", label: "Nível (0 a 100)", type: "number", hint: "Preenche a barra de progresso" },
    ],
  },
} satisfies Record<string, SectionConfig>;

export type SectionKey = keyof typeof SECTIONS;

export function isSectionKey(key: string): key is SectionKey {
  return Object.hasOwn(SECTIONS, key);
}

// Ícones Font Awesome sugeridos (o utilizador pode escrever outro nome)
export const ICON_SUGGESTIONS = [
  "fa-laptop-code", "fa-computer", "fa-video", "fa-screwdriver-wrench", "fa-comments",
  "fa-lightbulb", "fa-rocket", "fa-users", "fa-brain", "fa-university", "fa-graduation-cap",
  "fa-chart-line", "fa-calculator", "fa-briefcase", "fa-microphone", "fa-book-open",
  "fa-bolt", "fa-microchip", "fa-network-wired", "fa-wifi", "fa-gear", "fa-code",
  "fa-shield-halved", "fa-handshake", "fa-language", "fa-certificate", "fa-star", "fa-check",
];

type ParseResult = { data: Record<string, string | number> } | { error: string };

export function parseFields(cfg: SectionConfig, fd: FormData): ParseResult {
  const data: Record<string, string | number> = {};

  for (const f of cfg.fields) {
    let v = String(fd.get(f.name) ?? "").trim();
    if (!v) return { error: `Preencha o campo "${f.label}".` };

    const max = f.max ?? (f.type === "textarea" ? 1500 : 200);
    if (v.length > max) return { error: `"${f.label}" é demasiado longo (máximo ${max} caracteres).` };

    if (f.type === "number") {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0 || n > 100) {
        return { error: `"${f.label}" deve ser um número inteiro entre 0 e 100.` };
      }
      data[f.name] = n;
      continue;
    }

    if (f.type === "icon") {
      v = v.toLowerCase().replace(/\s+/g, "-");
      if (!v.startsWith("fa-")) v = `fa-${v}`;
      if (!/^fa-[a-z0-9-]+$/.test(v)) return { error: `"${f.label}" tem um nome inválido.` };
    }

    data[f.name] = v;
  }
  return { data };
}
