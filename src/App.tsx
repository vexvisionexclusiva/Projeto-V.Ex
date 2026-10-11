import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  TrendingUp,
  Video,
  Megaphone,
  Palette,
  Settings,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Calculator,
  Share2,
  DollarSign,
  Users,
  Store,
  Phone,
  Instagram,
  RefreshCw,
  Lightbulb,
  Check,
  Zap,
  Clock,
  Flame,
  ArrowRight,
  CreditCard,
  Link as LinkIcon,
  Smartphone,
  ShieldCheck,
  Receipt,
  Server,
  Terminal,
  Activity,
  Cpu,
  Database,
  Lock,
  Unlock,
  UserCheck,
  Globe,
  Radio,
  LogOut,
  LogIn,
  Mail,
  UserPlus,
  KeyRound,
  Ticket,
  Eye,
  Handshake,
  Download,
  Tag,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

import {
  PlatformUser,
  GlobalFeedItem,
  SubServerNode,
  BusinessProfile,
  CommentRule,
  LeadRecord,
  PaymentMethodType,
  PriceNegotiationRequest,
  GatewayConfig,
  validateAngolanNIF
} from './types';
import {
  INITIAL_USERS,
  INITIAL_FEED_ITEMS,
  INITIAL_SUBSERVERS,
  INITIAL_TICKET_PRICE_KZ,
  INITIAL_NEGOTIATIONS,
  INITIAL_GATEWAYS
} from './data/initialData';
import GlobalFeed from './components/GlobalFeed';
import CreatorMasterDashboard from './components/CreatorMasterDashboard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import PriceNegotiationModal from './components/PriceNegotiationModal';
import { PaymentGatewaysConfig } from './components/PaymentGatewaysConfig';
import { AutomationAnalyticsChart } from './components/AutomationAnalyticsChart';
import { FollowUpReminderScheduler } from './components/FollowUpReminderScheduler';
import { PushNotificationManager } from './components/PushNotificationManager';
import { useFcmPushNotifications } from './hooks/useFcmPushNotifications';
import { NicheProfitMarginDonutChart } from './components/NicheProfitMarginDonutChart';
import vexLogoImg from './assets/images/vex_logo_brand_1791716831010.jpg';

interface ProductIdea {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedMargin: string;
  suggestedPrice: string;
  targetAudience: string;
  strategy: string;
}

interface VideoScene {
  num: number;
  time: string;
  action: string;
  speech: string;
  textOnScreen: string;
}

interface VideoScript {
  title: string;
  hook: string;
  format: string;
  scenes: VideoScene[];
  cta: string;
  audio: string;
  caption: string;
}

