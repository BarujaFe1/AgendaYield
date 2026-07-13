const LINKS = [
  { href: "#kpis", label: "KPIs" },
  { href: "#risk", label: "Risco" },
  { href: "#confirmations", label: "Confirmações" },
  { href: "#fill-in", label: "Encaixe" },
  { href: "#actions", label: "Ações" },
  { href: "#method", label: "Método" },
];

export function SectionNav() {
  return (
    <nav className="section-nav" aria-label="Seções do cockpit">
      {LINKS.map((l) => (
        <a key={l.href} href={l.href}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}
