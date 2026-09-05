// Renderiza a ilustração SVG (definida pelo autor das questões em prisma/seed-data/questoes.ts)
// associada a uma questão de Geometria. O conteúdo é confiável (não vem de usuários).
export default function IlustracaoQuestao({ svg }: { svg: string }) {
  return (
    <div
      className="my-4 flex justify-center rounded-xl border border-slate-200 bg-slate-50 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
