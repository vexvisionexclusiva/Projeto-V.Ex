import React, { useState } from 'react';
import {
  GlobalFeedItem,
  PlatformUser
} from '../types';
import {
  Video,
  Palette,
  ShoppingBag,
  Heart,
  Share2,
  MessageCircle,
  ExternalLink,
  Flame,
  Sparkles,
  MapPin,
  Clock,
  Plus,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Filter,
  Search,
  Eye,
  ArrowUpRight
} from 'lucide-react';

interface GlobalFeedProps {
  feedItems: GlobalFeedItem[];
  currentUser: PlatformUser;
  ticketPrice: number;
  onLikeItem: (id: string) => void;
  onShareItem: (item: GlobalFeedItem) => void;
  onPublishToFeed: (newItem: Omit<GlobalFeedItem, 'id' | 'likesCount' | 'sharesCount' | 'viewsCount' | 'ordersCount' | 'createdAt'>) => void;
  onOpenTicketCheckout: () => void;
  isCreatorView?: boolean;
  onBoostItemByCreator?: (id: string) => void;
}

export default function GlobalFeed({
  feedItems,
  currentUser,
  ticketPrice,
  onLikeItem,
  onShareItem,
  onPublishToFeed,
  onOpenTicketCheckout,
  isCreatorView = false,
  onBoostItemByCreator
}: GlobalFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState<GlobalFeedItem | null>(null);

  // New Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'video' | 'flyer' | 'product_launch'>('flyer');
  const [newCategory, setNewCategory] = useState('Gastronomia & Restaurantes');
  const [newDescription, setNewDescription] = useState('');
  const [newPriceKz, setNewPriceKz] = useState('12500');
  const [newOriginalPriceKz, setNewOriginalPriceKz] = useState('15000');
  const [newBadgeText, setNewBadgeText] = useState('OFERTA LIMITADA');
  const [newHookOrHeadline, setNewHookOrHeadline] = useState('');
  const [newDurationDays, setNewDurationDays] = useState(15);
  const [newPhone, setNewPhone] = useState(currentUser.phone || '244923456789');

  const categories = [
    'todos',
    'Gastronomia & Restaurantes',
    'Moda, Roupas & Calçados',
    'Serviços Especializados',
    'Beleza & Estética',
    'Varejo & Eletrônicos'
  ];

  // Filtering
  const filteredItems = feedItems.filter((item) => {
    const matchesCat = selectedCategory === 'todos' || item.category === selectedCategory;
    const matchesType = selectedType === 'todos' || item.type === selectedType;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creatorBusiness.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creatorCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesType && matchesSearch;
  });

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Por favor, informe o nome do produto ou campanha.');
      return;
    }

    onPublishToFeed({
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorBusiness: currentUser.businessName,
      creatorCity: currentUser.city || 'Luanda, Angola',
      creatorPhone: newPhone.replace(/\D/g, ''),
      creatorAvatarColor: 'from-indigo-600 to-purple-600',
      title: newTitle.trim(),
      type: newType,
      category: newCategory,
      description: newDescription || `Aproveite as novidades e condições especiais de ${currentUser.businessName}!`,
      priceKz: Number(newPriceKz) || 5000,
      originalPriceKz: newOriginalPriceKz ? Number(newOriginalPriceKz) : undefined,
      badgeText: newBadgeText || 'NOVIDADE',
      mediaTheme: newType === 'video' ? 'amber' : newType === 'flyer' ? 'indigo' : 'emerald',
      videoHook: newType === 'video' ? newHookOrHeadline || 'Olha só o que preparamos para você em Angola!' : undefined,
      flyerHeadline: newType === 'flyer' ? newHookOrHeadline || 'SUPER OFERTA EXCLUSIVA' : undefined,
      flyerCtaText: 'Peça agora pelo WhatsApp para entrega rápida!',
      leverageDurationDays: newDurationDays,
      leverageDaysRemaining: newDurationDays,
      isCreatorBoosted: currentUser.role === 'creator'
    });

    setShowPublishModal(false);
    // Reset inputs
    setNewTitle('');
    setNewDescription('');
    setNewHookOrHeadline('');
    alert('🎉 Produto alavancado com sucesso! Já está em circulação no Feed Global para todos os usuários de Angola.');
  };

  const totalCollectiveViews = feedItems.reduce((acc, curr) => acc + curr.viewsCount, 0);
  const totalOrders = feedItems.reduce((acc, curr) => acc + curr.ordersCount, 0);

  return (
    <div className="space-y-6">
      {/* Mutual Cross-Exposure Announcement Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              Feed Global V.Ex • Rede Cruzada de Audiência Angolana
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              O Produto do Fulano A passa no Feed do Fulano B, C e Vice-Versa
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Aqui todos os vídeos marketing, flyers de vendas e campanhas criadas na plataforma circulam em um <strong>feed público compartilhado</strong>. Cada usuário que alavanca o seu produto ganha a atenção dos clientes de todos os outros negócios de Luanda, Benguela, Huambo e de toda Angola!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Alcance Coletivo: <strong className="text-white">{totalCollectiveViews.toLocaleString('pt-AO')} views</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Pedidos Fechados: <strong className="text-white">{totalOrders.toLocaleString('pt-AO')} no WhatsApp</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Alavancagem Ativa: <strong className="text-white">{feedItems.length} Produtos no ar</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setShowPublishModal(true)}
              className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-950/30"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              Alavancar Produto no Feed
            </button>

            {!currentUser.hasTicket && (
              <button
                onClick={onOpenTicketCheckout}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2"
              >
                <span>Bilhete de Entrada: <strong>{ticketPrice.toLocaleString('pt-AO')} Kz</strong></span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produto, negócio ou província..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1">
              <Filter className="w-3.5 h-3.5" />
              Tipo:
            </span>
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'video', label: '🎬 Vídeos Virais' },
              { id: 'flyer', label: '🎨 Flyers' },
              { id: 'product_launch', label: '🛍️ Ofertas' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedType === t.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat === 'todos' ? '✨ Todas Categorias' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold">
            🛍️
          </div>
          <h3 className="text-base font-bold text-slate-800">Nenhuma publicação encontrada no filtro</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Seja o primeiro a publicar nesta categoria para impactar empreendedores e compradores de toda Angola!
          </p>
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" />
            Alavancar Novo Produto Agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isPlaying = activeVideoId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Creator Header Bar */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.creatorAvatarColor} text-white flex items-center justify-center font-black text-xs shadow-xs`}>
                        {item.creatorName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600 transition">
                            {item.creatorBusiness}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.creatorCity}</span>
                          <span className="text-slate-300">•</span>
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                        {item.type === 'video' ? '🎬 Vídeo' : item.type === 'flyer' ? '🎨 Flyer' : '🛍️ Oferta'}
                      </span>
                      {item.isCreatorBoosted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                          <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                          Boost Master
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Media Visual Block */}
                  <div className="relative bg-slate-950 text-white overflow-hidden aspect-[4/3] flex flex-col justify-between p-5">
                    {/* Background Pattern / Styling according to Theme */}
                    <div
                      className={`absolute inset-0 opacity-80 ${
                        item.mediaTheme === 'amber'
                          ? 'bg-gradient-to-br from-amber-900 via-stone-900 to-black'
                          : item.mediaTheme === 'rose'
                          ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-black'
                          : item.mediaTheme === 'emerald'
                          ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-black'
                          : item.mediaTheme === 'purple'
                          ? 'bg-gradient-to-br from-purple-950 via-indigo-950 to-black'
                          : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-black'
                      }`}
                    />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                        {item.badgeText}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/10 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {item.leverageDaysRemaining}d restantes
                      </span>
                    </div>

                    {/* Center Content: Video Preview or Flyer Layout */}
                    <div className="relative z-10 my-auto text-center space-y-2 py-2">
                      {item.type === 'video' ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => setActiveVideoId(isPlaying ? null : item.id)}
                            className="w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center mx-auto shadow-xl transition transform hover:scale-110 active:scale-95"
                          >
                            {isPlaying ? (
                              <Pause className="w-6 h-6 fill-slate-950" />
                            ) : (
                              <Play className="w-6 h-6 fill-slate-950 ml-1" />
                            )}
                          </button>
                          <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider flex items-center justify-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                            {isPlaying ? 'Reproduzindo Simulação Viral...' : 'Clique para Assistir Roteiro'}
                          </div>
                          {item.videoHook && (
                            <p className="text-xs font-semibold text-white/90 italic bg-black/60 p-2 rounded-xl backdrop-blur-xs max-w-xs mx-auto border border-white/10 line-clamp-2">
                              "{item.videoHook}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="inline-block px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-[10px] font-extrabold uppercase tracking-widest text-white/80">
                            {item.category}
                          </div>
                          <h4 className="text-lg font-black text-white leading-tight uppercase tracking-tight max-w-xs mx-auto drop-shadow-md">
                            {item.flyerHeadline || item.title}
                          </h4>
                          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-extrabold">
                            🔥 Alavancagem V.Ex Angola
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Media Bar: Price Pill */}
                    <div className="relative z-10 flex items-end justify-between pt-2 border-t border-white/10">
                      <div>
                        <div className="text-[10px] text-white/70 font-bold uppercase">Preço em Kwanzas</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-amber-300">
                            {item.priceKz.toLocaleString('pt-AO')} Kz
                          </span>
                          {item.originalPriceKz && (
                            <span className="text-xs text-white/50 line-through">
                              {item.originalPriceKz.toLocaleString('pt-AO')} Kz
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-white/80 font-bold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-white/60" />
                        <span>{item.viewsCount.toLocaleString('pt-AO')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="font-black text-sm text-slate-900 line-clamp-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Criador: <strong>{item.creatorName}</strong></span>
                      <button
                        onClick={() => setSelectedItemDetails(item)}
                        className="text-indigo-600 hover:text-indigo-800 font-extrabold text-[11px] flex items-center gap-0.5"
                      >
                        Ver Estratégia <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Direct WhatsApp & Interaction) */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Order via WhatsApp */}
                    <a
                      href={`https://wa.me/${item.creatorPhone}?text=${encodeURIComponent(
                        `Olá ${item.creatorBusiness}! Vi o seu produto "${item.title}" no Feed Global da V.Ex Visão Exclusiva e gostaria de encomendar!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      Pedir pelo WhatsApp
                    </a>

                    {/* Like / Impulsionar Button */}
                    <button
                      onClick={() => onLikeItem(item.id)}
                      className="py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                      <span>{item.likesCount} Apoios</span>
                    </button>

                    {/* Share / Partilhar Button */}
                    <button
                      onClick={() => onShareItem(item)}
                      className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{item.sharesCount} Partilhas</span>
                    </button>
                  </div>

                  {/* Creator Specific Boost Control */}
                  {isCreatorView && onBoostItemByCreator && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-bold">Ação Master:</span>
                      <button
                        onClick={() => onBoostItemByCreator(item.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition ${
                          item.isCreatorBoosted
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 hover:bg-amber-100 text-slate-700'
                        }`}
                      >
                        {item.isCreatorBoosted ? '⭐ Impulsionado pelo Criador' : '🚀 Dar Boost no Feed'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ALAVANCAR NOVO PRODUTO NO FEED GLOBAL */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Alavancagem Pública Cruzada
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Publicar Produto no Feed Global V.Ex
                </h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              O teu produto será divulgado para <strong>todos os usuários da plataforma em Angola</strong>, gerando cliques diretos no teu WhatsApp e visitas na tua BioLink!
            </p>

            <form onSubmit={handlePublishSubmit} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Nome do Produto / Campanha *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Combo X-Burguer Artesanal Duplo ou Vestido Seda Kilamba"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Formato de Divulgação
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="flyer">🎨 Flyer Promocional de Alto Impacto</option>
                    <option value="video">🎬 Vídeo Marketing Viral (Roteiro + Hook)</option>
                    <option value="product_launch">🛍️ Lançamento / Catálogo de Oferta</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Categoria do Negócio
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="Gastronomia & Restaurantes">Gastronomia & Restaurantes</option>
                    <option value="Moda, Roupas & Calçados">Moda, Roupas & Calçados</option>
                    <option value="Serviços Especializados">Serviços Especializados</option>
                    <option value="Beleza & Estética">Beleza & Estética</option>
                    <option value="Varejo & Eletrônicos">Varejo & Eletrônicos</option>
                  </select>
                </div>
              </div>

              {/* Pricing in Kwanzas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Preço de Venda em Kwanzas (Kz) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPriceKz}
                    onChange={(e) => setNewPriceKz(e.target.value)}
                    placeholder="Ex: 8500"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-black text-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Preço Original (opcional para exibir desconto)
                  </label>
                  <input
                    type="number"
                    value={newOriginalPriceKz}
                    onChange={(e) => setNewOriginalPriceKz(e.target.value)}
                    placeholder="Ex: 12000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Hook or Headline */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  {newType === 'video'
                    ? 'Frase de Gancho Viral (Hook nos primeiros 3 seg)'
                    : 'Frase de Manchete do Flyer'}
                </label>
                <input
                  type="text"
                  value={newHookOrHeadline}
                  onChange={(e) => setNewHookOrHeadline(e.target.value)}
                  placeholder={
                    newType === 'video'
                      ? 'Ex: Pára de rolar o feed agora! Se vives em Luanda precisas ver isto!'
                      : 'Ex: MEGA PROMOÇÃO RELÂMPAGO SÓ ATÉ SEXTA-FEIRA!'
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Descrição do Produto / Detalhes de Entrega
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descreva o que o cliente recebe, diferenciais, sabores, tamanhos e prazo de entrega em Luanda ou províncias..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              {/* Phone and Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    WhatsApp para Receber os Pedidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="244923456789"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Tempo de Circulação no Feed
                  </label>
                  <select
                    value={newDurationDays}
                    onChange={(e) => setNewDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value={7}>7 Dias de Alavancagem</option>
                    <option value={15}>15 Dias de Alavancagem (Recomendado)</option>
                    <option value={30}>30 Dias de Alavancagem Total</option>
                    <option value={60}>60 Dias de Dominação</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition shadow-md shadow-indigo-200 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Publicar no Feed Global
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES DA ESTRATÉGIA DE ALAVANCAGEM */}
      {selectedItemDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                  Ficha da Campanha de Alavancagem
                </span>
                <h3 className="text-base font-black text-slate-900">{selectedItemDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItemDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Empreendedor & Negócio:</div>
                <div className="font-extrabold text-slate-800">{selectedItemDetails.creatorBusiness} ({selectedItemDetails.creatorName})</div>
                <div className="text-slate-500 font-medium">{selectedItemDetails.creatorCity} • WhatsApp: +{selectedItemDetails.creatorPhone}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100">
                  <div className="text-[10px] text-indigo-600 font-bold">Visualizações</div>
                  <div className="font-black text-indigo-900 text-sm">{selectedItemDetails.viewsCount.toLocaleString('pt-AO')}</div>
                </div>
                <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-100">
                  <div className="text-[10px] text-rose-600 font-bold">Apoios</div>
                  <div className="font-black text-rose-900 text-sm">{selectedItemDetails.likesCount}</div>
                </div>
                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <div className="text-[10px] text-emerald-600 font-bold">Pedidos Whats</div>
                  <div className="font-black text-emerald-900 text-sm">{selectedItemDetails.ordersCount}</div>
                </div>
              </div>

              {selectedItemDetails.videoHook && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                  <div className="text-[10px] font-black uppercase text-amber-700 mb-1">Hook / Frase Viral:</div>
                  <p className="font-bold italic">"{selectedItemDetails.videoHook}"</p>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Estratégia de Conversão:</div>
                <p className="text-slate-700 leading-relaxed">
                  Os clientes que comentam no post recebem uma DM automática em 2 segundos contendo o link direto de pagamento ou botão de WhatsApp, fechando a venda sem atrito.
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`https://wa.me/${selectedItemDetails.creatorPhone}?text=${encodeURIComponent(
                  `Olá! Vi o produto ${selectedItemDetails.title} na V.Ex e quero encomendar!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition text-center flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                Conversar no WhatsApp
              </a>
              <button
                onClick={() => setSelectedItemDetails(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
