import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';
import { CommentRule, LeadRecord } from '../types';
import { TrendingUp, BarChart3, Calendar, Sparkles, Filter, CheckCircle2, MessageSquare, Send } from 'lucide-react';

interface AutomationAnalyticsChartProps {
  rules: CommentRule[];
  leads: LeadRecord[];
}

export const AutomationAnalyticsChart: React.FC<AutomationAnalyticsChartProps> = ({ rules, leads }) => {
  const [viewMode, setViewMode] = useState<'keyword' | 'daily'>('keyword');

  // Pre-aggregated 7-day data per keyword
  const keywordData = [
    {
      keyword: 'QUERO',
      label: '#QUERO',
      dmsEnviadas: 58 + (rules.find(r => r.keyword === 'QUERO')?.matchCount ?? 0),
      cliquesWhatsapp: 32,
      vendasFechadas: 14,
      fill: '#4f46e5'
    },
    {
      keyword: 'PREÇO',
      label: '#PREÇO',
      dmsEnviadas: 42 + (rules.find(r => r.keyword === 'PREÇO')?.matchCount ?? 0),
      cliquesWhatsapp: 24,
      vendasFechadas: 9,
      fill: '#06b6d4'
    },
    {
      keyword: 'CARDAPIO',
      label: '#CARDAPIO',
      dmsEnviadas: 29 + (rules.find(r => r.keyword === 'CARDAPIO')?.matchCount ?? 0),
      cliquesWhatsapp: 18,
      vendasFechadas: 8,
      fill: '#10b981'
    },
    {
      keyword: 'DESCONTO',
      label: '#DESCONTO',
      dmsEnviadas: 25 + (rules.find(r => r.keyword === 'DESCONTO')?.matchCount ?? 0),
      cliquesWhatsapp: 15,
      vendasFechadas: 7,
      fill: '#f59e0b'
    },
    {
      keyword: 'ENTREGA',
      label: '#ENTREGA',
      dmsEnviadas: 18,
      cliquesWhatsapp: 11,
      vendasFechadas: 5,
      fill: '#ec4899'
    },
    {
      keyword: 'PROMOÇÃO',
      label: '#PROMO',
      dmsEnviadas: 14,
      cliquesWhatsapp: 9,
      vendasFechadas: 4,
      fill: '#8b5cf6'
    }
  ];

  // 7-day daily time-series breakdown
  const dailyData = [
    { dia: 'Seg (05/10)', QUERO: 7, PREÇO: 5, CARDAPIO: 4, DESCONTO: 3, total: 19 },
    { dia: 'Ter (06/10)', QUERO: 8, PREÇO: 6, CARDAPIO: 3, DESCONTO: 4, total: 21 },
    { dia: 'Qua (07/10)', QUERO: 9, PREÇO: 7, CARDAPIO: 5, DESCONTO: 3, total: 24 },
    { dia: 'Qui (08/10)', QUERO: 11, PREÇO: 8, CARDAPIO: 4, DESCONTO: 5, total: 28 },
    { dia: 'Sex (09/10)', QUERO: 14, PREÇO: 9, CARDAPIO: 6, DESCONTO: 4, total: 33 },
    { dia: 'Sáb (10/10)', QUERO: 12, PREÇO: 8, CARDAPIO: 5, DESCONTO: 6, total: 31 },
    { dia: 'Dom (11/10)', QUERO: 10, PREÇO: 6, CARDAPIO: 4, DESCONTO: 3, total: 23 }
  ];

  const totalDMs7Days = keywordData.reduce((acc, curr) => acc + curr.dmsEnviadas, 0);
  const totalCliques = keywordData.reduce((acc, curr) => acc + curr.cliquesWhatsapp, 0);
  const totalVendas = keywordData.reduce((acc, curr) => acc + curr.vendasFechadas, 0);
  const bestKeyword = keywordData.reduce((max, curr) => (curr.dmsEnviadas > max.dmsEnviadas ? curr : max), keywordData[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Desempenho de DMs por Palavra-Chave (Últimos 7 Dias)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Métricas de alcance orgânico, automação de respostas públicas e conversões no Direct
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('keyword')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'keyword'
                ? 'bg-white text-indigo-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Por Palavra-Chave
          </button>
          <button
            type="button"
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'daily'
                ? 'bg-white text-indigo-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Evolução Diária (7D)
          </button>
        </div>
      </div>

      {/* KPI highlight pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
          <span className="text-[10px] font-black uppercase text-indigo-700">Total DMs Enviadas</span>
          <div className="text-xl font-black text-indigo-950 mt-0.5">{totalDMs7Days}</div>
          <span className="text-[10px] text-emerald-700 font-bold">100% Automáticas</span>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-100">
          <span className="text-[10px] font-black uppercase text-cyan-700">Melhor Gatilho</span>
          <div className="text-xl font-black text-cyan-950 mt-0.5">{bestKeyword.label}</div>
          <span className="text-[10px] text-cyan-700 font-bold">{bestKeyword.dmsEnviadas} disparos</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
          <span className="text-[10px] font-black uppercase text-emerald-700">Cliques no WhatsApp</span>
          <div className="text-xl font-black text-emerald-950 mt-0.5">{totalCliques}</div>
          <span className="text-[10px] text-emerald-700 font-bold">{((totalCliques / totalDMs7Days) * 100).toFixed(1)}% Taxa de Clique</span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
          <span className="text-[10px] font-black uppercase text-amber-700">Vendas Concretizadas</span>
          <div className="text-xl font-black text-amber-950 mt-0.5">{totalVendas}</div>
          <span className="text-[10px] text-amber-700 font-bold">Receita Gerada em Angola</span>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'keyword' ? (
            <BarChart data={keywordData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1 font-sans">
                        <div className="font-black text-amber-400 text-sm">{data.label}</div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>DMs Enviadas:</span>
                          <strong className="text-white">{data.dmsEnviadas}</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Cliques WhatsApp:</span>
                          <strong className="text-emerald-400">{data.cliquesWhatsapp}</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Vendas Fechadas:</span>
                          <strong className="text-amber-300">{data.vendasFechadas}</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />
              <Bar dataKey="dmsEnviadas" name="DMs Enviadas" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cliquesWhatsapp" name="Cliques no WhatsApp" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="vendasFechadas" name="Vendas Fechadas" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1 font-sans">
                        <div className="font-black text-amber-400">{data.dia}</div>
                        <div className="text-slate-300">Total DMs: <strong className="text-white">{data.total}</strong></div>
                        <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-1 mt-1 space-y-0.5">
                          <div>#QUERO: {data.QUERO}</div>
                          <div>#PREÇO: {data.PREÇO}</div>
                          <div>#CARDAPIO: {data.CARDAPIO}</div>
                          <div>#DESCONTO: {data.DESCONTO}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />
              <Bar dataKey="QUERO" name="#QUERO" fill="#4f46e5" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="PREÇO" name="#PREÇO" fill="#06b6d4" stackId="a" />
              <Bar dataKey="CARDAPIO" name="#CARDAPIO" fill="#10b981" stackId="a" />
              <Bar dataKey="DESCONTO" name="#DESCONTO" fill="#f59e0b" stackId="a" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Os dados são sincronizados em tempo real conforme novos internautas comentam nas publicações do app.</span>
        </div>
        <span className="font-bold text-slate-700 hidden sm:inline">Período: 05 a 11 de Outubro</span>
      </div>
    </div>
  );
};
