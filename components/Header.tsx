"use client";

import { useState } from "react";

export default function Header({ initials }: { initials: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header>
      <div className="container navbar">
        <a href="#inicio" className="logo">
          {initials}
          <span>.</span>
        </a>

        <button
          className="menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <i className={open ? "fas fa-times" : "fas fa-bars"} />
        </button>

        <ul className={`nav-links${open ? " show" : ""}`}>
          <li><a href="#inicio" onClick={close}>Início</a></li>
          <li><a href="#perfil" onClick={close}>Perfil</a></li>
          <li><a href="#experiencia" onClick={close}>Experiência</a></li>
          <li><a href="#educacao" onClick={close}>Educação</a></li>
          <li><a href="#habilidades" onClick={close}>Habilidades</a></li>
          <li><a href="#contacto" className="nav-contact" onClick={close}>Contactar</a></li>
        </ul>
      </div>
    </header>
  );
}
