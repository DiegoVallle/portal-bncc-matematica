import type { ReactNode } from "react";
import "./aventura.css";

export default function AlfabetizacaoLayout({ children }: { children: ReactNode }) {
  return <div className="aventura flex flex-1 flex-col">{children}</div>;
}