interface AdCampaign {
  headline: string;
  primaryText: string;
  cta: string;
  platform: string;
  targeting: string;
  sellingPoints: string[];
}

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'client' | 'master_server'>('client');
  const [activeTab, setActiveTab] = useState<'feed' | 'pricing' | 'biolink' | 'automation' | 'expansion' | 'videos' | 'ads' | 'flyers' | 'settings' | 'gateways'>('feed');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toast Notification System (replaces window.alert)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Payment Gateways Configuration State (Multicaixa Express, PayPay, Unitel Money, Afrimoney)
  const [gateways, setGateways] = useState<GatewayConfig[]>(INITIAL_GATEWAYS);

  // Core Platform State
  const [ticketPrice, setTicketPrice] = useState<number>(INITIAL_TICKET_PRICE_KZ);
  const [feedItems, setFeedItems] = useState<GlobalFeedItem[]>(INITIAL_FEED_ITEMS);
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>(INITIAL_USERS);
  const [subServers, setSubServers] = useState<SubServerNode[]>(INITIAL_SUBSERVERS);
  const [negotiations, setNegotiations] = useState<PriceNegotiationRequest[]>(INITIAL_NEGOTIATIONS);

  // Current Authenticated User State
  const [currentUser, setCurrentUser] = useState<PlatformUser>(INITIAL_USERS[0]);

  // Price Negotiation Modal (50% in time/services)
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [negotiationTargetPrice, setNegotiationTargetPrice] = useState(49000);
  const [negotiationTargetTitle, setNegotiationTargetTitle] = useState('Plano de Alavancagem V.Ex');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPhone, setAuthPhone] = useState('923456789');
  const [authName, setAuthName] = useState('Novo Empreendedor');
  const [phoneOtpStep, setPhoneOtpStep] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState('');

  // Business Profile
  const [profile, setProfile] = useState<BusinessProfile>({
    name: 'Sabor & Arte Angola',
    niche: 'Gastronomia & Restaurantes',
    phone: '244923456789',
    instagram: 'saborarte_ao',
    city: 'Luanda, Angola',
    nif: '5417089123'
  });

  // Master Terminal State
  const [masterCommandInput, setMasterCommandInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[V.Ex MASTER SERVER] Sistema inicializado com sucesso em alta disponibilidade.',
    '[V.Ex CLUSTER] 5 subservidores conectados e sincronizados com latência média de 16ms.',
    '[V.Ex GATEWAY] Módulos Multicaixa Express, PayPay, Unitel Money e Afrimoney operacionais.',
    `[V.Ex TICKET] Bilhete padrão de entrada fixado em ${INITIAL_TICKET_PRICE_KZ.toLocaleString('pt-AO')} Kz.`,
    '[V.Ex PWA] Modo Mobile PWA ativo para dispositivos Android e iOS (iPhone / iPad).'
  ]);

  // Real-time App Screen Time Tracking (Ticks usage time for current user)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUser(prev => {
        const newMins = prev.usageTimeMinutesToday + 1;
        const newHours = prev.totalUsageHours + (1 / 60);
        return {
          ...prev,
          usageTimeMinutesToday: newMins,
          totalUsageHours: newHours,
          lastActive: 'Online Agora'
        };
      });

      setPlatformUsers(prev => prev.map(u => u.id === currentUser.id ? {
        ...u,
        usageTimeMinutesToday: u.usageTimeMinutesToday + 1,
        totalUsageHours: u.totalUsageHours + (1 / 60),
        lastActive: 'Online Agora'
      } : u));
    }, 60000);

    return () => clearInterval(timer);
  }, [currentUser.id]);

  // Comment rules with keyword triggers
  const [rules, setRules] = useState<CommentRule[]>([
    {
      id: '1',
      keyword: 'QUERO',
      publicReply: 'Olá! 🎉 Que maravilha ter o seu interesse! A V.Ex enviou os detalhes exclusivos no seu Direct 📩 Confere lá agora mesmo!',
      dmMessage: 'Olá! Vimos que comentou QUERO no nosso post! Clica aqui no link para falar direto comigo no WhatsApp e garantir o seu desconto exclusivo: ',
      isActive: true,
      matchCount: 42
    },
    {
      id: '2',
      keyword: 'PREÇO',
      publicReply: 'Tabela de preços em Kwanzas e cardápio especial enviados no seu Direct agora mesmo! ✨',
      dmMessage: 'Olá! Segue o link com todos os valores e opções disponíveis para pronta entrega em Luanda: ',
      isActive: true,
      matchCount: 68
    },
    {
      id: '3',
      keyword: 'CARDAPIO',
      publicReply: 'Cardápio fresquinho da semana enviado no seu direct! 🛵💨 Corre para conferir as novidades de hoje!',
      dmMessage: 'Aqui está nosso cardápio completo de hoje! Para pedir com entrega rápida na sua zona, é só clicar aqui: ',
      isActive: true,
      matchCount: 35
    },
    {
      id: '4',
      keyword: 'PROMO',
      publicReply: 'O seu cupom especial com desconto acabou de chegar no seu Direct! 🎁',
      dmMessage: 'O seu cupom exclusivo de desconto está liberado para usar hoje! Clica aqui para resgatar no WhatsApp: ',
      isActive: true,
      matchCount: 29
    }
  ]);

  // Leads Captados
  const [leads, setLeads] = useState<LeadRecord[]>([
    {
      id: '1',
      username: '@mariana_luanda',
      comment: 'Eu QUERO muito aproveitar essa alavancagem!',
      keyword: 'QUERO',
      timestamp: 'Há 5 minutos',
      status: 'Venda Fechada',
      phone: '923456789'
    },
    {
      id: '2',
      username: '@pedro_maianga',
      comment: 'Qual o PREÇO da caixa de doces em Kz?',
      keyword: 'PREÇO',
      timestamp: 'Há 18 minutos',
      status: 'Conversou no Whats',
      phone: '924551223'
    },
    {
      id: '3',
      username: '@beatriz_talatona',
      comment: 'Tem o CARDAPIO disponível para entrega?',
      keyword: 'CARDAPIO',
      timestamp: 'Há 40 minutos',
      status: 'DM Enviada',
      phone: '931223344'
    },
    {
      id: '4',
      username: '@carlos_kilamba',
      comment: 'Gostei muito da novidade! Vocês têm catálogo?',
      keyword: 'QUERO',
      timestamp: 'Há 1 hora',
      status: 'Conversou no Whats',
      phone: '942778899'
    },
    {
      id: '5',
      username: '@ana_viana',
      comment: 'Qual o desconto para pagamento por Multicaixa Express?',
      keyword: 'DESCONTO',
      timestamp: 'Há 2 horas',
      status: 'DM Enviada',
      phone: '928334455'
    },
    {
      id: '6',
      username: '@claudia_alvalade',
      comment: 'QUERO fazer o pedido de 2 caixas com entrega expressa!',
      keyword: 'QUERO',
      timestamp: 'Há 3 horas',
      status: 'Venda Fechada',
      phone: '935667788'
    }
  ]);

  // Firebase Cloud Messaging (FCM) Push Notifications Hook
  const fcm = useFcmPushNotifications(
    (newLead) => setLeads(prev => [newLead, ...prev]),
    showToast
  );

  // Export Leads to CSV for CRM and WhatsApp Broadcasting
  const exportLeadsCSV = () => {
    if (leads.length === 0) {
      showToast('Nenhum lead disponível para exportar no momento.', 'info');
      return;
    }

    const headers = [
      'ID',
      'Nome_Usuario',
      'Comentario_Publico',
      'Palavra_Chave_Gatilho',
      'Data_Hora_Captacao',
      'Status_Funil',
      'Telefone_WhatsApp',
      'Cidade_Provincia'
    ];

    const rows = leads.map(l => [
      l.id,
      l.username,
      `"${l.comment.replace(/"/g, '""')}"`,
      l.keyword,
      `"${l.timestamp}"`,
      l.status,
      `"+244 ${l.phone || profile.phone}"`,
      `"${profile.city}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_captados_vex_${profile.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Arquivo CSV com ${leads.length} leads exportado com sucesso para CRM e WhatsApp!`, 'success');
  };

  // Simulator state
  const [simInput, setSimInput] = useState('');
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<{
    reply: string;
    ruleMatched: CommentRule | null;
  } | null>(null);

  // Manual comments generator
  const [manualInput, setManualInput] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [manualVariants, setManualVariants] = useState<Array<{ style: string; text: string }>>([]);

  // New rule modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newPublicReply, setNewPublicReply] = useState('Olá! Acabei de te mandar todos os detalhes no Direct 📩 Confere lá!');
  const [newDmMessage, setNewDmMessage] = useState('Olá! Clica aqui para falar direto comigo no WhatsApp: ');

  // Expansion ideas
  const [expansionGoal, setExpansionGoal] = useState('Aumentar ticket médio e criar produtos para final de semana');
  const [expansionLoading, setExpansionLoading] = useState(false);
  const [ideas, setIdeas] = useState<ProductIdea[]>([
    {
      id: '1',
      title: 'Kit Degustação & Presente de Final de Semana',
      category: 'Combo de Alto Ticket',
      description: 'Caixa premium combinando os 4 itens mais vendidos com embalagem presenteável e laço artesanal.',
      estimatedMargin: '68%',
      suggestedPrice: '45.000 Kz',
      targetAudience: 'Famílias e casais que querem um mimo especial para o fim de semana',
      strategy: 'Abrir lista VIP na quinta-feira via Stories com palavra-chave QUERO.'
    },
    {
      id: '2',
      title: 'Pote Take-Away do Tempero / Molho Secreto da Casa',
      category: 'Produto de Prateleira',
      description: 'Potes de 250g do recheio mais famoso para o cliente levar para casa ou acrescentar no pedido.',
      estimatedMargin: '74%',
      suggestedPrice: '12.500 Kz',
      targetAudience: 'Clientes recorrentes apaixonados pelo sabor exclusivo',
      strategy: 'Oferecer como adicional no checkout do WhatsApp.'
    },
    {
      id: '3',
      title: 'Clube de Assinatura Mensal (Fidelidade VIP)',
      category: 'Receita Recorrente',
      description: 'Plano com 1 entrega especial programada a cada 15 dias com frete grátis e mimo surpresa.',
      estimatedMargin: '62%',
      suggestedPrice: '65.000 Kz / mês',
      targetAudience: 'Clientes corporativos e moradores fiéis da zona',
      strategy: 'Lançar apenas 25 vagas de fundadores para gerar escassez imediata.'
    }
  ]);

  // Margin Calculator state
  const [calcCost, setCalcCost] = useState('12000');
  const [calcPrice, setCalcPrice] = useState('35000');
  const [calcUnits, setCalcUnits] = useState('30');
  const costNum = parseFloat(calcCost) || 0;
  const priceNum = parseFloat(calcPrice) || 0;
  const unitsNum = parseInt(calcUnits) || 0;
  const profitUnit = Math.max(0, priceNum - costNum);
  const marginPct = priceNum > 0 ? Math.round((profitUnit / priceNum) * 100) : 0;
  const totalProfit = profitUnit * unitsNum;

  // Video script state
  const [videoProduct, setVideoProduct] = useState('Combo Especial Família');
  const [videoLoading, setVideoLoading] = useState(false);
  const [currentScript, setCurrentScript] = useState<VideoScript>({
    title: 'Roteiro Viral: O Segredo de Luanda',
    hook: 'Pára de rolar o feed agora! Se vives em Luanda, precisas de ver isto!',
    format: 'Reels / TikTok (9:16)',
    scenes: [
      {
        num: 1,
        time: '0 a 3s',
        action: 'Câmera bem próxima mostrando o produto em detalhe com iluminação natural.',
        speech: 'Tu também achavas que não dava para encontrar isso na nossa cidade com essa qualidade?',
        textOnScreen: 'Precisas de ver isso! 😱'
      },
      {
        num: 2,
        time: '3 a 9s',
        action: 'Mostrando a dor do cliente (dificuldade de achar produtos frescos e com preço justo).',
        speech: 'A maioria das pessoas cansa de pedir e receber algo que demora horas ou não tem o sabor prometido...',
        textOnScreen: 'Cansado de passar por isso?'
      },
      {
        num: 3,
        time: '9 a 20s',
        action: 'Abrindo o combo com fumaça e textura impecável, cortando e mostrando a maciez.',
        speech: 'Por isso nós criámos essa versão especial feita na hora com carinho total e entrega rápida.',
        textOnScreen: 'Feito na hora especialmente para ti ✨'
      },
      {
        num: 4,
        time: '20 a 25s',
        action: 'Apontando para a parte de baixo da tela sorrindo e segurando a embalagem.',
        speech: 'Comenta a palavra QUERO aqui em baixo que te envio o link de desconto no Direct!',
        textOnScreen: 'Comenta "QUERO" agora 👇'
      }
    ],
    cta: 'Comenta a palavra "QUERO" aqui nos comentários para receber o link exclusivo no Direct em segundos!',
    audio: 'Kizomba acústica moderna ou Pop instrumental em alta',
    caption: `À procura da melhor experiência em ${profile.city}? ✨\n\nPreparamos tudo com receita exclusiva e ingredientes selecionados para transformar o seu dia!\n\n👇 CONDIÇÃO EXCLUSIVA:\nComenta "QUERO" que o nosso assistente inteligente te envia o link direto no Direct em segundos!\n\n#VExVisãoExclusiva #${profile.name.replace(/\s+/g, '').toLowerCase()} #luanda #angola #promocao`
  });

  // Ads state
  const [adOffer, setAdOffer] = useState('Combo Família com entrega grátis em Luanda');
  const [adPlatform, setAdPlatform] = useState('Meta Ads (Instagram & Facebook)');
  const [adLoading, setAdLoading] = useState(false);
  const [currentAd, setCurrentAd] = useState<AdCampaign>({
    headline: 'O melhor sabor da cidade com condição especial hoje!',
    primaryText: `Procuras uma experiência de alta qualidade em ${profile.city} sem pagar preços abusivos?\n\nNa ${profile.name}, entregamos produtos fresquinhos e feitos com amor direto na tua porta.\n\n✅ Ingredientes de primeira qualidade\n✅ Entrega rápida na tua zona\n✅ Atendimento humanizado direto no WhatsApp`,
    cta: 'Conversar no WhatsApp',
    platform: 'Meta Ads',
    targeting: `Homens e Mulheres (22 a 52 anos) em ${profile.city} (Talatona, Maianga, Ingombota, Kilamba). Interesses: Compras locais, Gastronomia e Promoções.`,
    sellingPoints: [
      'Atendimento direto e imediato com o proprietário',
      'Preço justo em Kwanzas sem intermediários',
      'Embalagem segura e entrega expressa'
    ]
  });

  // Flyer state
  const [flyerTheme, setFlyerTheme] = useState<'indigo' | 'emerald' | 'coral' | 'dark'>('indigo');
  const [flyerHeadline, setFlyerHeadline] = useState('SUPER OFERTA RELÂMPAGO');
  const [flyerSub, setFlyerSub] = useState('Válido apenas hoje enquanto durarem os estoques!');
  const [flyerBadge, setFlyerBadge] = useState('DESCONTO ESPECIAL');
  const [flyerCta, setFlyerCta] = useState('Comenta "QUERO" no post para receber o link no Direct!');

  // ==========================================
  // PRICING & LEVERAGE CALCULATOR (ALAVANCAGEM)
  // ==========================================
  const [selectedDuration, setSelectedDuration] = useState<7 | 15 | 30 | 60>(15);
  const [selectedProductType, setSelectedProductType] = useState('Gastronomia & Delivery');
  const [selectedProductQty, setSelectedProductQty] = useState<1 | 3 | 5 | 10>(3);
  
  // Base duration costs in Kwanzas (Kz)
  const durationBasePrice: Record<number, number> = {
    7: 28000,
    15: 49000,
    30: 85000,
    60: 145000
  };

  // Product quantity multiplier
  const qtyMultiplier: Record<number, number> = {
    1: 1.0,
    3: 1.25,
    5: 1.45,
    10: 1.8
  };

  // Product type complexity factor
  const productTypeFactor: Record<string, number> = {
    'Gastronomia & Delivery': 1.0,
    'Moda, Roupas & Calçados': 1.1,
    'Beleza & Estética': 1.15,
    'Serviços Especializados': 1.2,
    'Varejo & Eletrônicos': 1.15,
    'Infoprodutos & Cursos': 1.25
  };

  const calculatedLeveragePrice = Math.round(
    durationBasePrice[selectedDuration] *
    qtyMultiplier[selectedProductQty] *
    (productTypeFactor[selectedProductType] || 1.0)
  );

  // BioLink Lifetime (Pagamento Único) - Atualizado para 5.000 Kz
  const biolinkLifetimePrice = 5000; // 5.000 Kz Pagamento Único

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutItemTitle, setCheckoutItemTitle] = useState('');
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [isLifetimeBiolink, setIsLifetimeBiolink] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('mcx');
  
  // Checkout inputs for Angolan Gateways
  const [payerPhone, setPayerPhone] = useState('923456789');
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [generatedReference, setGeneratedReference] = useState<{ entity: string; reference: string; amount: number } | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run Comment Simulation
  const runSimulation = () => {
    if (!simInput.trim()) return;
    setSimLoading(true);
    setSimResult(null);

    setTimeout(() => {
      const upper = simInput.toUpperCase();
      const matched = rules.find(r => r.isActive && upper.includes(r.keyword.toUpperCase())) || null;

      let reply = '';
      if (matched) {
        reply = matched.publicReply;
        // add lead
        const newLead: LeadRecord = {
          id: Date.now().toString(),
          username: '@cliente_' + Math.floor(Math.random() * 900 + 100),
          comment: simInput,
          keyword: matched.keyword,
          timestamp: 'Agora mesmo',
          status: 'DM Enviada'
        };
        setLeads(prev => [newLead, ...prev]);
        setRules(prev => prev.map(r => r.id === matched.id ? { ...r, matchCount: r.matchCount + 1 } : r));

        // Dispatch FCM Push Notification (even in background)
        fcm.sendPushNotification(
          '🔥 Novo Lead Captado via V.Ex!',
          `${newLead.username} comentou "${matched.keyword}" e já recebeu o link e oferta no Direct!`,
          { leadId: newLead.id }
        );
      } else if (upper.includes('ENTREGA') || upper.includes('FRETE')) {
        reply = `Entregamos em toda a província de ${profile.city}! 🛵 Te mandamos as taxas e prazos no seu Direct!`;
        fcm.sendPushNotification(
          '🛵 Dúvida de Entrega Respondida!',
          `Cliente em ${profile.city} perguntou sobre taxas e a V.Ex respondeu no Direct!`
        );
      } else if (upper.includes('ONDE') || upper.includes('LOCAL')) {
        reply = `Estamos em ${profile.city}! 📍 Enviamos a nossa localização exata no Direct!`;
        fcm.sendPushNotification(
          '📍 Localização Solicitada!',
          `Cliente solicitou endereço de ${profile.city} e o link foi enviado!`
        );
      } else {
        reply = 'Olá! Que maravilha ter você por aqui ✨ A V.Ex enviou uma mensagem especial no Direct para tirar todas as dúvidas!';
        fcm.sendPushNotification(
          '💬 Comentário Automatizado Respondido!',
          `Comentário: "${simInput.slice(0, 35)}..." respondido pela inteligência V.Ex!`
        );
      }

      setSimResult({ reply, ruleMatched: matched });
      setSimLoading(false);
    }, 600);
  };

  // Run Manual variants generator
  const runManualGen = () => {
    if (!manualInput.trim()) return;
    setManualLoading(true);
    setTimeout(() => {
      setManualVariants([
        {
          style: 'Comercial & Fechamento Rápido',
          text: `Olá! Temos uma condição especial liberada em Kwanzas só hoje 🔥 Acabei de te enviar o link com desconto exclusivo no Direct! Dá uma olhada e garante antes que esgote!`
        },
        {
          style: 'Empática & Conexão Afetuosa',
          text: `Que carinho enorme ter você por aqui! 🥰 Preparamos tudo com o maior amor do mundo. Já te mandei todos os detalhes e o cardápio no seu Direct. Qualquer dúvida me chama lá!`
        },
        {
          style: 'Direta ao Ponto & Prática',
          text: `Olá! Te mandamos a tabela completa e o link de pedido no Direct agora mesmo 📩 É só clicar para garantir!`
        }
      ]);
      setManualLoading(false);
    }, 600);
  };

  // Run New expansion ideas
  const runExpansionGen = () => {
    setExpansionLoading(true);
    setTimeout(() => {
      setIdeas([
        {
          id: Date.now().toString(),
          title: 'Combo Família / Galera de Final de Semana',
          category: 'Aumento de Ticket Médio',
          description: 'Agrupamento dos seus itens favoritos em porção para 3 a 4 pessoas com 1 sobremesa especial cortesia.',
          estimatedMargin: '65%',
          suggestedPrice: '48.000 Kz',
          targetAudience: 'Famílias reunidas nos almoços de domingo e encontros de sexta à noite',
          strategy: 'Lançar campanha nos Stories na quinta com palavra-chave COMBO.'
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Linha Corporativa para Empresas & Eventos em Luanda',
          category: 'Venda B2B Recorrente',
          description: 'Kits montados para coffee breaks empresariais e aniversários com faturamento direto.',
          estimatedMargin: '72%',
          suggestedPrice: '120.000 Kz a 280.000 Kz',
          targetAudience: 'Empresas em Talatona/Luanda e comissões de formatura',
          strategy: 'Prospecção via WhatsApp com catálogo em PDF e degustação.'
        },
        {
          id: (Date.now() + 2).toString(),
          title: 'Cartão Presente Digital (Gift Card VIP)',
          category: 'Receita Antecipada',
          description: 'Vales-presente digitais de 20.000 Kz, 50.000 Kz para presentear amigos.',
          estimatedMargin: '100% antecipado',
          suggestedPrice: '20.000 Kz a 50.000 Kz',
          targetAudience: 'Pessoas procurando presente criativo de última hora',
          strategy: 'Divulgação nas datas comemorativas com disparo de DM.'
        }
      ]);
      setExpansionLoading(false);
    }, 700);
  };

  const getWaLink = (keyword: string) => {
    return `https://wa.me/${profile.phone}?text=Ol%C3%A1!+Comentei+${keyword}+no+post+e+quero+aproveitar+a+oferta!`;
  };

  // Open Checkout for Leverage Plan
  const startLeverageCheckout = () => {
    setCheckoutItemTitle(`Plano de Alavancagem (${selectedDuration} Dias) - ${selectedProductQty} Produto(s) [${selectedProductType}]`);
    setCheckoutAmount(calculatedLeveragePrice);
    setIsLifetimeBiolink(false);
    setPaymentStep('form');
    setShowCheckoutModal(true);
  };

  // Open Checkout for Bilhete de Entrada (5.000 Kz inicial)
  const startTicketCheckout = () => {
    setCheckoutItemTitle(`Bilhete Oficial de Entrada V.Ex (${ticketPrice.toLocaleString('pt-AO')} Kz)`);
    setCheckoutAmount(ticketPrice);
    setIsLifetimeBiolink(false);
    setPaymentStep('form');
    setShowCheckoutModal(true);
  };

  // Open Checkout for BioLink (Pagamento Único)
  const startBioLinkCheckout = () => {
    setCheckoutItemTitle('BioLink Pro Vitalícia (Página Interativa + Catálogo de Produtos)');
    setCheckoutAmount(biolinkLifetimePrice);
    setIsLifetimeBiolink(true);
    setPaymentStep('form');
    setShowCheckoutModal(true);
  };

  // Validate Gateway Credentials Handlers
  const validateGateway = async (gatewayId: PaymentMethodType): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600));

    const gateway = gateways.find(g => g.id === gatewayId);
    if (!gateway) return false;

    let isValid = false;
    let validationMessage = '';
    const creds = gateway.credentials;

    switch (gatewayId) {
      case 'mcx': {
        const entity = creds.mcxEntityCode?.trim() || '';
        const key = creds.mcxApiKey?.trim() || '';
        if (!/^\d{5}$/.test(entity)) {
          validationMessage = 'Erro: Código de Entidade EMIS inválido. Deve conter exatamente 5 dígitos numéricos (ex: 00542).';
        } else if (key.length < 10) {
          validationMessage = 'Erro: Chave Secreta de API muito curta. Deve conter pelo menos 10 caracteres alfanuméricos.';
        } else {
          isValid = true;
          validationMessage = 'Handshake EMIS GPO OK (HTTP 200). Chaves verificadas com a rede interbancária Multicaixa.';
        }
        break;
      }
      case 'paypay': {
        const merchant = creds.paypayMerchantId?.trim() || '';
        const key = creds.paypayApiKey?.trim() || '';
        const phone = creds.paypayReceiverPhone?.trim().replace(/\s+/g, '') || '';
        if (merchant.length < 4) {
          validationMessage = 'Erro: ID do Comerciante PayPay inválido. Insira o código da sua conta empresarial.';
        } else if (key.length < 8) {
          validationMessage = 'Erro: Token Secreto PayPay inválido. Mínimo de 8 caracteres.';
        } else if (!/^9\d{8}$/.test(phone) && !/^\+2449\d{8}$/.test(phone)) {
          validationMessage = 'Erro: Telemóvel receptor deve ser um número angolano válido (9 dígitos, ex: 924551223).';
        } else {
          isValid = true;
          validationMessage = 'Conexão com API PayPay África confirmada. Carteira do comerciante validada.';
        }
        break;
      }
      case 'unitel': {
        const code = creds.unitelMerchantCode?.trim() || '';
        const key = creds.unitelApiKey?.trim() || '';
        const agent = creds.unitelAgentNumber?.trim().replace(/\s+/g, '') || '';
        if (!/^\d{4,8}$/.test(code)) {
          validationMessage = 'Erro: Código de Comerciante Unitel deve ter entre 4 e 8 dígitos (ex: 449012).';
        } else if (key.length < 8) {
          validationMessage = 'Erro: Partner Secret Unitel Money inválido (mínimo 8 caracteres).';
        } else if (!/^9\d{8}$/.test(agent) && !/^\+2449\d{8}$/.test(agent)) {
          validationMessage = 'Erro: Número de Agente Unitel deve ser um terminal válido (ex: 923112233).';
        } else {
          isValid = true;
          validationMessage = 'Canal USSD *449# B2B conectado com sucesso. PIN de serviço pronto para autorização.';
        }
        break;
      }
      case 'afrimoney': {
        const merchant = creds.afrimoneyMerchantId?.trim() || '';
        const key = creds.afrimoneyApiKey?.trim() || '';
        const pin = creds.afrimoneyTerminalPin?.trim() || '';
        if (merchant.length < 3) {
          validationMessage = 'Erro: ID do Comerciante Afrimoney inválido ou não informado.';
        } else if (key.length < 8) {
          validationMessage = 'Erro: Chave Secreta HMAC Afrimoney muito curta (mínimo 8 caracteres).';
        } else if (!/^\d{4,6}$/.test(pin)) {
          validationMessage = 'Erro: PIN Operacional do Terminal deve conter de 4 a 6 dígitos numéricos.';
        } else {
          isValid = true;
          validationMessage = 'Autenticação Africell Afrimoney Open API autorizada. Canal de transações liberado.';
        }
        break;
      }
    }

    const nowStr = `Hoje às ${new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}`;
    setGateways(prev => prev.map(g => (g.id === gatewayId ? {
      ...g,
      status: isValid ? 'valid' : 'invalid',
      lastValidatedAt: nowStr,
      validationMessage
    } : g)));

    return isValid;
  };

  const fillSandboxCredentials = (gatewayId: PaymentMethodType) => {
    const sandboxPresets: Record<PaymentMethodType, any> = {
      mcx: {
        mcxEntityCode: '00542',
        mcxSubEntity: '999',
        mcxApiKey: 'mcx_live_sec_emis_894372948123',
        mcxTerminalId: 'TERM-LUA-01'
      },
      paypay: {
        paypayMerchantId: 'PPAY-AO-884219',
        paypayApiKey: 'ppay_sec_key_771928304912',
        paypayReceiverPhone: '924551223'
      },
      unitel: {
        unitelMerchantCode: '449012',
        unitelApiKey: 'unt_money_partner_9921820491',
        unitelAgentNumber: '923112233'
      },
      afrimoney: {
        afrimoneyMerchantId: 'AFR-AO-950122',
        afrimoneyApiKey: 'afri_sec_live_99812401',
        afrimoneyTerminalPin: '8842'
      }
    };

    setGateways(prev => prev.map(g => {
      if (g.id === gatewayId) {
        return {
          ...g,
          enabled: true,
          mode: 'test',
          status: 'valid',
          lastValidatedAt: 'Agora mesmo',
          validationMessage: 'Credenciais Sandbox V.Ex preenchidas e validadas com sucesso.',
          credentials: sandboxPresets[gatewayId]
        };
      }
      return g;
    }));

    showToast(`Credenciais de Sandbox para ${gatewayId.toUpperCase()} aplicadas e validadas com sucesso!`, 'success');
  };

  // Process payment simulation with gateway validation enforcement
  const handleProcessPayment = () => {
    const targetGateway = gateways.find(g => g.id === selectedPaymentMethod);

    // BLOCK CHECKOUT IF GATEWAY IS NOT VALID OR NOT ENABLED
    if (!targetGateway || !targetGateway.enabled || targetGateway.status !== 'valid') {
      showToast(
        `Checkout Bloqueado: O gateway ${targetGateway?.name || selectedPaymentMethod.toUpperCase()} não possui credenciais validadas. Configure e valide as chaves de API primeiro na tela de Gateways.`,
        'error'
      );
      return;
    }

    setPaymentStep('processing');
    setTimeout(() => {
      let entityCode = '00542';
      let refCode = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;

      if (selectedPaymentMethod === 'mcx') {
        entityCode = targetGateway.credentials.mcxEntityCode || '00542';
      } else if (selectedPaymentMethod === 'paypay') {
        entityCode = 'PAYPAY-AO';
        refCode = `PP-${Math.floor(100000 + Math.random() * 900000)}`;
      } else if (selectedPaymentMethod === 'unitel') {
        entityCode = targetGateway.credentials.unitelMerchantCode || '449012';
        refCode = `*449*${Math.floor(1000 + Math.random() * 9000)}#`;
      } else if (selectedPaymentMethod === 'afrimoney') {
        entityCode = targetGateway.credentials.afrimoneyMerchantId || 'AFR-950';
        refCode = `AFR-${Math.floor(100000 + Math.random() * 900000)}`;
      }

      setGeneratedReference({
        entity: entityCode,
        reference: refCode,
        amount: checkoutAmount
      });
      setPaymentStep('success');

      // Check if ticket payment
      if (checkoutAmount === ticketPrice || checkoutItemTitle.includes('Bilhete')) {
        setCurrentUser(prev => ({
          ...prev,
          hasTicket: true,
          ticketPricePaidKz: ticketPrice,
          planStatus: 'Bilhete 5.000 Kz Ativo',
          totalSpentKz: prev.totalSpentKz + checkoutAmount,
          activities: [
            {
              id: `act_${Date.now()}`,
              timestamp: 'Agora mesmo',
              action: 'Compra de Bilhete',
              details: `Comprou Bilhete de ${ticketPrice.toLocaleString('pt-AO')} Kz via ${selectedPaymentMethod.toUpperCase()} (Gateway Validado)`,
              type: 'ticket'
            },
            ...prev.activities
          ]
        }));

        setPlatformUsers(prev => prev.map(u => u.id === currentUser.id ? {
          ...u,
          hasTicket: true,
          ticketPricePaidKz: ticketPrice,
          planStatus: 'Bilhete 5.000 Kz Ativo',
          totalSpentKz: u.totalSpentKz + checkoutAmount
        } : u));
      }

      // Register payment in master server logs
      setTerminalLogs(prev => [
        `[PAGAMENTO AUTORIZADO - GATEWAY VALIDADO] ${checkoutAmount.toLocaleString('pt-AO')} Kz via ${targetGateway.name.toUpperCase()} (Entidade/Terminal: ${entityCode}) para "${checkoutItemTitle}"`,
        ...prev
      ]);

      showToast(`Pagamento de ${checkoutAmount.toLocaleString('pt-AO')} Kz gerado com sucesso via ${targetGateway.name}!`, 'success');
    }, 1200);
  };

  // Feed Global Handlers
  const handleLikeFeedItem = (id: string) => {
    setFeedItems(prev => prev.map(item => item.id === id ? { ...item, likesCount: item.likesCount + 1 } : item));
  };

  const handleShareFeedItem = (item: GlobalFeedItem) => {
    setFeedItems(prev => prev.map(it => it.id === item.id ? { ...it, sharesCount: it.sharesCount + 1 } : it));
    navigator.clipboard?.writeText(window.location.href);
    showToast(`🔗 Link do produto "${item.title}" copiado com sucesso!`, 'info');
  };

  const handlePublishToFeed = (newItem: Omit<GlobalFeedItem, 'id' | 'likesCount' | 'sharesCount' | 'viewsCount' | 'ordersCount' | 'createdAt'>) => {
    const feedItem: GlobalFeedItem = {
      ...newItem,
      id: `feed_${Date.now()}`,
      likesCount: 1,
      sharesCount: 0,
      viewsCount: 1,
      ordersCount: 0,
      createdAt: 'Agora mesmo'
    };

    setFeedItems(prev => [feedItem, ...prev]);

    const levItem = {
      id: `lev_${Date.now()}`,
      title: feedItem.title,
      type: feedItem.type,
      category: feedItem.category,
      priceKz: feedItem.priceKz,
      status: 'Ativo' as const,
      viewsCount: 1,
      clicksCount: 0,
      ordersCount: 0,
      createdAt: 'Hoje',
      headline: feedItem.flyerHeadline || feedItem.videoHook
    };

    const newActivity = {
      id: `act_${Date.now()}`,
      timestamp: 'Agora mesmo',
      action: 'Publicação no Feed Global',
      details: `Publicou "${feedItem.title}" no Feed Global para toda Angola`,
      type: 'feed' as const
    };

    setCurrentUser(prev => ({
      ...prev,
      leveragedItems: [levItem, ...prev.leveragedItems],
      activities: [newActivity, ...prev.activities]
    }));

    setPlatformUsers(prev => prev.map(u => u.id === currentUser.id ? {
      ...u,
      leveragedItems: [levItem, ...u.leveragedItems],
      activities: [newActivity, ...u.activities]
    } : u));

    setTerminalLogs(prev => [
      `[FEED GLOBAL] Novo produto alavancado por ${currentUser.name}: "${feedItem.title}" (${feedItem.priceKz.toLocaleString('pt-AO')} Kz).`,
      ...prev
    ]);
  };

  const handleBoostFeedItem = (id: string) => {
    setFeedItems(prev => prev.map(it => it.id === id ? { ...it, isCreatorBoosted: !it.isCreatorBoosted } : it));
  };

  // Creator Master Dashboard Handlers
  const handleUpdateTicketPrice = (newPrice: number) => {
    setTicketPrice(newPrice);
    setTerminalLogs(prev => [
      `[TICKET UPDATE] Criador alterou o preço do bilhete para ${newPrice.toLocaleString('pt-AO')} Kz.`,
      ...prev
    ]);
  };

  const handleToggleBlockUser = (userId: string) => {
    setPlatformUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      planStatus: u.planStatus === 'Bloqueado' ? 'Alavancagem Ativa' : 'Bloqueado'
    } : u));
  };

  const handleToggleGrantTicket = (userId: string) => {
    setPlatformUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      hasTicket: !u.hasTicket,
      planStatus: !u.hasTicket ? 'Bilhete 5.000 Kz Ativo' : 'Gratuito'
    } : u));
  };

  const handleBoostUserProducts = (userId: string) => {
    setFeedItems(prev => prev.map(it => it.creatorId === userId ? { ...it, isCreatorBoosted: true } : it));
    showToast('⭐ Campanhas deste empreendedor impulsionadas no Feed Global!', 'success');
  };

  const handleUpdateNegotiationStatus = (id: string, newStatus: PriceNegotiationRequest['status'], note?: string) => {
    setNegotiations(prev => prev.map(n => n.id === id ? { ...n, status: newStatus, ownerNotes: note || n.ownerNotes } : n));
    setTerminalLogs(prev => [
      `[NEGOCIAÇÃO 50%] Proposta atualizada para "${newStatus}" pelo Dono.`,
      ...prev
    ]);
  };

  const handleSubmitProposal = (prop: Omit<PriceNegotiationRequest, 'id' | 'createdAt'>) => {
    const newNeg: PriceNegotiationRequest = {
      ...prop,
      id: `neg_${Date.now()}`,
      createdAt: 'Hoje, agora mesmo'
    };
    setNegotiations(prev => [newNeg, ...prev]);
    setTerminalLogs(prev => [
      `[NOVA PROPOSTA 50%] ${prop.userName} propôs pagar 50% em Kz (${prop.offeredCashKz.toLocaleString('pt-AO')} Kz) e 50% em serviços de tempo!`,
      ...prev
    ]);
  };

  // Master server command execution
  const executeMasterCommand = () => {
    if (!masterCommandInput.trim()) return;
    const cmd = masterCommandInput.trim();
    const newLog = `> ${cmd}`;
    let response = '';

    if (cmd.startsWith('cluster:restart')) {
      response = '[CLUSTER] Reiniciando nós de subservidores... Todos os 5 nós responderam com ACK 200.';
    } else if (cmd.startsWith('ai:scale')) {
      response = '[IA WORKER] Capacidade de resposta de comentários escalada para 120 workers.';
    } else if (cmd.startsWith('payments:sync')) {
      response = '[GATEWAY] Reconciliação com EMIS Multicaixa e Unitel Money finalizada. 0 pendências.';
    } else if (cmd.startsWith('users:list')) {
      response = `[USERS] Total de clientes ativos: ${platformUsers.length} | Faturamento: ${platformUsers.reduce((acc, u) => acc + u.totalSpentKz, 0).toLocaleString('pt-AO')} Kz.`;
    } else {
      response = `[MASTER EXEC] Comando "${cmd}" despachado para todos os subservidores conectados.`;
    }

    setTerminalLogs(prev => [response, newLog, ...prev]);
    setMasterCommandInput('');
  };

  // Social Auth Handlers
  const handleSocialAuth = (provider: 'google' | 'facebook' | 'twitter') => {
    const providerNames = {
      google: 'Google Account (Gmail)',
      facebook: 'Facebook ID',
      twitter: 'X / Twitter (@user)'
    };
    const newUser: PlatformUser = {
      id: `usr_${Date.now()}`,
      name: `${profile.name} (${provider.toUpperCase()})`,
      identifier: provider === 'google' ? 'cliente@gmail.com' : provider === 'facebook' ? 'fb.user.angola' : '@usuario_x',
      authProvider: provider,
      businessName: profile.name,
      city: profile.city,
      phone: profile.phone,
      role: 'business_owner',
      planStatus: 'Alavancagem Ativa',
      hasTicket: true,
      ticketPricePaidKz: ticketPrice,
      joinedDate: 'Hoje',
      totalSpentKz: 0,
      isOnline: true,
      usageTimeMinutesToday: 5,
      totalUsageHours: 0.1,
      lastActive: 'Online Agora',
      leveragedItems: [],
      activities: [
        {
          id: `act_${Date.now()}`,
          timestamp: 'Agora mesmo',
          action: 'Login Social',
          details: `Autenticado com sucesso via ${providerNames[provider]}`,
          type: 'auth'
        }
      ]
    };
    setCurrentUser(newUser);
    setPlatformUsers(prev => [newUser, ...prev]);
    setShowAuthModal(false);
    showToast(`Conta autenticada com sucesso via ${providerNames[provider]}!`, 'success');
  };

  const handlePhoneAuth = () => {
    if (!phoneOtpStep) {
      setPhoneOtpStep(true);
    } else {
      const newUser: PlatformUser = {
        id: `usr_${Date.now()}`,
        name: authName || 'Empreendedor Angola',
        identifier: `+244 ${authPhone}`,
        authProvider: 'phone',
        businessName: profile.name,
        city: profile.city,
        phone: `+244 ${authPhone}`,
        role: 'business_owner',
        planStatus: 'Alavancagem Ativa',
        hasTicket: true,
        ticketPricePaidKz: ticketPrice,
        joinedDate: 'Hoje',
        totalSpentKz: 0,
        isOnline: true,
        usageTimeMinutesToday: 5,
        totalUsageHours: 0.1,
        lastActive: 'Online Agora',
        leveragedItems: [],
        activities: [
          {
            id: `act_${Date.now()}`,
            timestamp: 'Agora mesmo',
            action: 'Login por Telemóvel OTP',
            details: `Verificação de código SMS concluída no número +244 ${authPhone}`,
            type: 'auth'
          }
        ]
      };
      setCurrentUser(newUser);
      setPlatformUsers(prev => [newUser, ...prev]);
      setPhoneOtpStep(false);
      setShowAuthModal(false);
      showToast(`Telemóvel +244 ${authPhone} verificado com sucesso!`, 'success');
    }
  };

  const handleEmailAuth = () => {
    if (!authEmail.trim()) return;
    const newUser: PlatformUser = {
      id: `usr_${Date.now()}`,
      name: authName || authEmail.split('@')[0],
      identifier: authEmail,
      authProvider: 'email',
      businessName: profile.name,
      city: profile.city,
      phone: profile.phone,
      role: 'business_owner',
      planStatus: 'Alavancagem Ativa',
      hasTicket: true,
      ticketPricePaidKz: ticketPrice,
      joinedDate: 'Hoje',
      totalSpentKz: 0,
      isOnline: true,
      usageTimeMinutesToday: 5,
      totalUsageHours: 0.1,
      lastActive: 'Online Agora',
      leveragedItems: [],
      activities: [
        {
          id: `act_${Date.now()}`,
          timestamp: 'Agora mesmo',
          action: 'Login com E-mail',
          details: `Acesso realizado com ${authEmail}`,
          type: 'auth'
        }
      ]
    };
    setCurrentUser(newUser);
    setPlatformUsers(prev => [newUser, ...prev]);
    setShowAuthModal(false);
    showToast(`Bem-vindo à V.Ex Visão Exclusiva, ${newUser.name}!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between pb-16 sm:pb-0">
      <div>
        {/* PWA Mobile Banner for Android and iOS */}
        <PWAInstallPrompt />

        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo V.Ex Visão Exclusiva */}
            <div className="flex items-center gap-3">
              <div className="relative group shrink-0">
                <img
                  src={vexLogoImg}
                  alt="V.Ex Visão Exclusiva"
                  className="w-10 h-10 rounded-xl object-cover shadow-md shadow-indigo-950/20 border border-amber-400/40 ring-2 ring-indigo-500/20"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight bg-gradient-to-r from-indigo-800 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
                    V.Ex Visão Exclusiva
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Servidor Operacional
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  {profile.name} • {profile.niche} • {profile.city}
                </p>
              </div>
            </div>

            {/* Top Action Controls */}
            <div className="flex items-center gap-2.5">
              {/* Toggle Master Server vs Client Mode */}
              <button
                onClick={() => setViewMode(prev => prev === 'master_server' ? 'client' : 'master_server')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl transition ${
                  viewMode === 'master_server'
                    ? 'bg-slate-900 text-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
                title="Comando Central de Subservidores & Usuários"
              >
                <Server className="w-3.5 h-3.5" />
                {viewMode === 'master_server' ? 'Servidor Principal (Ativo)' : 'Painel Master'}
              </button>

              {/* User Account Button */}
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200/80"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name[0]}
                </div>
                <span className="hidden md:inline max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                  currentUser.authProvider === 'google' ? 'bg-red-100 text-red-700' :
                  currentUser.authProvider === 'facebook' ? 'bg-blue-100 text-blue-700' :
                  currentUser.authProvider === 'twitter' ? 'bg-slate-800 text-white' :
                  currentUser.authProvider === 'phone' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {currentUser.authProvider}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 rounded-xl transition ${
                  activeTab === 'settings'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
                title="Configurações da Empresa"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Only in Client View) */}
          {viewMode === 'client' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex overflow-x-auto no-scrollbar gap-1">
              {/* Feed Global Tab Button */}
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'feed'
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/70 font-black'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                Feed Global V.Ex
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-amber-400 text-slate-950">
                  AO VIVO
                </span>
              </button>

              <button
                onClick={() => setActiveTab('automation')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'automation'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Automação Social & DMs
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'pricing'
                    ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4 text-amber-600" />
                Planos & Alavancagem
              </button>
              <button
                onClick={() => setActiveTab('biolink')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'biolink'
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                BioLink (Pagamento Único)
              </button>
              <button
                onClick={() => setActiveTab('expansion')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'expansion'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                Expansão de Negócios
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'videos'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4" />
                Vídeos Marketing
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'ads'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                Gerador de Anúncios
              </button>
              <button
                onClick={() => setActiveTab('flyers')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'flyers'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                Estúdio de Flyers
              </button>
              <button
                onClick={() => setActiveTab('gateways')}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'gateways'
                    ? 'border-emerald-600 text-emerald-800 bg-emerald-50/70 font-black'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Gateways de Pagamento
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${
                  gateways.filter(g => g.status === 'valid' && g.enabled).length > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {gateways.filter(g => g.status === 'valid' && g.enabled).length}/{gateways.length}
                </span>
              </button>
            </div>
          )}
        </header>

        {/* ======================================================== */}
        {/* VIEW: SERVIDOR PRINCIPAL (MASTER COMMAND CENTER) */}
        {/* ======================================================== */}
        {viewMode === 'master_server' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CreatorMasterDashboard
              users={platformUsers}
              subServers={subServers}
              feedItems={feedItems}
              ticketPrice={ticketPrice}
              terminalLogs={terminalLogs}
              masterCommandInput={masterCommandInput}
              negotiations={negotiations}
              onUpdateTicketPrice={handleUpdateTicketPrice}
              onToggleBlockUser={handleToggleBlockUser}
              onToggleGrantTicket={handleToggleGrantTicket}
              onBoostUserProducts={handleBoostUserProducts}
              onExecuteCommand={executeMasterCommand}
              onSetMasterCommandInput={setMasterCommandInput}
              onSwitchToClientView={() => setViewMode('client')}
              onUpdateNegotiationStatus={handleUpdateNegotiationStatus}
            />
          </main>
        )}

        {/* ======================================================== */}
        {/* VIEW: CLIENTE EMPREENDEDOR (V.EX VISÃO EXCLUSIVA) */}
        {/* ======================================================== */}
        {viewMode === 'client' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* FEED GLOBAL V.EX TAB */}
            {activeTab === 'feed' && (
              <GlobalFeed
                feedItems={feedItems}
                currentUser={currentUser}
                ticketPrice={ticketPrice}
                onLikeItem={handleLikeFeedItem}
                onShareItem={handleShareFeedItem}
                onPublishToFeed={handlePublishToFeed}
                onOpenTicketCheckout={startTicketCheckout}
                isCreatorView={currentUser.role === 'creator'}
                onBoostItemByCreator={handleBoostFeedItem}
              />
            )}

            {/* PRICING TAB */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                {/* CARD DO BILHETE DE ENTRADA (COMEÇA EM 5.000 KZ) */}
                <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-3xl p-6 sm:p-7 text-slate-950 shadow-xl border border-amber-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider">
                      <Ticket className="w-4 h-4 text-amber-400" />
                      Bilhete Oficial de Entrada & Acesso V.Ex
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      Bilhete de Entrada: {ticketPrice.toLocaleString('pt-AO')} Kwanzas
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                      Começamos com <strong>5.000 Kwanzas</strong> e com o tempo vamos atualizando os preços. Com o bilhete você registra a sua conta oficial, ganha o direito de alavancar e publicar produtos no <strong>Feed Global</strong> e tem circulação mútua em toda Angola!
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold pt-1">
                      <span className="flex items-center gap-1 text-slate-950">
                        <CheckCircle2 className="w-4 h-4 text-slate-950" /> Direito a publicar no Feed Global
                      </span>
                      <span className="flex items-center gap-1 text-slate-950">
                        <CheckCircle2 className="w-4 h-4 text-slate-950" /> Circulação cruzada entre clientes
                      </span>
                      <span className="flex items-center gap-1 text-slate-950">
                        <CheckCircle2 className="w-4 h-4 text-slate-950" /> Suporte Multicaixa, PayPay, Unitel e Afrimoney
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950 text-white p-5 rounded-2xl text-center shrink-0 w-full md:w-64 border border-slate-800 shadow-xl">
                    <div className="text-[10px] text-amber-300 font-black uppercase tracking-wider">Valor do Bilhete</div>
                    <div className="text-3xl font-black text-white mt-1">{ticketPrice.toLocaleString('pt-AO')} Kz</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Preço inicial ajustável pelo criador</div>
                    
                    {currentUser.hasTicket ? (
                      <div className="mt-3 py-2.5 px-3 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-black flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Bilhete Ativo na Tua Conta
                      </div>
                    ) : (
                      <button
                        onClick={startTicketCheckout}
                        className="w-full mt-3 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Ticket className="w-4 h-4 text-slate-950" />
                        Comprar Bilhete por {ticketPrice.toLocaleString('pt-AO')} Kz
                      </button>
                    )}
                  </div>
                </div>

                {/* OPÇÃO DE NEGOCIAÇÃO DIRETA COM O DONO (50% EM SERVIÇOS DE TEMPO) */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white border border-indigo-700/50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                      <Handshake className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-300 bg-white/10 px-2 py-0.5 rounded-full mb-0.5">
                        🤝 Exclusivo V.Ex • Negociação Direta com o Dono
                      </div>
                      <h4 className="text-sm sm:text-base font-black">
                        Quer negociar pagar 50% em dinheiro e 50% em serviços de tempo?
                      </h4>
                      <p className="text-xs text-indigo-200 mt-0.5">
                        Interaja diretamente com o Dono da plataforma (eu) para discutir a probabilidade de pagar 50% em contrapartida de tempo ou serviços da tua empresa.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setNegotiationTargetPrice(calculatedLeveragePrice);
                      setNegotiationTargetTitle(`Plano de Alavancagem (${selectedDuration} Dias)`);
                      setShowNegotiationModal(true);
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition shrink-0 shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Handshake className="w-4 h-4 text-slate-950" />
                    Negociar 50% com o Dono
                  </button>
                </div>

                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                      <Flame className="w-4 h-4 text-amber-400" />
                      V.Ex Visão Exclusiva • Preçário Adaptativo
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                      O Preço Varia Conforme o Teu Produto e o Tempo de Alavancagem
                    </h2>
                    <p className="text-sm text-indigo-200 mt-3 leading-relaxed">
                      Não cobramos valores genéricos. O investimento é calculado com base na quantidade de produtos que vamos promover, complexidade do nicho e duração da campanha de anúncios, flyers e vídeos virais.
                    </p>
                    
                    <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-white/70 font-semibold">Pagamentos em Angola:</span>
                      <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-bold text-white border border-white/20">Multicaixa Express</span>
                      <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-bold text-white border border-white/20">PayPay África</span>
                      <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-bold text-white border border-white/20">Unitel Money</span>
                      <span className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-bold text-white border border-white/20">Afrimoney</span>
                    </div>
                  </div>
                </div>

                {/* Calculator Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-indigo-600" />
                        Simulador do Teu Plano de Alavancagem
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Ajusta os parâmetros para obter o orçamento exato em Kwanzas (Kz):
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                        1. Tempo de Alavancagem da Campanha:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { days: 7, label: '7 Dias', sub: 'Campanha Express' },
                          { days: 15, label: '15 Dias', sub: 'Aceleração de Vendas' },
                          { days: 30, label: '30 Dias', sub: 'Escala & Dominação' },
                          { days: 60, label: '60 Dias', sub: 'Crescimento Trimestral' }
                        ].map((d) => (
                          <button
                            key={d.days}
                            onClick={() => setSelectedDuration(d.days as any)}
                            className={`p-3 rounded-xl border text-left transition ${
                              selectedDuration === d.days
                                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20'
                                : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="font-extrabold text-sm">{d.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{d.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                        2. Categoria / Complexidade do Produto:
                      </label>
                      <select
                        value={selectedProductType}
                        onChange={(e) => setSelectedProductType(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option>Gastronomia & Delivery</option>
                        <option>Moda, Roupas & Calçados</option>
                        <option>Beleza & Estética</option>
                        <option>Serviços Especializados</option>
                        <option>Varejo & Eletrônicos</option>
                        <option>Infoprodutos & Cursos</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                        3. Quantos Produtos Vamos Alavancar?
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { qty: 1, label: '1 Carro-Chefe' },
                          { qty: 3, label: '3 Produtos' },
                          { qty: 5, label: '5 Produtos' },
                          { qty: 10, label: 'Catálogo Todo' }
                        ].map((q) => (
                          <button
                            key={q.qty}
                            onClick={() => setSelectedProductQty(q.qty as any)}
                            className={`py-2.5 px-2 text-center rounded-xl border text-xs font-bold transition ${
                              selectedProductQty === q.qty
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {q.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        📦 O que está incluído durante os {selectedDuration} dias:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{selectedDuration === 7 ? '2' : selectedDuration === 15 ? '4' : '8'} Peças de Anúncios Persuasivos</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{selectedDuration === 7 ? '3' : selectedDuration === 15 ? '6' : '12'} Flyers de Alto Impacto</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{selectedDuration === 7 ? '2' : selectedDuration === 15 ? '4' : '8'} Roteiros de Vídeos Virais</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Robô de Comentários & DM 24/7 Ativo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between border border-indigo-800/50">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                          Orçamento em Kwanzas
                        </span>
                        <h4 className="text-lg font-bold mt-3">Investimento de Alavancagem V.Ex</h4>
                        <p className="text-xs text-indigo-200 mt-1">
                          {selectedDuration} dias de campanha • {selectedProductQty} produto(s) de {selectedProductType}
                        </p>

                        <div className="my-6">
                          <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
                            {calculatedLeveragePrice.toLocaleString('pt-AO')} Kz
                          </div>
                          <div className="text-xs text-indigo-300 mt-1">
                            Preço proporcional ao tempo e esforço de marketing
                          </div>
                        </div>

                        <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                          <div className="flex justify-between text-white/80">
                            <span>Tempo de Alavancagem:</span>
                            <strong className="text-white">{selectedDuration} Dias</strong>
                          </div>
                          <div className="flex justify-between text-white/80">
                            <span>Produtos a Promover:</span>
                            <strong className="text-white">{selectedProductQty} Selecionados</strong>
                          </div>
                          <div className="flex justify-between text-white/80">
                            <span>Reencaminho DM / WhatsApp:</span>
                            <strong className="text-emerald-300">Incluído 24h</strong>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10">
                        <button
                          onClick={startLeverageCheckout}
                          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                        >
                          <Zap className="w-4 h-4 text-slate-950" />
                          Contratar Alavancagem V.Ex
                        </button>
                        <p className="text-[11px] text-center text-white/60 mt-2">
                          Pagamento via Multicaixa Express, PayPay, Unitel Money ou Afrimoney
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-xs relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">
                        PAGAMENTO ÚNICO
                      </div>
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1">
                        <LinkIcon className="w-4 h-4 text-indigo-600" />
                        Quer apenas a BioLink Interativa?
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        A página de BioLink com o teu catálogo, WhatsApp e botões diretos é um <strong>pagamento único de {biolinkLifetimePrice.toLocaleString('pt-AO')} Kz</strong> para sempre, sem mensalidades!
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-extrabold text-base text-slate-900">
                          {biolinkLifetimePrice.toLocaleString('pt-AO')} Kz <span className="text-xs font-normal text-slate-500">vitalício</span>
                        </span>
                        <button
                          onClick={startBioLinkCheckout}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition"
                        >
                          Comprar BioLink Única
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BIOLINK TAB */}
            {activeTab === 'biolink' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="max-w-xl">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/30">
                      ⭐ V.Ex • PAGAMENTO ÚNICO VITALÍCIO
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black mt-3">
                      A Tua Página de BioLink Profissional
                    </h2>
                    <p className="text-sm text-indigo-100 mt-2 leading-relaxed">
                      Coloca um link poderoso na bio do teu Instagram e TikTok com todos os teus produtos, catálogo atualizado e botão direto para o teu WhatsApp. <strong>Pagas apenas uma vez e fica tua para sempre!</strong>
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-auto">
                    <div className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Acesso Vitalício</div>
                    <div className="text-3xl font-black text-amber-300 mt-1">{biolinkLifetimePrice.toLocaleString('pt-AO')} Kz</div>
                    <div className="text-[11px] text-white/80 mt-0.5">Pagamento Único em Angola</div>
                    <button
                      onClick={startBioLinkCheckout}
                      className="mt-3 w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition shadow-md"
                    >
                      Garantir BioLink Vitalícia
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-xs bg-slate-900 border-4 border-slate-800 rounded-[36px] p-6 text-white shadow-2xl space-y-4">
                      <div className="text-center pt-2">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-0.5">
                          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-black text-white">
                            {profile.name[0]}
                          </div>
                        </div>
                        <h3 className="font-extrabold text-base mt-2.5">{profile.name}</h3>
                        <p className="text-[11px] text-slate-400">{profile.niche} • {profile.city}</p>
                        <p className="text-[11px] text-indigo-300 mt-1 font-medium">
                          "Comenta QUERO no nosso post ou clica em baixo para falar direto no WhatsApp!"
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <a
                          href={`https://wa.me/${profile.phone}?text=Ola!+Vi+a+tua+BioLink+V.Ex+e+quero+fazer+um+pedido!`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-between transition shadow-md"
                        >
                          <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Falar no WhatsApp Oficial
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>

                        <div className="w-full py-3 px-4 bg-slate-800/90 text-white rounded-xl text-xs font-bold flex items-center justify-between border border-slate-700">
                          <span className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-amber-400" />
                            Ver Catálogo com Preços em Kz
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>

                        <div className="w-full py-3 px-4 bg-indigo-600/90 text-white rounded-xl text-xs font-bold flex items-center justify-between border border-indigo-500">
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            Pegar Cupom de Desconto
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="text-center pt-4 border-t border-slate-800 text-[10px] text-slate-500">
                        ⚡ V.Ex Visão Exclusiva BioLink
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                      <h3 className="font-extrabold text-base text-slate-900">
                        Por que a BioLink V.Ex é Pagamento Único?
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Acreditamos que pequenas empresas não devem ser presas a mensalidades intermináveis apenas para terem uma página de links e catálogo. Com o pagamento único de <strong>{biolinkLifetimePrice.toLocaleString('pt-AO')} Kz</strong>, a tua página fica no ar para sempre.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sem Mensalidade
                          </div>
                          <p className="text-[11px] text-slate-500">Pagas uma única vez e nunca mais te preocupas com faturas.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Catálogo em Kz Integrado
                          </div>
                          <p className="text-[11px] text-slate-500">Adiciona produtos com fotos e preços em Kwanzas.</p>
                        </div>
                      </div>

                      <div className="pt-3">
                        <button
                          onClick={startBioLinkCheckout}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Ativar a Minha BioLink Vitalícia por {biolinkLifetimePrice.toLocaleString('pt-AO')} Kz
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AUTOMATION TAB */}
            {activeTab === 'automation' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">DMs Enviadas</span>
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Send className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">174</div>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      +28 hoje via comentários
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Taxa de Conversão</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">43.8%</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Cliques no WhatsApp do dono
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Gatilhos Ativos</span>
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{rules.filter(r => r.isActive).length} Palavras</div>
                    <p className="text-xs text-amber-700 font-medium mt-1">
                      QUERO, PREÇO, CARDAPIO...
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Tempo de Resposta</span>
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">&lt; 3 seg</div>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      100% automatizado pela IA
                    </p>
                  </div>
                </div>

                {/* 7-DAY RECHARTS BAR CHART ANALYTICS */}
                <AutomationAnalyticsChart rules={rules} leads={leads} />

                {/* Simulator Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                            <Instagram className="w-5 h-5 text-pink-600" />
                            Simulador de Feed & Automação V.Ex
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Digite um comentário para testar a resposta pública da IA e o disparo imediato de DM
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          Ouvindo Feed
                        </span>
                      </div>

                      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
                            {profile.name[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">@{profile.instagram}</div>
                            <div className="text-[10px] text-slate-500">{profile.city} • Patrocinado</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          🔥 <strong className="text-slate-900">LANÇAMENTO EXCLUSIVO DA SEMANA!</strong> Quer garantir a nossa condição especial com desconto antes de todo mundo? Comente <span className="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">QUERO</span> aqui embaixo que enviamos o link direto no seu direct! 👇
                        </p>
                      </div>

                      <div className="mt-4">
                        <span className="text-xs font-semibold text-slate-500">Testar com exemplos reais:</span>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {['Eu QUERO muito!', 'Qual o PREÇO?', 'Tem CARDAPIO?', 'Vocês entregam em Luanda?', 'Qual a PROMO de hoje?'].map((ex, i) => (
                            <button
                              key={i}
                              onClick={() => setSimInput(ex)}
                              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-medium"
                            >
                              {ex}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          value={simInput}
                          onChange={(e) => setSimInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && runSimulation()}
                          placeholder="Escreva como se fosse um cliente comentando..."
                          className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        <button
                          onClick={runSimulation}
                          disabled={simLoading || !simInput.trim()}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm shadow-indigo-100"
                        >
                          {simLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          Testar
                        </button>
                      </div>

                      {simResult && (
                        <div className="mt-5 space-y-3 pt-4 border-t border-slate-100">
                          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/60">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              Resposta Pública da IA no Comentário:
                            </div>
                            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                              "{simResult.reply}"
                            </p>
                          </div>

                          {simResult.ruleMatched ? (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                  <span className="text-xs font-bold text-emerald-900">
                                    Gatilho "#{simResult.ruleMatched.keyword}" Detectado! DM Enviada!
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                                  Reencaminhamento Direto
                                </span>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-emerald-200/80 text-xs text-slate-800 space-y-1.5">
                                <div className="font-semibold text-slate-600 text-[11px]">Mensagem Privada Recebida no Direct:</div>
                                <p className="text-slate-900">
                                  {simResult.ruleMatched.dmMessage}
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2 items-center">
                                  <a
                                    href={getWaLink(simResult.ruleMatched.keyword)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                    Abrir Conversa no WhatsApp do Dono
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                  <button
                                    onClick={() => copyToClipboard(getWaLink(simResult.ruleMatched!.keyword), 'dm-link')}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                                  >
                                    {copiedId === 'dm-link' ? 'Copiado!' : 'Copiar Link Direto'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-600 flex items-center gap-2">
                              <span>Nenhuma palavra-chave gatilho específica configurada foi detectada, mas a IA respondeu amigavelmente.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Manual Comments Assistant */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Gerador de Respostas com IA para Qualquer Dúvida
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 mb-3">
                        Cole uma dúvida difícil, pedido de desconto ou reclamação de seguidor para gerar 3 respostas instantâneas:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={manualInput}
                          onChange={(e) => setManualInput(e.target.value)}
                          placeholder="Ex: Gostei mas achei o valor alto, têm desconto por transferência?"
                          className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                        <button
                          onClick={runManualGen}
                          disabled={manualLoading || !manualInput.trim()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          {manualLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          Gerar Variações
                        </button>
                      </div>

                      {manualVariants.length > 0 && (
                        <div className="mt-4 space-y-2.5">
                          {manualVariants.map((v, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">{v.style}</span>
                                <button
                                  onClick={() => copyToClipboard(v.text, `var-${idx}`)}
                                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                                >
                                  {copiedId === `var-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === `var-${idx}` ? 'Copiado!' : 'Copiar'}
                                </button>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">{v.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Rules & Leads */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">Palavras-Chave Gatilho</h3>
                          <p className="text-xs text-slate-500">Acionam respostas + DM direta</p>
                        </div>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Novo Gatilho
                        </button>
                      </div>

                      <div className="space-y-3">
                        {rules.map((rule) => (
                          <div
                            key={rule.id}
                            className={`p-3.5 rounded-xl border transition ${
                              rule.isActive
                                ? 'bg-slate-50/80 border-slate-200'
                                : 'bg-slate-100/40 border-slate-200 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-extrabold tracking-wider">
                                  #{rule.keyword}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {rule.matchCount} disparos
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r))}
                                  className={`text-xs px-2 py-0.5 rounded font-bold transition ${
                                    rule.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {rule.isActive ? 'Ativo' : 'Pausado'}
                                </button>
                                <button
                                  onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))}
                                  className="p-1 text-slate-400 hover:text-red-600 transition"
                                  title="Remover regra"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="text-[11px] text-slate-600 space-y-1">
                              <div><strong className="text-slate-800">Público:</strong> {rule.publicReply}</div>
                              <div><strong className="text-slate-800">Privado:</strong> {rule.dmMessage}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">Leads Captados via Comentários</h3>
                          <p className="text-xs text-slate-500">Internautas que interagiram com as palavras</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={exportLeadsCSV}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-xs"
                            title="Baixar lista completa em formato CSV para CRM ou envio de mensagens em massa"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Exportar CSV
                          </button>
                          <span className="text-xs font-extrabold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                            {leads.length} Leads
                          </span>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                        {leads.map((lead) => (
                          <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                {lead.username}
                                <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                  #{lead.keyword}
                                </span>
                              </div>
                              <div className="text-slate-500 text-[11px] mt-0.5">"{lead.comment}"</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{lead.timestamp}</div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                lead.status === 'Venda Fechada'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : lead.status === 'Conversou no Whats'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {lead.status}
                              </span>
                              <a
                                href={`https://wa.me/${profile.phone}?text=Ol%C3%A1+${encodeURIComponent(lead.username)}!+Recebeu+o+link+do+produto+no+Direct?`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] flex items-center gap-0.5"
                              >
                                Chamar <ArrowRight className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MANUAL FOLLOW-UP REMINDER SCHEDULER */}
                <FollowUpReminderScheduler
                  leads={leads}
                  profile={profile}
                  onUpdateLeadStatus={(leadId, newStatus) => {
                    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status: newStatus } : l)));
                  }}
                  onNotify={showToast}
                />

                {/* PUSH NOTIFICATIONS & FIREBASE CLOUD MESSAGING */}
                <PushNotificationManager
                  permission={fcm.permission}
                  fcmToken={fcm.fcmToken}
                  fcmConfig={fcm.fcmConfig}
                  swRegistered={fcm.swRegistered}
                  backgroundSimulation={fcm.backgroundSimulation}
                  onRequestPermission={fcm.requestPermission}
                  onSendTestPush={fcm.sendPushNotification}
                  onToggleBackgroundSimulation={fcm.toggleBackgroundSimulation}
                  onUpdateFcmConfig={fcm.updateFcmConfig}
                  onNotify={showToast}
                />
              </div>
            )}

            {/* EXPANSION TAB */}
            {activeTab === 'expansion' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md">
                  <div className="max-w-3xl">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
                      Motor de Expansão de Catálogo V.Ex
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black mt-3">
                      Expanda as Linhas de Produto de {profile.name}
                    </h2>
                    <p className="text-sm text-indigo-200 mt-2 leading-relaxed">
                      Pequenas empresas crescem criando produtos de alto ticket (combos, kits presenteáveis e assinaturas) sem precisar multiplicar os custos fixos.
                    </p>

                    <div className="mt-5 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={expansionGoal}
                        onChange={(e) => setExpansionGoal(e.target.value)}
                        placeholder="Qual seu foco? Ex: Aumentar vendas no fim de semana, atrair empresas..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-indigo-300 border border-white/20 text-sm focus:outline-none focus:bg-white/20 transition"
                      />
                      <button
                        onClick={runExpansionGen}
                        disabled={expansionLoading}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-emerald-950/20"
                      >
                        {expansionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Gerar Linhas com IA
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 transition">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                            {idea.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-xs">
                            Margem: {idea.estimatedMargin}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                          {idea.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {idea.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Preço Sugerido:</span>
                            <span className="font-bold text-emerald-600">{idea.suggestedPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Público-Alvo:</span>
                            <span className="font-semibold text-slate-800 text-right max-w-[160px] truncate">{idea.targetAudience}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3 text-amber-500" /> Estratégia de Lançamento em 7 Dias:
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          {idea.strategy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DONUT CHART: DISTRIBUIÇÃO DA MARGEM DE LUCRO POR NICHO */}
                <NicheProfitMarginDonutChart nicheName={profile.niche} />

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-base text-slate-900">
                      Calculadora de Margem de Lucro & Projeção Mensal em Kwanzas (Kz)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Custo do Produto (Kz)</label>
                      <input
                        type="number"
                        value={calcCost}
                        onChange={(e) => setCalcCost(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Preço de Venda (Kz)</label>
                      <input
                        type="number"
                        value={calcPrice}
                        onChange={(e) => setCalcPrice(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Vendas Estimadas / Mês</label>
                      <input
                        type="number"
                        value={calcUnits}
                        onChange={(e) => setCalcUnits(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 flex flex-wrap items-center justify-around gap-4 text-center">
                    <div>
                      <span className="text-xs font-semibold text-slate-500">Lucro por Unidade</span>
                      <div className="text-xl font-black text-emerald-700">{profitUnit.toLocaleString('pt-AO')} Kz</div>
                    </div>
                    <div className="w-px h-8 bg-emerald-200 hidden sm:block"></div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500">Margem Real</span>
                      <div className="text-xl font-black text-indigo-700">{marginPct}%</div>
                    </div>
                    <div className="w-px h-8 bg-emerald-200 hidden sm:block"></div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500">Lucro Líquido Projetado / Mês</span>
                      <div className="text-xl font-black text-emerald-800">{totalProfit.toLocaleString('pt-AO')} Kz</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIDEOS TAB */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-600" />
                    Estúdio de Vídeos Marketing & Storyboards Virais
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Roteiros cronometrados para Reels e TikTok focados em fazer o cliente comentar a palavra-chave e receber a DM
                  </p>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={videoProduct}
                      onChange={(e) => setVideoProduct(e.target.value)}
                      placeholder="Qual produto ou promoção você quer filmar?"
                      className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      onClick={() => {
                        setVideoLoading(true);
                        setTimeout(() => {
                          setCurrentScript({
                            title: `Roteiro Viral: O Segredo de ${videoProduct}`,
                            hook: `Espere! Não compre em nenhum lugar antes de ver esse detalhe em ${profile.name}!`,
                            format: 'Reels / TikTok (9:16)',
                            scenes: [
                              {
                                num: 1,
                                time: '0 a 3s',
                                action: `Aproximando a câmera com celular vertical focado em ${videoProduct}.`,
                                speech: `Se você mora em ${profile.city} e ainda não experimentou isso, você tá perdendo tempo!`,
                                textOnScreen: 'Você PRECISA conhecer isso! 😱'
                              },
                              {
                                num: 2,
                                time: '3 a 8s',
                                action: 'Demonstrando o cuidado artesanal e o diferencial de qualidade.',
                                speech: 'A maioria das pessoas reclama da falta de qualidade, mas aqui a história é outra!',
                                textOnScreen: 'Feito com ingredientes de verdade ✨'
                              },
                              {
                                num: 3,
                                time: '8 a 18s',
                                action: 'Apresentando o resultado final de dar água na boca.',
                                speech: 'Olha essa textura e acabamento! Dá vontade de levar tudo agora mesmo.',
                                textOnScreen: 'Perfeito pra hoje! 🔥'
                              },
                              {
                                num: 4,
                                time: '18 a 25s',
                                action: 'Apontando para os comentários com sorriso e mostrando o produto.',
                                speech: 'Comente a palavra QUERO aqui que te mando o link com desconto no seu direct!',
                                textOnScreen: 'Comente "QUERO" aqui 👇'
                              }
                            ],
                            cta: 'Comente a palavra "QUERO" para receber o link exclusivo no Direct!',
                            audio: 'Áudio instrumental em alta (batida acústica moderna)',
                            caption: `Procurando a melhor experiência em ${profile.city}? ✨\n\nConheça ${videoProduct} feito artesanalmente para você!\n\n👇 Comente "QUERO" para receber nosso cardápio e desconto no direct!`
                          });
                          setVideoLoading(false);
                        }, 600);
                      }}
                      disabled={videoLoading}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                    >
                      {videoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Gerar Roteiro
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Roteiro Aprovado</span>
                      <h3 className="font-extrabold text-lg text-slate-900">{currentScript.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
                        {currentScript.format}
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${currentScript.title}\n\nGANCHO:\n${currentScript.hook}\n\nCTA:\n${currentScript.cta}\n\nLEGENDA:\n${currentScript.caption}`, 'full-script')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                      >
                        {copiedId === 'full-script' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === 'full-script' ? 'Copiado!' : 'Copiar Tudo'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs mb-1 uppercase tracking-wide">
                      <Flame className="w-4 h-4 text-amber-600" /> Gancho de Retenção (0 a 3 segundos):
                    </div>
                    <p className="text-sm font-bold text-amber-950">
                      "{currentScript.hook}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cenas Cronometradas:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentScript.scenes.map((s) => (
                        <div key={s.num} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                              {s.num}
                            </span>
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              {s.time}
                            </span>
                          </div>
                          <div className="text-xs text-slate-700">
                            <strong className="text-slate-900">🎬 Imagem:</strong> {s.action}
                          </div>
                          <div className="text-xs text-slate-700">
                            <strong className="text-slate-900">🎙️ Voz:</strong> "{s.speech}"
                          </div>
                          <div className="text-xs bg-white p-2 rounded border border-slate-200 text-slate-800 font-semibold">
                            Texto na Tela: "{s.textOnScreen}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADS TAB */}
            {activeTab === 'ads' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-indigo-600" />
                    Gerador de Anúncios de Alto Impacto (Meta & Google)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Copys persuasivas com metodologia AIDA desenhadas para converter moradores da sua cidade
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <input
                      type="text"
                      value={adOffer}
                      onChange={(e) => setAdOffer(e.target.value)}
                      placeholder="Qual a oferta? Ex: Rodízio com preço promocional, Kit manicure..."
                      className="sm:col-span-8 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <select
                      value={adPlatform}
                      onChange={(e) => setAdPlatform(e.target.value)}
                      className="sm:col-span-4 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option>Meta Ads (Instagram & FB)</option>
                      <option>TikTok Ads</option>
                      <option>Google Ads & WhatsApp</option>
                    </select>
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={() => {
                        setAdLoading(true);
                        setTimeout(() => {
                          setCurrentAd({
                            headline: `Garanta agora: ${adOffer}!`,
                            primaryText: `Você merece o melhor de ${profile.city} sem pagar a mais por isso!\n\nNa ${profile.name}, preparamos tudo no capricho para surpreender você.\n\n👉 Toque no botão abaixo e fale direto comigo no WhatsApp antes de esgotar!`,
                            cta: 'Conversar no WhatsApp',
                            platform: adPlatform,
                            targeting: `Moradores de ${profile.city} (Raio de 8km). Interesses: Compras locais e Gastronomia.`,
                            sellingPoints: [
                              'Atendimento rápido e direto com o dono',
                              'Preço justo de quem produz no bairro',
                              'Satisfação 100% garantida'
                            ]
                          });
                          setAdLoading(false);
                        }, 600);
                      }}
                      disabled={adLoading}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2"
                    >
                      {adLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Gerar Anúncio Persuasivo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs max-w-md mx-auto">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                          {profile.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{profile.name}</div>
                          <div className="text-[10px] text-slate-500">Patrocinado • {profile.city}</div>
                        </div>
                      </div>

                      <div className="w-full h-44 rounded-lg bg-gradient-to-tr from-indigo-700 via-indigo-600 to-emerald-500 flex flex-col items-center justify-center text-white p-6 text-center">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 mb-1">OFERTA ESPECIAL</span>
                        <h4 className="text-lg font-black leading-tight">{currentAd.headline}</h4>
                        <span className="text-xs mt-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full font-bold">
                          Peça Direto no WhatsApp
                        </span>
                      </div>

                      <div className="mt-3 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                        {currentAd.primaryText}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <a
                          href={`https://wa.me/${profile.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {currentAd.cta}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                      <h3 className="font-bold text-sm text-slate-900 mb-2">Segmentação do Público Local:</h3>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {currentAd.targeting}
                      </p>

                      <div className="mt-5">
                        <button
                          onClick={() => copyToClipboard(`TÍTULO:\n${currentAd.headline}\n\nTEXTO:\n${currentAd.primaryText}\n\nCTA:\n${currentAd.cta}`, 'ad-text')}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          {copiedId === 'ad-text' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                          {copiedId === 'ad-text' ? 'Copiado para o Gerenciador de Anúncios!' : 'Copiar Textos do Anúncio'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FLYERS TAB */}
            {activeTab === 'flyers' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div>
                      <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-indigo-600" />
                        Editor Visual de Flyer Promocional V.Ex
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Crie banners para Stories e WhatsApp com chamada para comentar
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Esquema de Cores:</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'indigo', name: 'Índigo', bg: 'bg-indigo-600' },
                          { id: 'emerald', name: 'Esmeralda', bg: 'bg-emerald-600' },
                          { id: 'coral', name: 'Coral', bg: 'bg-orange-600' },
                          { id: 'dark', name: 'Ouro Dark', bg: 'bg-slate-900' }
                        ].map((th) => (
                          <button
                            key={th.id}
                            onClick={() => setFlyerTheme(th.id as any)}
                            className={`py-2 px-2 text-xs font-bold rounded-xl text-white transition flex flex-col items-center gap-1 ${th.bg} ${
                              flyerTheme === th.id ? 'ring-2 ring-offset-2 ring-indigo-500' : 'opacity-80 hover:opacity-100'
                            }`}
                          >
                            {th.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Título Principal do Banner:</label>
                      <input
                        type="text"
                        value={flyerHeadline}
                        onChange={(e) => setFlyerHeadline(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Subtítulo / Proposta de Valor:</label>
                      <input
                        type="text"
                        value={flyerSub}
                        onChange={(e) => setFlyerSub(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Selo de Desconto (Badge):</label>
                      <input
                        type="text"
                        value={flyerBadge}
                        onChange={(e) => setFlyerBadge(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Chamada do Gatilho de DM:</label>
                      <input
                        type="text"
                        value={flyerCta}
                        onChange={(e) => setFlyerCta(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => copyToClipboard(`🎨 FLYER V.Ex: ${profile.name}\n\n⭐ ${flyerHeadline}\n📌 ${flyerSub}\n🏷️ ${flyerBadge}\n👉 ${flyerCta}\n\nWhatsApp: https://wa.me/${profile.phone}`, 'flyer-text')}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        {copiedId === 'flyer-text' ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                        {copiedId === 'flyer-text' ? 'Copiado para Envio!' : 'Copiar Texto da Arte'}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex justify-center">
                    <div
                      className={`w-full max-w-md rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between aspect-[9/16] min-h-[520px] transition-all duration-300 ${
                        flyerTheme === 'indigo'
                          ? 'bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-950'
                          : flyerTheme === 'emerald'
                          ? 'bg-gradient-to-b from-emerald-600 via-teal-800 to-slate-950'
                          : flyerTheme === 'coral'
                          ? 'bg-gradient-to-b from-orange-600 via-rose-800 to-slate-950'
                          : 'bg-gradient-to-b from-slate-900 via-zinc-900 to-black'
                      }`}
                    >
                      <div className="text-center">
                        <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-widest border border-white/20">
                          {profile.name} • V.Ex
                        </div>
                      </div>

                      <div className="text-center space-y-4 my-auto">
                        <div className="inline-block transform -rotate-3">
                          <span className="px-5 py-2 rounded-2xl bg-amber-400 text-slate-950 text-xl font-black tracking-wider shadow-lg">
                            {flyerBadge}
                          </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight uppercase drop-shadow-md">
                          {flyerHeadline}
                        </h1>

                        <p className="text-sm text-white/90 max-w-xs mx-auto font-medium leading-relaxed">
                          {flyerSub}
                        </p>

                        <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl max-w-xs mx-auto transform hover:scale-105 transition">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 mb-0.5">
                            ⚡ REENCAMINHO DIRETO NO DIRECT
                          </div>
                          <div className="text-xs font-black text-slate-950">
                            {flyerCta}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/20 text-center text-xs text-white/80 space-y-1">
                        <div className="font-semibold">
                          WhatsApp: {profile.phone} • @{profile.instagram}
                        </div>
                        <div className="text-[10px] text-white/60">
                          {profile.city} • V.Ex Visão Exclusiva
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-indigo-600" />
                    Dados da Sua Empresa em Angola (V.Ex)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Essas informações personalizam os roteiros, anúncios e os links diretos para o seu WhatsApp
                  </p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Nome da Empresa:</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Nicho do Negócio:</label>
                      <select
                        value={profile.niche}
                        onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option>Gastronomia & Restaurantes</option>
                        <option>Moda, Roupas & Calçados</option>
                        <option>Beleza, Estética & Salão</option>
                        <option>Serviços Especializados Locais</option>
                        <option>Artesanato & Presentes</option>
                        <option>Varejo & Eletrônicos</option>
                        <option>Academia, Fitness & Treinos</option>
                        <option>Pet Shop & Veterinária</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        WhatsApp do Dono (+244 de Angola sem espaços):
                      </label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Link de redirecionamento: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">https://wa.me/{profile.phone}</code>
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Instagram Oficial (sem @):</label>
                      <input
                        type="text"
                        value={profile.instagram}
                        onChange={(e) => setProfile({ ...profile, instagram: e.target.value.replace('@', '') })}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Cidade e Província:</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700">
                          NIF (Número de Identificação Fiscal Angolano - AGT):
                        </label>
                        {profile.nif && (() => {
                          const validation = validateAngolanNIF(profile.nif);
                          return (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              validation.isValid
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {validation.isValid ? `✓ ${validation.type}` : '✗ Inválido'}
                            </span>
                          );
                        })()}
                      </div>
                      <input
                        type="text"
                        value={profile.nif || ''}
                        onChange={(e) => setProfile({ ...profile, nif: e.target.value.toUpperCase().trim() })}
                        placeholder="Ex: 5417089123 (Empresa) ou 004819231LA042 (BI)"
                        className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl font-mono ${
                          profile.nif && !validateAngolanNIF(profile.nif).isValid
                            ? 'border-rose-300 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:ring-indigo-500/20'
                        }`}
                      />
                      <div className="mt-1 flex items-start justify-between text-[11px]">
                        <span className={profile.nif && !validateAngolanNIF(profile.nif).isValid ? 'text-rose-600 font-medium' : 'text-slate-400'}>
                          {profile.nif ? validateAngolanNIF(profile.nif).message : 'Padrão AGT: 10 dígitos numéricos (Empresa) ou formato do BI (Pessoa Singular).'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={() => {
                          if (profile.nif) {
                            const check = validateAngolanNIF(profile.nif);
                            if (!check.isValid) {
                              showToast(check.message, 'error');
                              return;
                            }
                          }
                          showToast('Configurações e NIF da empresa salvos com sucesso!', 'success');
                          setActiveTab('automation');
                        }}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition shadow-xs"
                      >
                        Salvar e Voltar para a Automação
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gateway Settings Quick Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">Gateways de Pagamento em Angola</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Multicaixa Express, PayPay África, Unitel Money e Afrimoney</p>
                      </div>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {gateways.filter(g => g.status === 'valid' && g.enabled).length} de {gateways.length} Validados
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Para receber pagamentos diretamente em sua conta bancária angolana ou carteira digital, suas chaves de API precisam estar configuradas e validadas pelo sistema antes do checkout.
                  </p>
                  <button
                    onClick={() => setActiveTab('gateways')}
                    className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Abrir Painel Completo de Configuração & Validação de Gateways
                  </button>
                </div>
              </div>
            )}

            {/* PAYMENT GATEWAYS CONFIGURATION TAB */}
            {activeTab === 'gateways' && (
              <PaymentGatewaysConfig
                gateways={gateways}
                onUpdateGateway={(updated) => {
                  setGateways(prev => prev.map(g => (g.id === updated.id ? updated : g)));
                }}
                onValidateGateway={validateGateway}
                onFillSandboxCredentials={fillSandboxCredentials}
                onNotify={showToast}
              />
            )}
          </main>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: AUTHENTICATION MULTICANAL (EMAIL, TELEFONE, GOOGLE, FACEBOOK, TWITTER) */}
      {/* ======================================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-700 to-amber-400 flex items-center justify-center text-white text-xs font-black">
                  V.Ex
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {authMode === 'login' ? 'Entrar na V.Ex' : 'Criar Conta na V.Ex'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Visão Exclusiva para Pequenas Empresas</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Social Logins */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleSocialAuth('google')}
                className="w-full py-2.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2.5 transition shadow-xs"
              >
                {/* Google SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continuar com o Google
              </button>

              <button
                onClick={() => handleSocialAuth('facebook')}
                className="w-full py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition shadow-xs"
              >
                {/* Facebook SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continuar com o Facebook
              </button>

              <button
                onClick={() => handleSocialAuth('twitter')}
                className="w-full py-2.5 px-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition shadow-xs"
              >
                {/* Twitter / X SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Continuar com o X (Twitter)
              </button>
            </div>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] uppercase font-bold text-slate-400">ou com email / telefone</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Email or Phone Toggle */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-3">
              <button
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  authMethod === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> E-mail
              </button>
              <button
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  authMethod === 'phone' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Telemóvel (+244)
              </button>
            </div>

            {/* Forms */}
            {authMethod === 'email' ? (
              <div className="space-y-3">
                {authMode === 'register' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Teu Nome Completo:</label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Ex: Manuel Silva"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">E-mail:</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="teuemail@exemplo.ao"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Palavra-passe:</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <button
                  onClick={handleEmailAuth}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition mt-2"
                >
                  {authMode === 'login' ? 'Iniciar Sessão' : 'Criar Conta com E-mail'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {!phoneOtpStep ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Número de Telemóvel (+244 Angola):</label>
                      <div className="flex gap-2">
                        <span className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center">
                          🇦🇴 +244
                        </span>
                        <input
                          type="tel"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          placeholder="923 000 000"
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePhoneAuth}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition mt-2 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar Código SMS / WhatsApp
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      Código de confirmação de 4 dígitos enviado para <strong>+244 {authPhone}</strong>!
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Código de Confirmação (OTP):</label>
                      <input
                        type="text"
                        value={phoneOtpCode}
                        onChange={(e) => setPhoneOtpCode(e.target.value)}
                        placeholder="Ex: 5821"
                        maxLength={4}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-center font-bold tracking-widest"
                      />
                    </div>
                    <button
                      onClick={handlePhoneAuth}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition mt-2"
                    >
                      Confirmar e Aceder à Conta
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => setAuthMode(prev => prev === 'login' ? 'register' : 'login')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                {authMode === 'login' ? 'Não tens conta? Criar nova conta' : 'Já tens conta? Iniciar sessão'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CHECKOUT ANGOLA (MCX, PAYPAY, UNITEL, AFRIMONEY) */}
      {/* ======================================================== */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  isLifetimeBiolink ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isLifetimeBiolink ? 'PAGAMENTO ÚNICO VITALÍCIO' : 'ALAVANCAGEM PERSONALIZADA'}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Finalizar Pagamento • V.Ex
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">{checkoutItemTitle}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isLifetimeBiolink ? 'Sem mensalidades futuras' : 'Campanha de Marketing & IA ativa'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-indigo-700">
                  {checkoutAmount.toLocaleString('pt-AO')} Kz
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">Moeda: Kz (AOA)</div>
              </div>
            </div>

            {paymentStep === 'form' && (() => {
              const selectedGateway = gateways.find(g => g.id === selectedPaymentMethod);
              const isCurrentGatewayValid = selectedGateway && selectedGateway.status === 'valid' && selectedGateway.enabled;

              return (
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">
                        Escolhe o Método de Pagamento em Angola:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCheckoutModal(false);
                          setActiveTab('gateways');
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" />
                        Configurar Gateways
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'mcx', name: 'Multicaixa Express', badge: 'MCX Débito/Ref' },
                        { id: 'paypay', name: 'PayPay África', badge: 'Carteira Digital' },
                        { id: 'unitel', name: 'Unitel Money', badge: 'Rede Unitel' },
                        { id: 'afrimoney', name: 'Afrimoney', badge: 'Rede Africell' }
                      ].map((m) => {
                        const gw = gateways.find(g => g.id === m.id);
                        const isValid = gw?.status === 'valid' && gw?.enabled;
                        const isInvalid = gw?.status === 'invalid';
                        return (
                          <button
                            key={m.id}
                            onClick={() => setSelectedPaymentMethod(m.id as any)}
                            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                              selectedPaymentMethod === m.id
                                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Smartphone className="w-4 h-4 text-indigo-600" />
                                <span className="font-extrabold text-xs">{m.name}</span>
                              </div>
                              <span className={`w-2 h-2 rounded-full ${isValid ? 'bg-emerald-500' : isInvalid ? 'bg-rose-500' : 'bg-amber-400'}`} />
                            </div>
                            <div className="flex items-center justify-between mt-1.5 text-[10px]">
                              <span className="text-slate-500">{m.badge}</span>
                              <span className={`font-bold ${isValid ? 'text-emerald-700' : isInvalid ? 'text-rose-600' : 'text-amber-700'}`}>
                                {isValid ? '✓ Validado' : isInvalid ? '✗ Inválido' : '! Pendente'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* GATEWAY VALIDATION STATUS CALLOUT */}
                  {!isCurrentGatewayValid ? (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
                      <div className="font-extrabold flex items-center gap-1.5 text-rose-950">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        Chaves do Gateway Não Validadas — Checkout Travado
                      </div>
                      <p className="leading-relaxed text-[11px] text-rose-800">
                        As credenciais de API para <strong>{selectedGateway?.name || selectedPaymentMethod.toUpperCase()}</strong> ainda não foram validadas no sistema. O sistema exige a validação prévia dessas chaves antes de liberar o checkout.
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCheckoutModal(false);
                            setActiveTab('gateways');
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Configurar Chaves na Tela de Gateways
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            fillSandboxCredentials(selectedPaymentMethod);
                          }}
                          className="px-3 py-1.5 bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          Preencher & Validar Sandbox Agora
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center justify-between font-bold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Credenciais {selectedGateway?.name} Validadas & Operacionais</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 uppercase font-extrabold">
                        {selectedGateway?.mode === 'live' ? 'Produção' : 'Sandbox'}
                      </span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    {selectedPaymentMethod === 'mcx' && (
                      <>
                        <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          Multicaixa Express (MCX)
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          Receberás uma notificação no teu telemóvel associado ao Multicaixa Express para autorizar o débito com o teu PIN, ou podes pagar via Referência de Pagamento.
                        </p>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Telemóvel associado ao MCX (+244):</label>
                          <input
                            type="tel"
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            placeholder="923 000 000"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                      </>
                    )}

                    {selectedPaymentMethod === 'paypay' && (
                      <>
                        <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-indigo-600" />
                          PayPay África
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          Transfere via carteira PayPay África pelo teu telemóvel ou confirma o débito imediato com saldo PayPay.
                        </p>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Telemóvel ou Conta PayPay:</label>
                          <input
                            type="tel"
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            placeholder="923 000 000"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                      </>
                    )}

                    {selectedPaymentMethod === 'unitel' && (
                      <>
                        <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          Unitel Money
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          Receberás um prompt USSD no teu telemóvel Unitel (*449#) para confirmar o pagamento de {checkoutAmount.toLocaleString('pt-AO')} Kz com o teu código PIN.
                        </p>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Número Unitel (+244 92x / 93x / 94x):</label>
                          <input
                            type="tel"
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            placeholder="923 000 000"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                      </>
                    )}

                    {selectedPaymentMethod === 'afrimoney' && (
                      <>
                        <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-purple-600" />
                          Afrimoney (Africell)
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          Autoriza a transação com a tua carteira Afrimoney diretamente através do teu número Africell.
                        </p>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Número Africell (+244 95x):</label>
                          <input
                            type="tel"
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            placeholder="950 000 000"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={!isCurrentGatewayValid}
                      onClick={handleProcessPayment}
                      className={`w-full py-3.5 rounded-xl text-sm font-extrabold transition flex items-center justify-center gap-2 shadow-md ${
                        isCurrentGatewayValid
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                      }`}
                    >
                      {isCurrentGatewayValid ? (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Pagar {checkoutAmount.toLocaleString('pt-AO')} Kz Agora
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Checkout Bloqueado • Valide as Chaves de {selectedGateway?.name || 'Pagamento'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}

            {paymentStep === 'processing' && (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <h4 className="font-extrabold text-base text-slate-900">Comunicando com o Gateway em Angola...</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  A gerar autorização para {selectedPaymentMethod.toUpperCase()} no número +244 {payerPhone}...
                </p>
              </div>
            )}

            {paymentStep === 'success' && generatedReference && (
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-extrabold text-base text-emerald-950">
                    Pedido Gerado com Sucesso!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    {selectedPaymentMethod === 'mcx'
                      ? 'Confirma a notificação no teu app Multicaixa Express ou paga com a referência abaixo:'
                      : selectedPaymentMethod === 'unitel'
                      ? 'Confirma o débito no prompt Unitel Money do teu telemóvel.'
                      : selectedPaymentMethod === 'afrimoney'
                      ? 'Confirma a autorização na tua carteira Afrimoney.'
                      : 'Pagamento PayPay pronto para autorização na app.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Entidade:</span>
                    <strong className="text-amber-300 text-sm">{generatedReference.entity}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Referência MCX:</span>
                    <strong className="text-amber-300 text-sm">{generatedReference.reference}</strong>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Montante:</span>
                    <strong className="text-emerald-400 text-base">{generatedReference.amount.toLocaleString('pt-AO')} Kz</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div><strong>Destino:</strong> {checkoutItemTitle}</div>
                  <div><strong>Estado:</strong> Aguardando validação automática da rede bancária</div>
                  {isLifetimeBiolink && (
                    <div className="text-indigo-600 font-bold">✨ A tua BioLink ficará ativa permanentemente sem custos extras!</div>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false);
                      showToast('Comprovativo e ativação registrados com sucesso na V.Ex!', 'success');
                    }}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Concluir e Voltar
                  </button>
                  <button
                    onClick={() => copyToClipboard(`ENTIDADE: ${generatedReference.entity}\nREFERÊNCIA: ${generatedReference.reference}\nMONTANTE: ${generatedReference.amount} Kz`, 'ref-copy')}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                  >
                    {copiedId === 'ref-copy' ? 'Copiada!' : 'Copiar Ref'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Adicionar Nova Palavra-Chave */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Cadastrar Nova Palavra-Chave Gatilho
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Quando um internauta comentar esta palavra, a IA responderá o post e enviará a DM com o link para o dono
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Palavra-Chave (ex: LINK, INFO, DESCONTO):</label>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value.toUpperCase())}
                  placeholder="EX: DESCONTO"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Resposta Pública no Comentário:</label>
                <textarea
                  value={newPublicReply}
                  onChange={(e) => setNewPublicReply(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mensagem Privada de DM + Link Direto:</label>
                <textarea
                  value={newDmMessage}
                  onChange={(e) => setNewDmMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (newKeyword.trim()) {
                    setRules(prev => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        keyword: newKeyword.trim(),
                        publicReply: newPublicReply,
                        dmMessage: newDmMessage,
                        isActive: true,
                        matchCount: 0
                      }
                    ]);
                    setShowAddModal(false);
                    setNewKeyword('');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
              >
                Salvar Gatilho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEGOCIAÇÃO DIRETA COM O DONO (50% EM SERVIÇOS DE TEMPO) */}
      <PriceNegotiationModal
        isOpen={showNegotiationModal}
        onClose={() => setShowNegotiationModal(false)}
        currentUser={currentUser}
        originalPriceKz={negotiationTargetPrice}
        serviceTitle={negotiationTargetTitle}
        onSubmitProposal={handleSubmitProposal}
      />

      {/* ======================================================== */}
      {/* BOTTOM MOBILE NAVIGATION BAR (PARA ANDROID E IOS) */}
      {/* ======================================================== */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around text-[10px] text-slate-400">
        <button
          onClick={() => {
            setViewMode('client');
            setActiveTab('feed');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            viewMode === 'client' && activeTab === 'feed'
              ? 'text-amber-400 font-extrabold'
              : 'hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <span>Feed Global</span>
        </button>

        <button
          onClick={() => {
            setViewMode('client');
            setActiveTab('pricing');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            viewMode === 'client' && activeTab === 'pricing'
              ? 'text-amber-400 font-extrabold'
              : 'hover:text-slate-200'
          }`}
        >
          <Ticket className="w-5 h-5" />
          <span>Bilhete 5.000</span>
        </button>

        <button
          onClick={() => {
            setViewMode('client');
            setActiveTab('biolink');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            viewMode === 'client' && activeTab === 'biolink'
              ? 'text-indigo-400 font-extrabold'
              : 'hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-5 h-5" />
          <span>BioLink</span>
        </button>

        <button
          onClick={() => {
            setViewMode('client');
            setActiveTab('automation');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            viewMode === 'client' && activeTab === 'automation'
              ? 'text-indigo-400 font-extrabold'
              : 'hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Robô DMs</span>
        </button>

        <button
          onClick={() => setViewMode(prev => prev === 'master_server' ? 'client' : 'master_server')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            viewMode === 'master_server'
              ? 'text-amber-400 font-extrabold'
              : 'hover:text-slate-200'
          }`}
        >
          <Server className="w-5 h-5" />
          <span>{viewMode === 'master_server' ? 'Console Mestre' : 'Painel Master'}</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-indigo-700">V.Ex Visão Exclusiva</span>
            <span>• Plataforma de Alavancagem de Negócios & IA</span>
          </div>
          <div>
            Pagamentos: Multicaixa Express, PayPay, Unitel Money, Afrimoney • Luanda, Angola
          </div>
        </div>
      </footer>
      {/* Floating Modern Toast Notification Container */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl shadow-2xl border bg-white/95 backdrop-blur-md flex items-start gap-3 transition-all">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />}
          <div className="flex-1 text-xs font-bold text-slate-800 leading-snug">
            {toast.message}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-700 font-bold text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
