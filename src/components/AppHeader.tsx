import Image from "next/image";
import Link from "next/link";

// Cabeçalho de marca — logo + nome, presente em toda página (diagnóstico e
// trilha). Não é navegação (cada página mantém seu próprio cabeçalho de
// conteúdo/ações abaixo disso) — só identidade visual consistente.
export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-valeedu.png" alt="ValeEdu Matemática" width={32} height={32} priority />
          <span className="text-sm font-bold tracking-tight">
            <span className="text-valeedu-blue">Vale</span>
            <span className="text-valeedu-green">Edu</span>
            <span className="ml-1 font-normal text-slate-500">Matemática</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
