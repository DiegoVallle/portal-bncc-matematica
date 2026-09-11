import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";

export default async function Home() {
  const sessao = await obterSessao();
  if (sessao?.role === "professor") redirect("/professor/dashboard");
  if (sessao?.role === "aluno") redirect("/aluno/painel");

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-12 lg:grid-cols-[1.2fr_1fr] lg:py-20">
      <section>
        <p className="ve-eyebrow">Matemática com acompanhamento</p>
        <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-valeedu-blue-dark sm:text-6xl">
          Cada descoberta,<br />um passo à frente.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
          Um espaço para entender matemática, experimentar ideias e ganhar confiança. Com o professor por perto em cada etapa.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-sm font-medium text-valeedu-blue">
          {["Entender", "Praticar", "Evoluir"].map((etapa, i) => (
            <span key={etapa} className="rounded-full border border-slate-200 bg-white px-4 py-2"><span aria-hidden="true" className="mr-2 text-valeedu-green">0{i + 1}</span>{etapa}</span>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-500">Ensino Fundamental · Habilidades alinhadas à BNCC</p>
      </section>
      <section className="ve-card p-6 sm:p-8" aria-labelledby="acesso-titulo">
        <p className="ve-eyebrow">Bem-vindo à ValeEdu</p>
        <h2 id="acesso-titulo" className="mt-2 text-2xl font-semibold text-valeedu-blue-dark">Vamos começar?</h2>
        <p className="mt-2 text-sm text-slate-600">Escolha seu acesso para continuar.</p>
        <div className="mt-7 space-y-4">
          <Link href="/aluno/entrar" className="group block rounded-2xl border border-green-200 bg-green-50 p-6 transition-colors hover:bg-green-100">
            <h3 className="flex justify-between text-lg font-semibold text-valeedu-green">Sou aluno(a)<span aria-hidden="true">↗</span></h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Minha aula, minhas descobertas e meu progresso.</p>
          </Link>
          <Link href="/professor/login" className="group block rounded-2xl border border-slate-200 p-6 transition-colors hover:bg-slate-50">
            <h3 className="flex justify-between text-lg font-semibold text-valeedu-blue">Sou professor(a)<span aria-hidden="true">↗</span></h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Planejar o próximo passo e acompanhar cada aluno.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
