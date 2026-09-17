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
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Vamos aprender a ler! 📖</h1>
      <p className="mt-1 text-sm text-slate-600">Toque em uma atividade pra começar.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {conteudos.map((conteudo) => {
          const info = obterNivelFonico(conteudo.nivel);
          const status = statusPorConteudo.get(conteudo.id) ?? "NAO_INICIADO";
          const concluido = status === "DOMINADO";
          const emAndamento = status === "EM_APRENDIZAGEM" || status === "EM_PRATICA";

          return (
            <form key={conteudo.id} action={iniciarNivelFonico.bind(null, conteudo.nivel)}>
              <button
                type="submit"
                className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-valeedu-blue/30 bg-white p-6 text-center shadow-sm transition hover:border-valeedu-blue hover:shadow-md"
              >
                <span className="text-5xl">{ICONE_NIVEL[conteudo.nivel] ?? "⭐"}</span>
                <span className="text-lg font-semibold text-slate-900">{info?.nome ?? conteudo.nivel}</span>
                {concluido && <span className="text-sm font-medium text-valeedu-green-dark">Concluído ✓</span>}
                {!concluido && emAndamento && <span className="text-sm font-medium text-valeedu-blue">Continuar →</span>}
                {!concluido && !emAndamento && <span className="text-sm text-slate-500">Começar →</span>}
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
