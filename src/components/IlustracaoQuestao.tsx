// Renderiza um SVG curado por quem autora o conteúdo (questão do diagnóstico
// ou aula da trilha) — nunca vindo de usuário. Reaproveitado tanto por
// Questao.ilustracaoSvg (diagnóstico) quanto por Conteudo.ilustracaoSvg (trilha).
export default function IlustracaoQuestao({ svg }: { svg: string }) {
  return (
    <div
      className="my-4 flex justify-center rounded-xl border border-slate-200 bg-slate-50 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
