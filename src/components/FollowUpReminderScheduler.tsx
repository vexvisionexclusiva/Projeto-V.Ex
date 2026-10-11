import React, { useState } from 'react';
import { LeadRecord, FollowUpReminder, BusinessProfile } from '../types';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Send,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  ChevronRight,
  UserCheck,
  Check
} from 'lucide-react';

interface FollowUpReminderSchedulerProps {
  leads: LeadRecord[];
  profile: BusinessProfile;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadRecord['status']) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const FollowUpReminderScheduler: React.FC<FollowUpReminderSchedulerProps> = ({
  leads,
  profile,
  onUpdateLeadStatus,
  onNotify
}) => {
  const [reminders, setReminders] = useState<FollowUpReminder[]>([
    {
      id: 'rem_1',
      leadId: '3',
      leadUsername: '@beatriz_talatona',
      keyword: 'CARDAPIO',
      productName: 'Caixa Degustação Gourmet & Cardápio da Semana',
      scheduledDate: 'Hoje',
      scheduledTime: '15:30',
      notes: 'Recebeu link do cardápio há 40 minutos mas não finalizou no WhatsApp.',
      suggestedMessage: 'Olá @beatriz_talatona! Vi que recebeu o nosso cardápio no Direct ✨ Gostaria de confirmar se prefere receber em Talatona ainda hoje ou agendar para amanhã?',
      status: 'Pendente',
      priority: 'Alta',
      channel: 'WhatsApp',
      createdAt: 'Hoje às 11:00'
    },
    {
      id: 'rem_2',
      leadId: '2',
      leadUsername: '@pedro_maianga',
      keyword: 'PREÇO',
      productName: 'Combo Especial V.Ex',
      scheduledDate: 'Amanhã',
      scheduledTime: '10:00',
      notes: 'Perguntou o preço e pediu tempo para confirmar com a esposa.',
      suggestedMessage: 'Olá @pedro_maianga! Tudo bem? Passando para te lembrar que estamos segurando o valor promocional do Combo até às 12h de hoje! Quer fechar o envio?',
      status: 'Pendente',
      priority: 'Média',
      channel: 'WhatsApp',
      createdAt: 'Hoje às 09:30'
    }
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [customUsername, setCustomUsername] = useState('');
  const [scheduledDate, setScheduledDate] = useState('Hoje');
  const [scheduledTime, setScheduledTime] = useState('16:00');
  const [priority, setPriority] = useState<'Alta' | 'Média' | 'Normal'>('Alta');
  const [channel, setChannel] = useState<'WhatsApp' | 'Instagram Direct'>('WhatsApp');
  const [productName, setProductName] = useState('Produto Promocional V.Ex');
  const [suggestedMessage, setSuggestedMessage] = useState(
    'Olá! Vi que recebeu o link do nosso produto no Direct. Ficou alguma dúvida sobre o valor ou formas de entrega em Luanda?'
  );
  const [notes, setNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick message presets
  const messagePresets = [
    {
      label: 'Dúvidas e Entrega',
      text: 'Olá! Vi que recebeu o link do produto no Direct ✨ Ficou com alguma dúvida sobre prazo de entrega ou opções de pagamento via Multicaixa Express?'
    },
    {
      label: 'Estoque Limitado',
      text: 'Olá! Passando rápido para avisar que restam apenas 3 unidades deste lote promocional. Quer que eu garanta a sua reserva agora?'
    },
    {
      label: 'Desconto Exclusivo 10%',
      text: 'Olá! Para te ajudar a fechar seu pedido hoje pelo WhatsApp, consigo liberar um cupom exclusivo de 10% de desconto! Quer aproveitar?'
    }
  ];

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLead = leads.find(l => l.id === selectedLeadId);
    const username = targetLead ? targetLead.username : (customUsername.startsWith('@') ? customUsername : `@${customUsername}`);

    const newReminder: FollowUpReminder = {
      id: `rem_${Date.now()}`,
      leadId: selectedLeadId || `lead_${Date.now()}`,
      leadUsername: username,
      keyword: targetLead?.keyword || 'PRODUTO',
      productName: productName || 'Produto em Destaque',
      scheduledDate,
      scheduledTime,
      notes: notes || 'Agendamento para retomar conversa e fechar venda.',
      suggestedMessage,
      status: 'Pendente',
      priority,
      channel,
      createdAt: 'Agora mesmo'
    };

    setReminders(prev => [newReminder, ...prev]);
    setShowNewModal(false);
    if (onNotify) {
      onNotify(`Lembrete de follow-up para ${username} agendado para ${scheduledDate} às ${scheduledTime}!`, 'success');
    }
  };

  const handleMarkCompleted = (id: string, leadId: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'Concluído' } : r));
    onUpdateLeadStatus(leadId, 'Venda Fechada');
    if (onNotify) {
      onNotify('Follow-up concluído com sucesso e lead atualizado para Venda Fechada!', 'success');
    }
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    if (onNotify) {
      onNotify('Lembrete removido.', 'info');
    }
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onNotify) {
      onNotify('Mensagem de follow-up copiada!', 'info');
    }
  };

  const pendingCount = reminders.filter(r => r.status === 'Pendente').length;
  const completedCount = reminders.filter(r => r.status === 'Concluído').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Agendador de Lembretes & Follow-Up Manual de Leads
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Acompanhe clientes que receberam o link de produto no Direct mas ainda não fecharam a compra
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Lembrete de Follow-Up
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-800">Lembretes Pendentes</span>
            <div className="text-xl font-black text-amber-950 mt-0.5">{pendingCount} Clientes</div>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-800">Vendas Fechadas após Follow-Up</span>
            <div className="text-xl font-black text-emerald-950 mt-0.5">{completedCount} Fechamentos</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-indigo-800">Taxa de Resgate de Vendas</span>
            <div className="text-xl font-black text-indigo-950 mt-0.5">+32% de Conversão</div>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
            Nenhum lembrete agendado. Clique em "Novo Lembrete de Follow-Up" para agendar uma abordagem com clientes do Direct.
          </div>
        ) : (
          reminders.map((rem) => {
            const isCompleted = rem.status === 'Concluído';
            const waUrl = `https://wa.me/${profile.phone}?text=${encodeURIComponent(rem.suggestedMessage)}`;

            return (
              <div
                key={rem.id}
                className={`p-4 rounded-2xl border transition space-y-3 ${
                  isCompleted
                    ? 'bg-slate-50/60 border-slate-200 opacity-70'
                    : 'bg-white border-slate-200 shadow-xs hover:border-indigo-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{rem.leadUsername}</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">
                      #{rem.keyword}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rem.priority === 'Alta'
                          ? 'bg-rose-100 text-rose-800'
                          : rem.priority === 'Média'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Prioridade {rem.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      <span>{rem.scheduledDate} às {rem.scheduledTime}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rem.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Produto de Interesse: <span className="text-slate-800">{rem.productName}</span>
                  </div>
                  {rem.notes && <div className="text-[11px] text-slate-500 italic">Nota: {rem.notes}</div>}
                  <div className="text-xs text-slate-900 font-medium pt-1">
                    "{rem.suggestedMessage}"
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Enviar Follow-Up no WhatsApp
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyMessage(rem.suggestedMessage, rem.id)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                    >
                      {copiedId === rem.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === rem.id ? 'Copiada' : 'Copiar Texto'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleMarkCompleted(rem.id, rem.leadId)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Marcar como Venda Fechada
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      title="Excluir lembrete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Follow-Up Reminder */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Agendar Follow-Up Manual de Cliente
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Selecionar Lead Captado pelo Direct:
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.username} • #{l.keyword} • Estado: {l.status}
                    </option>
                  ))}
                  <option value="">Outro cliente / digitar manual</option>
                </select>
              </div>

              {!selectedLeadId && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nome de Usuário (@):</label>
                  <input
                    type="text"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    placeholder="@nome_do_cliente"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Data do Lembrete:</label>
                  <select
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option>Hoje</option>
                    <option>Amanhã</option>
                    <option>Em 2 dias</option>
                    <option>Em 3 dias</option>
                    <option>Próxima Semana</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Horário:</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Prioridade:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Alta</option>
                    <option>Média</option>
                    <option>Normal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Canal de Contato:</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>WhatsApp</option>
                    <option>Instagram Direct</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Produto Promovido:</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Combo Especial, Caixa de Doces, Vestido..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Mensagem Sugerida para o Follow-Up:</label>
                  <span className="text-[10px] text-slate-400">Templates Rápidos</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {messagePresets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSuggestedMessage(p.text)}
                      className="text-[10px] px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={suggestedMessage}
                  onChange={(e) => setSuggestedMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notas Internas do Dono:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Cliente pediu para ligar após às 15h"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition shadow-md"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
