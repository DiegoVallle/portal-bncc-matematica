"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { UNIDADE_CORES } from "@/lib/bncc";
import type { DesempenhoUnidade } from "@/lib/relatorios";

export default function GraficoUnidades({ dados }: { dados: DesempenhoUnidade[] }) {
  const dadosGrafico = dados.map((d) => ({
    ...d,
    labelCurto: d.label.length > 14 ? d.label.slice(0, 12) + "…" : d.label,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dadosGrafico} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="labelCurto" tick={{ fontSize: 11, fill: "#475569" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#475569" }} />
          <Tooltip
            formatter={(value, _name, item) => [
              `${value}% (${item.payload.acertos}/${item.payload.total})`,
              item.payload.label,
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="percentual" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            {dadosGrafico.map((entry) => (
              <Cell key={entry.unidade} fill={UNIDADE_CORES[entry.unidade]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
