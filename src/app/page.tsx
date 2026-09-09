import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";

export default async function Home() {
  const sessao = await obterSessao();
  if (sessao?.role === "professor") redirect("/professor/dashboard");
  if (sessao?.role === "aluno") redirect("/aluno/painel");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          BNCC · Matemática · Ensino Fundamental
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          ValeEdu Matemática
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Testes diagnósticos de Matemática, organizados por ano escolar (1º ao 9º ano)
          e por bimestre, alinhados às habilidades da BNCC.
        </p>

        <p className="mt-10 text-sm font-medium text-slate-500">Quem é você?</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Link
            href="/professor/login"
            className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-700">
              Sou professor(a)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre seus alunos e acompanhe o desempenho de cada um por unidade
              temática.
            </p>
          </Link>

          <Link
            href="/aluno/entrar"
            className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-valeedu-green-dark">
              Sou aluno(a)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Entre com o usuário e a senha que seu professor(a) cadastrou para você.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
