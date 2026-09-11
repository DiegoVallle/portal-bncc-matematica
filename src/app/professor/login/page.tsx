"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginProfessor } from "../actions";

export default function LoginProfessorPage() {
  const [estado, action, pendente] = useActionState(loginProfessor, undefined);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="ve-card w-full max-w-md p-6 sm:p-9">
        <p className="ve-eyebrow mb-3">Espaço do professor</p>
        <h1 className="text-2xl font-bold text-slate-900">Entrar como professor(a)</h1>
        <p className="mt-1 text-sm text-slate-600">
          Acesse seus alunos e o desempenho de cada um.
        </p>

        <form action={action} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="username"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              name="senha"
              id="senha"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {estado?.erro && <p role="alert" className="text-sm text-red-600">{estado.erro}</p>}

          <button
            type="submit"
            disabled={pendente}
            className="w-full rounded-lg bg-valeedu-blue px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-blue-dark disabled:opacity-60"
          >
            {pendente ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Ainda não tem conta?{" "}
          <Link href="/professor/cadastro" className="font-medium text-valeedu-blue hover:underline">
            Criar conta
          </Link>
        </p>
        <p className="mt-2 text-sm text-slate-600">
          <Link href="/" className="hover:underline">
            ← Voltar
          </Link>
        </p>
      </div>
    </main>
  );
}
