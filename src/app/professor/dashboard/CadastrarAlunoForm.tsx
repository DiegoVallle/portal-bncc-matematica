"use client";

import { useActionState } from "react";
import { cadastrarAlunoPeloProfessor } from "../actions";
import { ANOS_ESCOLARES } from "@/lib/bncc";

export default function CadastrarAlunoForm() {
  const [estado, action, pendente] = useActionState(cadastrarAlunoPeloProfessor, undefined);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-700">Nome do aluno</label>
        <input
          type="text"
          name="nome"
          required
          placeholder="Ex: Maria Silva"
          className="mt-1 w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700">Usuário</label>
        <input
          type="text"
          name="usuario"
          required
          placeholder="Ex: maria.silva"
          className="mt-1 w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700">Senha</label>
        <input
          type="text"
          name="senha"
          required
          minLength={4}
          placeholder="Pelo menos 4 caracteres"
          className="mt-1 w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700">Ano escolar</label>
        <select
          name="anoEscolar"
          required
          className="mt-1 w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {ANOS_ESCOLARES.map((ano) => (
            <option key={ano} value={ano}>
              {ano}º ano
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pendente}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pendente ? "Cadastrando..." : "Cadastrar aluno"}
      </button>
      {estado?.erro && <p className="w-full text-sm text-red-600">{estado.erro}</p>}
    </form>
  );
}
