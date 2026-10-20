"use client";

import { useEffect, useState } from "react";
import { BoxIcon, CloseIcon, MenuIcon } from "./Icons";

const LINKS = [
  { id: "top", href: "#top", label: "Главная" },
  { id: "track", href: "#track", label: "Отследить посылку" },
  { id: "how", href: "#how", label: "Как работает" },
  { id: "tariffs", href: "#tariffs", label: "Тарифы" },
  { id: "support", href: "#support", label: "Поддержка" },
];

export function Logo() {
  return (
    <a className="logo" href="#top" aria-label="[CARGO BRAND] — на главную">
      <span className="logo-mark">
        <BoxIcon color="#fff" width={20} height={20} />
      </span>
      <span>
        <b>[</b>CARGO BRAND<b>]</b>
      </span>
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className="nav-desktop" aria-label="Основная навигация">
          {LINKS.map((l) => (
            <a key={l.id} href={l.href} className="nav-link" aria-current={active === l.id ? "true" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#track" className="btn header-cta">
          Отследить посылку
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="nav-mobile" aria-label="Мобильная навигация">
          {LINKS.map((l) => (
            <a key={l.id} href={l.href} className="nav-link" aria-current={active === l.id ? "true" : undefined} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#track" className="btn" onClick={() => setOpen(false)}>
            Отследить посылку
          </a>
        </nav>
      )}
    </header>
  );
}
