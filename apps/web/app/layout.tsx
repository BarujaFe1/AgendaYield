import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgendaYield — Agenda Yield & No-Show Recovery",
  description:
    "Yield cockpit for service agendas: occupancy, no-show risk, confirmation backlog, idle capacity and recovery actions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
