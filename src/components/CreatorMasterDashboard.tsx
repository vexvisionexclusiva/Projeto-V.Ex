import React, { useState } from 'react';
import {
  PlatformUser,
  SubServerNode,
  GlobalFeedItem,
  PriceNegotiationRequest
} from '../types';
import {
  ShieldCheck,
  Users,
  Clock,
  Flame,
  Search,
  Filter,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  Activity,
  Terminal,
  Radio,
  RefreshCw,
  Ticket,
  DollarSign,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ShoppingBag,
  Handshake,
  MessageCircle
} from 'lucide-react';

interface CreatorMasterDashboardProps {
  users: PlatformUser[];
  subServers: SubServerNode[];
  feedItems: GlobalFeedItem[];
  ticketPrice: number;
  terminalLogs: string[];
  masterCommandInput: string;
  negotiations: PriceNegotiationRequest[];
  onUpdateTicketPrice: (newPrice: number) => void;
  onToggleBlockUser: (userId: string) => void;
  onToggleGrantTicket: (userId: string) => void;
  onBoostUserProducts: (userId: string) => void;
  onExecuteCommand: (command: string) => void;
  onSetMasterCommandInput: (val: string) => void;
  onSwitchToClientView: () => void;
  onUpdateNegotiationStatus: (id: string, newStatus: PriceNegotiationRequest['status'], note?: string) => void;
}

