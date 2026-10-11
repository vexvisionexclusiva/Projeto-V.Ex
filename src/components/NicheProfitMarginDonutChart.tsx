import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, Sparkles, DollarSign, Award, Layers } from 'lucide-react';

interface NicheProfitMarginDonutChartProps {
  nicheName?: string;
}

export const NicheProfitMarginDonutChart: React.FC<NicheProfitMarginDonutChartProps> = ({
  nicheName = 'Gastronomia & Restaurantes'
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = [
    {
      name: 'Produtos de Prateleira (Kits & Doces)',
      categoria: 'Kits Prontos',
      margem: 74,
      faturamentoEstimadoKz: 285000,
      color: '#4f46e5'
    },
    {
      name: 'Receita Recorrente (Clube Fidelidade)',
      categoria: 'Assinaturas VIP',
      margem: 82,
      faturamentoEstimadoKz: 320000,
      color: '#10b981'
    },
    {
      name: 'Combos & Cestas de Presente',
      categoria: 'Combos Alto Ticket',
      margem: 68,
      faturamentoEstimadoKz: 410000,
      color: '#f59e0b'
    },
    {
      name: 'Eventos & Encomendas Corporativas',
      categoria: 'B2B Empresas',
      margem: 61,
      faturamentoEstimadoKz: 550000,
      color: '#06b6d4'
    },
    {
      name: 'Bebidas & Adicionais no Checkout',
      categoria: 'Up-sell Imediato',
      margem: 58,
      faturamentoEstimadoKz: 145000,
      color: '#ec4899'
    }
  ];

  const totalFaturamento = data.reduce((acc, curr) => acc + curr.faturamentoEstimadoKz, 0);
  const mediaMargem = (data.reduce((acc, curr) => acc + curr.margem, 0) / data.length).toFixed(1);
  const bestMarginItem = data.reduce((max, curr) => (curr.margem > max.margem ? curr : max), data[0]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">
                Distribuição da Margem de Lucro por Linha de Produto
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                Margem Média: {mediaMargem}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Análise financeira da rentabilidade para o nicho de <strong>{nicheName}</strong> em Angola
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-600 font-medium">Maior Margem:</span>
          <strong className="text-slate-900 font-extrabold">{bestMarginItem.categoria} ({bestMarginItem.margem}%)</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Recharts Donut Chart */}
        <div className="lg:col-span-6 h-72 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="margem"
                nameKey="name"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#ffffff"
                    strokeWidth={activeIndex === index ? 3 : 1}
                    className="transition-all cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-1 font-sans">
                        <div className="font-black text-amber-400 text-sm">{item.name}</div>
                        <div className="text-slate-300">Categoria: <strong className="text-white">{item.categoria}</strong></div>
                        <div className="flex justify-between gap-4 text-slate-300 pt-1 border-t border-slate-800">
                          <span>Margem Líquida:</span>
                          <strong className="text-emerald-400 font-black">{item.margem}%</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Projeção Mensal:</span>
                          <strong className="text-amber-300 font-black">
                            {item.faturamentoEstimadoKz.toLocaleString('pt-AO')} Kz
                          </strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout inside the Donut hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Margem Média</span>
            <span className="text-2xl font-black text-slate-900">{mediaMargem}%</span>
            <span className="text-[10px] text-emerald-600 font-bold">Líquido</span>
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="lg:col-span-6 space-y-2.5">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                activeIndex === idx
                  ? 'bg-slate-50 border-slate-300 shadow-xs'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Projeção: {item.faturamentoEstimadoKz.toLocaleString('pt-AO')} Kz/mês
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-black text-slate-900 bg-slate-50 border border-slate-200">
                  {item.margem}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold">Estratégia de Alavancagem V.Ex:</strong> Ao adicionar itens com margem acima de 70% (como caixas degustação e assinaturas recorrentes), o seu negócio em Luanda pode dobrar o lucro líquido mesmo sem aumentar a quantidade de clientes atendidos.
        </div>
      </div>
    </div>
  );
};
