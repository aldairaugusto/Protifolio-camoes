import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leonel Ganga Camões | Portfólio Profissional",
  description:
    "Portfólio profissional de Leonel Ganga Camões. Técnico de Eletrónica Industrial e Automação, estudante de Engenharia Eletromecânica e profissional de informática.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