export default function CreatorMasterDashboard({
  users,
  subServers,
  feedItems,
  ticketPrice,
  terminalLogs,
  masterCommandInput,
  negotiations,
  onUpdateTicketPrice,
  onToggleBlockUser,
  onToggleGrantTicket,
  onBoostUserProducts,
  onExecuteCommand,
  onSetMasterCommandInput,
  onSwitchToClientView,
  onUpdateNegotiationStatus
}: CreatorMasterDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedUserModal, setSelectedUserModal] = useState<PlatformUser | null>(null);

  // Ticket Price Edit State
  const [isEditingTicket, setIsEditingTicket] = useState(false);
  const [newTicketInput, setNewTicketInput] = useState(ticketPrice.toString());
  const [ticketPriceHistory, setTicketPriceHistory] = useState<Array<{ date: string; price: number; note: string }>>([
    { date: '01/10/2026', price: 5000, note: 'Preço inicial de lançamento definido pelo Criador (5.000 Kz)' }
  ]);

  // Handle Save Ticket Price
  const handleSaveTicketPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newTicketInput);
    if (!val || val <= 0) {
      alert('Por favor informe um valor válido em Kwanzas para o bilhete.');
      return;
    }

    onUpdateTicketPrice(val);
    setTicketPriceHistory(prev => [
      {
        date: 'Hoje, agora mesmo',
        price: val,
        note: `Preço atualizado pelo Criador de ${ticketPrice.toLocaleString('pt-AO')} Kz para ${val.toLocaleString('pt-AO')} Kz`
      },
      ...prev
    ]);
    setIsEditingTicket(false);
    alert(`🎟️ Preço do Bilhete atualizado para ${val.toLocaleString('pt-AO')} Kz com sucesso em toda a plataforma!`);
  };

  // User Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesProvider = selectedProvider === 'todos' || u.authProvider === selectedProvider;
    const matchesStatus =
      selectedStatus === 'todos' ||
      (selectedStatus === 'bloqueado' && u.planStatus === 'Bloqueado') ||
      (selectedStatus === 'com_bilhete' && u.hasTicket) ||
      (selectedStatus === 'online' && u.isOnline);
    const matchesQuery =
      searchQuery.trim() === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvider && matchesStatus && matchesQuery;
  });

  // Global Metrics
  const totalUsers = users.length;
  const onlineUsers = users.filter(u => u.isOnline).length;
  const totalRevenueKz = users.reduce((acc, u) => acc + u.totalSpentKz, 0);
  const totalHoursSpent = users.reduce((acc, u) => acc + u.totalUsageHours, 0);
  const totalActiveLeverages = users.reduce((acc, u) => acc + u.leveragedItems.length, 0);

  // Export Users JSON
  const handleExportUsers = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `banco_dados_usuarios_vex_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Creator Hero & Master Console Info */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Conta Principal do Criador • Painel de Controle Supremo V.Ex
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Banco de Dados de Usuários, Subservidores & Bilhetes
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Como criador, você tem a visão exclusiva e o gerenciamento absoluto de <strong>todas as contas registradas</strong>, dos movimentos em tempo real, do que cada usuário alavanca, do tempo de permanência no app e da precificação do bilhete.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right pr-4 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Faturamento Total</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {totalRevenueKz.toLocaleString('pt-AO')} Kz
              </div>
            </div>
            <button
              onClick={onSwitchToClientView}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              Ver App como Usuário
            </button>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Total de Usuários</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white mt-1">{totalUsers} Registrados</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {onlineUsers} Online Agora no App
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Tempo de Utilização</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white mt-1">{totalHoursSpent.toFixed(1)} Horas</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tempo acumulado no app</div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Itens Alavancados</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-black text-white mt-1">{totalActiveLeverages} Ativos</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Vídeos, flyers e produtos</div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Preço do Bilhete</span>
              <Ticket className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-amber-300 mt-1">{ticketPrice.toLocaleString('pt-AO')} Kz</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Editável pelo Criador</div>
          </div>
        </div>
      </div>

      {/* CONTROLE DINÂMICO DO PREÇO DO BILHETE (5.000 KZ) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Ticket className="w-5 h-5 text-amber-600" />
              </span>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Gestão & Precificação do Bilhete de Entrada da V.Ex
                </h3>
                <p className="text-xs text-slate-500">
                  Começamos com <strong>5.000 Kwanzas</strong> e você pode atualizar o preço do bilhete conforme a evolução da plataforma
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingTicket ? (
              <button
                onClick={() => {
                  setNewTicketInput(ticketPrice.toString());
                  setIsEditingTicket(true);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                <DollarSign className="w-3.5 h-3.5 text-slate-950" />
                Atualizar Preço do Bilhete
              </button>
            ) : null}
          </div>
        </div>

        {/* Edit Form */}
        {isEditingTicket && (
          <form onSubmit={handleSaveTicketPrice} className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-extrabold text-amber-950 block mb-1">
                  Novo Valor do Bilhete em Kwanzas (Kz):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={newTicketInput}
                    onChange={(e) => setNewTicketInput(e.target.value)}
                    className="w-full pl-3 pr-12 py-2 text-sm bg-white border border-amber-300 rounded-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Kz
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition"
                >
                  Salvar Novo Preço
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTicket(false)}
                  className="px-3 py-2 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <p className="text-[11px] text-amber-800">
              * O novo valor será imediatamente aplicado no simulador, no Feed Global e em todos os botões de pagamento da plataforma (Multicaixa Express, PayPay, Unitel e Afrimoney).
            </p>
          </form>
        )}

        {/* History of changes */}
        <div className="border-t border-slate-100 pt-3">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Histórico de Precificação do Bilhete:
          </div>
          <div className="space-y-1.5">
            {ticketPriceHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-amber-700">{item.price.toLocaleString('pt-AO')} Kz</span>
                  <span className="text-slate-500">• {item.note}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MESA DE NEGOCIAÇÃO DO DONO: 50% EM SERVIÇOS DE TEMPO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Handshake className="w-5 h-5 text-indigo-600" />
              </span>
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  Mesa de Negociação do Dono • Propostas 50% em Serviços de Tempo ({negotiations.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Empreendedores solicitando pagamento de 50% em Kwanzas e 50% em contrapartida de tempo ou permuta de serviços
                </p>
              </div>
            </div>
          </div>
        </div>

        {negotiations.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
            Nenhuma proposta de negociação pendente no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {negotiations.map((neg) => (
              <div key={neg.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-xs text-slate-900">{neg.userName}</span>
                    <span className="text-slate-400 text-xs"> • {neg.businessName}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    neg.status === 'Aprovado 50%' ? 'bg-emerald-100 text-emerald-800' :
                    neg.status === 'Recusado' ? 'bg-red-100 text-red-800' :
                    neg.status === 'Contraproposta' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-amber-100 text-amber-900'
                  }`}>
                    {neg.status}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-500">
                    <span>Preço Original:</span>
                    <strong className="text-slate-800">{neg.originalPriceKz.toLocaleString('pt-AO')} Kz</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>50% em Dinheiro Proposto:</span>
                    <span>{neg.offeredCashKz.toLocaleString('pt-AO')} Kz</span>
                  </div>
                  <div className="pt-1 border-t border-slate-100 text-[11px] text-slate-700">
                    <strong className="text-slate-900">Contrapartida 50% em Serviços/Tempo:</strong>
                    <p className="mt-0.5 text-slate-600 italic">"{neg.serviceOrTimeProposal}"</p>
                  </div>
                  {neg.ownerNotes && (
                    <div className="text-[11px] text-indigo-700 font-semibold pt-1">
                      Nota do Dono: {neg.ownerNotes}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onUpdateNegotiationStatus(neg.id, 'Aprovado 50%', 'Aprovado pelo Dono! 50% em Kz + 50% em serviços')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black transition"
                    >
                      Aprovar 50%
                    </button>
                    <button
                      onClick={() => onUpdateNegotiationStatus(neg.id, 'Contraproposta', 'Dono enviou contraproposta de ajuste de horas')}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-extrabold transition"
                    >
                      Contraproposta
                    </button>
                    <button
                      onClick={() => onUpdateNegotiationStatus(neg.id, 'Recusado', 'Negociação recusada pelo criador')}
                      className="px-2 py-1 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-600 rounded-lg text-[11px] font-bold transition"
                    >
                      Recusar
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/${neg.phone}?text=${encodeURIComponent(
                      `Olá ${neg.userName}! Aqui é o Dono da V.Ex Visão Exclusiva. Recebi a sua proposta de 50% em serviços de tempo para o plano de ${neg.originalPriceKz.toLocaleString('pt-AO')} Kz. Vamos fechar os detalhes?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-black flex items-center gap-1 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BANCO DE DADOS CENTRAL DE USUÁRIOS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Banco de Dados Geral de Usuários & Contas Registradas ({users.length})
            </h3>
            <p className="text-xs text-slate-500">
              Rastreamento de contas criadas (E-mail, Telefone, Google, Facebook, Twitter), tempo de permanência e o que cada um alavanca
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportUsers}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="Baixar banco de dados completo em formato JSON"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar JSON
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome, negócio, e-mail ou telefone..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          {/* Provider Filter */}
          <div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
            >
              <option value="todos">Todos os Métodos de Cadastro</option>
              <option value="google">Autenticação Google</option>
              <option value="facebook">Autenticação Facebook</option>
              <option value="twitter">Autenticação Twitter / X</option>
              <option value="phone">Telemóvel (Telefone OTP)</option>
              <option value="email">E-mail Direto</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
            >
              <option value="todos">Todos os Estados</option>
              <option value="online">🟢 Usuários Online Agora</option>
              <option value="com_bilhete">🎟️ Com Bilhete 5.000 Kz</option>
              <option value="bloqueado">🚫 Contas Bloqueadas</option>
            </select>
          </div>
        </div>

        {/* Users Database Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                <th className="py-3 px-4">Usuário & Negócio</th>
                <th className="py-3 px-3">Cadastro & Login</th>
                <th className="py-3 px-3">Tempo no App</th>
                <th className="py-3 px-3">O Que Alavanca</th>
                <th className="py-3 px-3">Bilhete / Plano</th>
                <th className="py-3 px-3">Faturamento</th>
                <th className="py-3 px-4 text-right">Ações Master</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhum usuário corresponde aos filtros da busca.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition group">
                    {/* User & Business */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 to-amber-500 text-white flex items-center justify-center font-black text-xs">
                            {u.name[0]}
                          </div>
                          {u.isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                            {u.name}
                            {u.role === 'creator' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800">
                                Criador
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {u.businessName} • <span className="text-slate-400">{u.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Auth Method */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-700 truncate max-w-[140px]">{u.identifier}</div>
                      <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded mt-0.5 ${
                        u.authProvider === 'google' ? 'bg-red-50 text-red-700 border border-red-200' :
                        u.authProvider === 'facebook' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        u.authProvider === 'twitter' ? 'bg-slate-900 text-white' :
                        u.authProvider === 'phone' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {u.authProvider}
                      </span>
                    </td>

                    {/* Usage Time */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{u.usageTimeMinutesToday}m hoje</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Total: {u.totalUsageHours.toFixed(1)}h • {u.lastActive}
                      </div>
                    </td>

                    {/* Leveraged Items */}
                    <td className="py-3.5 px-3">
                      {u.leveragedItems.length > 0 ? (
                        <div>
                          <div className="font-extrabold text-indigo-600 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-orange-500" />
                            <span>{u.leveragedItems.length} Alavancado(s)</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[130px]" title={u.leveragedItems[0].title}>
                            {u.leveragedItems[0].title}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Nenhum produto</span>
                      )}
                    </td>

                    {/* Plan / Ticket Status */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                          u.planStatus === 'Bloqueado' ? 'bg-red-100 text-red-800' :
                          u.planStatus === 'Alavancagem Ativa' ? 'bg-emerald-100 text-emerald-800' :
                          u.planStatus === 'BioLink Vitalícia' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-amber-100 text-amber-900'
                        }`}>
                          {u.planStatus}
                        </span>
                        {u.hasTicket && (
                          <div className="text-[9px] font-black text-amber-600 uppercase flex items-center gap-0.5">
                            <Ticket className="w-2.5 h-2.5" /> Bilhete 5.000 Kz
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Spent */}
                    <td className="py-3.5 px-3 font-black text-slate-900">
                      {u.totalSpentKz.toLocaleString('pt-AO')} Kz
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Open Dossier */}
                      <button
                        onClick={() => setSelectedUserModal(u)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold rounded-lg text-[11px] transition"
                        title="Ver histórico de movimentos, campanhas e tempo de uso"
                      >
                        Ver Dossiê
                      </button>

                      {/* Block/Unblock */}
                      {u.role !== 'creator' && (
                        <button
                          onClick={() => onToggleBlockUser(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition ${
                            u.planStatus === 'Bloqueado'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700'
                          }`}
                        >
                          {u.planStatus === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLUSTER DE SUBSERVIDORES & TERMINAL MASTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subservers Cluster */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                Cluster de Subservidores V.Ex ({subServers.length} Nós Ativos)
              </h3>
              <p className="text-xs text-slate-500">Monitoramento de nós descentralizados, carga e latência</p>
            </div>
            <button
              onClick={() => {
                alert('Todos os subservidores responderam com integridade 100%!');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sincronizar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subServers.map((node) => (
              <div key={node.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    {node.name}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {node.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">{node.region}</div>
                <div className="grid grid-cols-3 gap-1 text-center pt-1 border-t border-slate-200/60 text-[10px]">
                  <div>CPU: <strong>{node.cpu}%</strong></div>
                  <div>RAM: <strong>{node.memory}%</strong></div>
                  <div>Ping: <strong className="text-emerald-600">{node.latencyMs}ms</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Command Shell */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-xl text-emerald-400 font-mono text-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-xs">V.Ex Master Command Shell</span>
            </div>
            <span className="text-[10px] text-slate-500">Root Privileges</span>
          </div>

          {/* Logs */}
          <div className="h-44 overflow-y-auto space-y-1 text-[11px] pr-2">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('>') ? 'text-white font-bold' : log.includes('ERRO') ? 'text-red-400' : 'text-emerald-400'}>
                {log}
              </div>
            ))}
          </div>

          {/* Command Input */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex gap-2">
              <span className="text-amber-400 font-bold self-center">v-ex#</span>
              <input
                type="text"
                value={masterCommandInput}
                onChange={(e) => onSetMasterCommandInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExecuteCommand(masterCommandInput)}
                placeholder="Comando (ex: ticket:set 5000, users:sync)..."
                className="flex-1 bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                onClick={() => onExecuteCommand(masterCommandInput)}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                Executar
              </button>
            </div>

            <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 font-sans">
              <span className="text-slate-500">Atalhos:</span>
              {['ticket:set 5000', 'cluster:restart', 'users:audit', 'payments:sync'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => onSetMasterCommandInput(cmd)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: DOSSIÊ COMPLETO DO USUÁRIO SELECIONADO */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 to-amber-500 text-white flex items-center justify-center font-black text-lg">
                  {selectedUserModal.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedUserModal.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      selectedUserModal.planStatus === 'Bloqueado' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedUserModal.planStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedUserModal.businessName} • {selectedUserModal.city}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats of the User */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tempo Hoje</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">{selectedUserModal.usageTimeMinutesToday} min</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tempo Acumulado</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">{selectedUserModal.totalUsageHours.toFixed(1)} horas</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Bilhete de 5.000 Kz</div>
                <div className="font-black text-amber-700 text-sm mt-0.5">
                  {selectedUserModal.hasTicket ? '✅ Adquirido' : '❌ Não Comprado'}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Total Faturado</div>
                <div className="font-black text-emerald-700 text-sm mt-0.5">{selectedUserModal.totalSpentKz.toLocaleString('pt-AO')} Kz</div>
              </div>
            </div>

            {/* O Que Ele Alavanca */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  O Que Ele Alavanca no App ({selectedUserModal.leveragedItems.length} Itens)
                </h4>
                <button
                  onClick={() => onBoostUserProducts(selectedUserModal.id)}
                  className="text-xs text-amber-700 font-black hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Dar Boost Master nas Campanhas
                </button>
              </div>

              {selectedUserModal.leveragedItems.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
                  Este usuário ainda não cadastrou produtos ou flyers de alavancagem ativa.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedUserModal.leveragedItems.map((item) => (
                    <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-black text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.type === 'video' ? '🎬 Vídeo Marketing' : item.type === 'flyer' ? '🎨 Flyer Promocional' : '🛍️ Produto'} • {item.category} • Preço: <strong>{item.priceKz.toLocaleString('pt-AO')} Kz</strong>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-indigo-600">{item.viewsCount.toLocaleString('pt-AO')} views</div>
                        <div className="text-[10px] text-slate-400">{item.clicksCount} cliques • {item.ordersCount} pedidos</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Histórico Completo de Movimentos / Atividades */}
            <div className="space-y-3">
              <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" />
                Histórico de Movimentos & Atividades do Usuário
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedUserModal.activities.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between text-xs">
                    <div>
                      <div className="font-black text-slate-800">{act.action}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{act.details}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-2">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Master Actions Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onToggleGrantTicket(selectedUserModal.id);
                    setSelectedUserModal(prev => prev ? { ...prev, hasTicket: !prev.hasTicket, planStatus: !prev.hasTicket ? 'Bilhete 5.000 Kz Ativo' : 'Gratuito' } : null);
                  }}
                  className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  {selectedUserModal.hasTicket ? 'Remover Bilhete' : 'Conceder Bilhete 5.000 Kz'}
                </button>

                {selectedUserModal.role !== 'creator' && (
                  <button
                    onClick={() => {
                      onToggleBlockUser(selectedUserModal.id);
                      setSelectedUserModal(prev => prev ? { ...prev, planStatus: prev.planStatus === 'Bloqueado' ? 'Alavancagem Ativa' : 'Bloqueado' } : null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedUserModal.planStatus === 'Bloqueado'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {selectedUserModal.planStatus === 'Bloqueado' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {selectedUserModal.planStatus === 'Bloqueado' ? 'Desbloquear Conta' : 'Bloquear Acesso'}
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedUserModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Fechar Dossiê
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
