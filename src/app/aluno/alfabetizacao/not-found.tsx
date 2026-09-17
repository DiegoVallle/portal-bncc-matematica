import Link from "next/link";
export default function NotFound() {
  return <main className="mx-auto w-full max-w-xl px-6 py-12"><div className="aventura-card p-8 text-center"><p aria-hidden="true" className="text-4xl">🧭</p><h1 className="mt-4 text-xl font-bold">Vamos encontrar outro caminho?</h1><p className="mt-3 text-slate-600">Não encontramos esta atividade.</p><Link href="/aluno/alfabetizacao" className="aventura-botao mt-6">Minhas descobertas</Link></div></main>;
}
