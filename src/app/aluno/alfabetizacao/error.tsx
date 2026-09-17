"use client";
import Link from "next/link";
export default function ErrorPage({ unstable_retry }: { unstable_retry: () => void }) {
  return <main className="mx-auto w-full max-w-xl px-6 py-12"><div role="alert" className="aventura-card p-8 text-center"><p aria-hidden="true" className="text-4xl">🌱</p><h1 className="mt-4 text-xl font-bold">Vamos tentar mais uma vez?</h1><p className="mt-3 text-slate-600">Não conseguimos abrir esta atividade agora.</p><button onClick={unstable_retry} className="aventura-botao mt-6">Tentar novamente</button><Link className="mt-6 block font-medium text-valeedu-blue" href="/aluno/alfabetizacao">Voltar às descobertas</Link></div></main>;
}
