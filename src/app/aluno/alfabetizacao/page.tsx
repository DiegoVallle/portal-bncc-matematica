import CenaAlfabetizacao from "@/components/CenaAlfabetizacao";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obterNivelFonico, ORDEM_FONICA } from "@/lib/alfabetizacao";
import { iniciarNivelFonico } from "./actions";

// Lista dos níveis já disponíveis (piloto: 3 de 10 — só os que têm
// ConteudoAlfabetizacao semeado). Pensada pra criança que ainda não lê:
// pouco texto, ícone grande por nível, nada de tabela/menu denso.
export default async function AlfabetizacaoPage() {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const conteudos = await prisma.conteudoAlfabetizacao.findMany({
    orderBy: { ordemPedagogica: "asc" },
  });

  const progressos = await prisma.progressoFonico.findMany({
    where: { alunoId: sessao.id, conteudoId: { in: conteudos.map((c) => c.id) } },
  });
  const statusPorConteudo = new Map(progressos.map((p) => [p.conteudoId, p.status]));

  const ICONE_NIVEL: Record<string, string> = {
    CONSCIENCIA_RIMA: "🎵",
    CONSCIENCIA_SILABICA: "👏",
    CONSCIENCIA_FONEMICA: "👂",
    CORRESPONDENCIA_VOGAIS: "🔤",
    CORRESPONDENCIA_CONSOANTES: "🔡",
    SILABAS_SIMPLES: "🧩",
    PALAVRAS_SIMPLES: "📖",
    ENCONTROS_E_DIGRAFOS: "✨",
    PALAVRAS_COMPLEXAS: "📚",
    FRASES_E_TEXTOS: "💬",
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <p className="mb-3 text-sm font-semibold tracking-wide text-valeedu-green-dark">ValeEdu · Pequenas grandes descobertas</p>
      <h1 className="text-2xl font-bold text-slate-900">Uma aventura de sons e histórias</h1>
      <p className="mt-1 text-sm text-slate-600">Ouça, descubra e brinque. Cada descoberta é um novo passo!</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {conteudos.map((conteudo) => {
          const info = obterNivelFonico(conteudo.nivel);
          const status = statusPorConteudo.get(conteudo.id) ?? "NAO_INICIADO";
          const concluido = status === "DOMINADO";
          const emAndamento = status === "EM_APRENDIZAGEM" || status === "EM_PRATICA";

          return (
            <form key={conteudo.id} action={iniciarNivelFonico.bind(null, conteudo.nivel)}>
              <button
                type="submit"
                className="aventura-card group flex h-full w-full flex-col gap-3 rounded-3xl border-2 border-valeedu-blue/15 bg-white p-3 text-center shadow-sm transition hover:border-valeedu-green hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-valeedu-blue"
              >
                <CenaAlfabetizacao nivel={conteudo.nivel} />
                <span aria-hidden="true" className="text-2xl">{ICONE_NIVEL[conteudo.nivel] ?? "⭐"}</span>
                <span className="text-lg font-semibold text-slate-900">{info?.nome ?? conteudo.nivel}</span>
                {concluido && <span className="text-sm font-medium text-valeedu-green-dark">Concluído ✓</span>}
                {!concluido && emAndamento && <span className="text-sm font-medium text-valeedu-blue">Continuar →</span>}
                {!concluido && !emAndamento && <span className="text-sm text-slate-500">Vamos brincar →</span>}
              </button>
            </form>
          );
        })}
      </div>

      {conteudos.length < ORDEM_FONICA.length && (
        <p className="mt-8 text-center text-xs text-slate-400">
          Mais atividades chegando em breve — este é o começo da trilha!
        </p>
      )}
    </main>
  );
}
