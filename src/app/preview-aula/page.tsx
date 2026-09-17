import TeoriaCards from '../aluno/trilha/[habilidadeCodigo]/TeoriaCards';
import { AULAS_REVISADAS } from '@/content/aulas-revisadas';
export default async function Page({searchParams}:{searchParams:Promise<{aula?:string}>}) {
 const i=(await searchParams).aula==='2'?1:0;
 return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"><h1 className="mb-6 text-2xl font-bold text-valeedu-blue-dark">Hora de aprender</h1><TeoriaCards key={i} aulas={AULAS_REVISADAS.EF07MA08} aulaInicial={i} habilidadeCodigo="EF07MA08" teoriaBase="Consulta adicional: $\\frac{3}{4} = 0,75$." exemploResolvido="Divida em partes iguais." ><a href="#entender">Voltar ao começo</a></TeoriaCards></main>;
}
