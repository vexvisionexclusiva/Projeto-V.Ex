import { PlatformUser, GlobalFeedItem, SubServerNode } from '../types';

export const INITIAL_TICKET_PRICE_KZ = 5000;

export const INITIAL_USERS: PlatformUser[] = [
  {
    id: 'usr_creator_001',
    name: 'Criador Central V.Ex',
    identifier: 'criador@visaoexclusiva.ao',
    authProvider: 'google',
    businessName: 'V.Ex Visão Exclusiva - Matriz',
    city: 'Luanda Centro, Angola',
    phone: '+244 923 000 001',
    role: 'creator',
    planStatus: 'Bilhete 5.000 Kz Ativo',
    hasTicket: true,
    ticketPricePaidKz: 5000,
    joinedDate: '01/10/2026',
    totalSpentKz: 0,
    isOnline: true,
    usageTimeMinutesToday: 245,
    totalUsageHours: 68.5,
    lastActive: 'Online Agora',
    leveragedItems: [
      {
        id: 'lev_c1',
        title: 'Campanha Institucional V.Ex Luanda',
        type: 'video',
        category: 'Tecnologia & IA',
        priceKz: 5000,
        status: 'Em Destaque',
        viewsCount: 38400,
        clicksCount: 1420,
        ordersCount: 310,
        createdAt: '01/10/2026',
        headline: 'A Revolução da Alavancagem Comercial em Angola'
      }
    ],
    activities: [
      {
        id: 'act_c1',
        timestamp: 'Hoje, às 10:18',
        action: 'Ajuste de Nó de Subservidor',
        details: 'Nó VEX-CORE-LUANDA-MASTER sincronizado com 100% de integridade',
        type: 'navigation'
      },
      {
        id: 'act_c2',
        timestamp: 'Hoje, às 09:42',
        action: 'Auditoria de Bilhetes',
        details: 'Verificação da precificação do bilhete padrão fixado em 5.000 Kz',
        type: 'ticket'
      },
      {
        id: 'act_c3',
        timestamp: 'Hoje, às 08:30',
        action: 'Início de Sessão Master',
        details: 'Acesso autenticado ao painel administrativo supremo via Google',
        type: 'auth'
      }
    ]
  },
  {
    id: 'usr_001',
    name: 'Manuel Gonçalves',
    identifier: 'manuel@docesluanda.ao',
    authProvider: 'google',
    businessName: 'Doces de Luanda',
    city: 'Luanda, Mutamba',
    phone: '+244 924 551 223',
    role: 'business_owner',
    planStatus: 'Alavancagem Ativa',
    hasTicket: true,
    ticketPricePaidKz: 5000,
    joinedDate: '02/10/2026',
    totalSpentKz: 85000,
    isOnline: true,
    usageTimeMinutesToday: 84,
    totalUsageHours: 19.4,
    lastActive: 'Online Agora',
    leveragedItems: [
      {
        id: 'lev_m1',
        title: 'Bolo Vulcão de Brigadeiro & Maracujá',
        type: 'video',
        category: 'Gastronomia & Restaurantes',
        priceKz: 14500,
        status: 'Em Destaque',
        viewsCount: 18450,
        clicksCount: 890,
        ordersCount: 64,
        createdAt: '02/10/2026',
        headline: 'O bolo que para qualquer feed de Luanda!'
      },
      {
        id: 'lev_m2',
        title: 'Flyer Box Presenteável Doces Finos',
        type: 'flyer',
        category: 'Gastronomia & Restaurantes',
        priceKz: 18000,
        status: 'Ativo',
        viewsCount: 9200,
        clicksCount: 410,
        ordersCount: 29,
        createdAt: '04/10/2026',
        headline: 'Surpreenda quem você ama hoje em Luanda'
      }
    ],
    activities: [
      {
        id: 'act_m1',
        timestamp: 'Hoje, às 10:05',
        action: 'Publicação no Feed Global',
        details: 'Publicou novo vídeo promocional com hook viral para toda Angola',
        type: 'feed'
      },
      {
        id: 'act_m2',
        timestamp: 'Hoje, às 09:12',
        action: 'Recebeu Pedidos via WhatsApp',
        details: '8 clientes clicaram no botão WhatsApp através do Feed Global',
        type: 'leverage'
      },
      {
        id: 'act_m3',
        timestamp: 'Ontem, às 17:30',
        action: 'Pagamento Multicaixa Express',
        details: 'Pagou 49.000 Kz para alavancagem de 15 dias via MCX',
        type: 'payment'
      },
      {
        id: 'act_m4',
        timestamp: '02/10/2026',
        action: 'Compra de Bilhete de Entrada',
        details: 'Comprou Bilhete de Acesso por 5.000 Kz via Unitel Money',
        type: 'ticket'
      }
    ]
  },
  {
    id: 'usr_002',
    name: 'Esperança Nzuzi',
    identifier: '+244 924 112 233',
    authProvider: 'phone',
    businessName: 'Boutique Elegance Kilamba',
    city: 'Kilamba, Luanda',
    phone: '+244 924 112 233',
    role: 'business_owner',
    planStatus: 'BioLink Vitalícia',
    hasTicket: true,
    ticketPricePaidKz: 5000,
    joinedDate: '04/10/2026',
    totalSpentKz: 23500,
    isOnline: false,
    usageTimeMinutesToday: 35,
    totalUsageHours: 14.8,
    lastActive: 'Há 18 min',
    leveragedItems: [
      {
        id: 'lev_e1',
        title: 'Vestido Elegance Seda Luanda Chic',
        type: 'flyer',
        category: 'Moda, Roupas & Calçados',
        priceKz: 26000,
        status: 'Em Destaque',
        viewsCount: 22100,
        clicksCount: 1140,
        ordersCount: 88,
        createdAt: '04/10/2026',
        headline: 'Coleção Exclusiva Festas & Eventos Kilamba'
      }
    ],
    activities: [
      {
        id: 'act_e1',
        timestamp: 'Hoje, às 09:50',
        action: 'Edição de Catálogo BioLink',
        details: 'Atualizou fotos e preços de vestidos na BioLink Vitalícia',
        type: 'leverage'
      },
      {
        id: 'act_e2',
        timestamp: 'Ontem, às 14:20',
        action: 'Alavancagem de Flyer',
        details: 'Lançou flyer com 25% de desconto no Feed Global',
        type: 'feed'
      },
      {
        id: 'act_e3',
        timestamp: '04/10/2026',
        action: 'Compra de Bilhete de Entrada',
        details: 'Adquiriu bilhete inicial por 5.000 Kz via Afrimoney',
        type: 'ticket'
      }
    ]
  },
  {
    id: 'usr_003',
    name: 'Carlos Mateus',
    identifier: 'carlos.m@facebook.com',
    authProvider: 'facebook',
    businessName: 'Barbearia VIP Talatona',
    city: 'Talatona, Luanda',
    phone: '+244 931 445 667',
    role: 'business_owner',
    planStatus: 'Alavancagem Ativa',
    hasTicket: true,
    ticketPricePaidKz: 5000,
    joinedDate: '05/10/2026',
    totalSpentKz: 54000,
    isOnline: true,
    usageTimeMinutesToday: 112,
    totalUsageHours: 22.1,
    lastActive: 'Online Agora',
    leveragedItems: [
      {
        id: 'lev_c1_barb',
        title: 'Combo Corte Degradê VIP + Barboterapia',
        type: 'video',
        category: 'Serviços Especializados',
        priceKz: 8500,
        status: 'Em Destaque',
        viewsCount: 16800,
        clicksCount: 780,
        ordersCount: 52,
        createdAt: '05/10/2026',
        headline: 'O visual que homens de sucesso em Talatona escolhem'
      }
    ],
    activities: [
      {
        id: 'act_c_1',
        timestamp: 'Hoje, às 10:10',
        action: 'Configuração do Robô de DM',
        details: 'Adicionou gatilho "BARBA" com envio automático de localização',
        type: 'leverage'
      },
      {
        id: 'act_c_2',
        timestamp: 'Ontem, às 18:00',
        action: 'Alavancou Vídeo no Feed',
        details: 'Postou vídeo de transformação de visual no Feed Global V.Ex',
        type: 'feed'
      },
      {
        id: 'act_c_3',
        timestamp: '05/10/2026',
        action: 'Compra de Bilhete de Entrada',
        details: 'Comprou Bilhete de 5.000 Kz via PayPay África',
        type: 'ticket'
      }
    ]
  },
  {
    id: 'usr_004',
    name: 'Bernardo Kipupa',
    identifier: '+244 945 889 001',
    authProvider: 'phone',
    businessName: 'Restaurante Sabor da Terra Huambo',
    city: 'Huambo, Cidade Alta',
    phone: '+244 945 889 001',
    role: 'business_owner',
    planStatus: 'Bilhete 5.000 Kz Ativo',
    hasTicket: true,
    ticketPricePaidKz: 5000,
    joinedDate: '06/10/2026',
    totalSpentKz: 5000,
    isOnline: false,
    usageTimeMinutesToday: 18,
    totalUsageHours: 5.6,
    lastActive: 'Há 45 min',
    leveragedItems: [
      {
        id: 'lev_b1',
        title: 'Funge de Milho Tradicional com Moamba de Galinha',
        type: 'flyer',
        category: 'Gastronomia & Restaurantes',
        priceKz: 6500,
        status: 'Ativo',
        viewsCount: 7400,
        clicksCount: 320,
        ordersCount: 38,
        createdAt: '06/10/2026',
        headline: 'O verdadeiro sabor do planalto central na sua mesa!'
      }
    ],
    activities: [
      {
        id: 'act_b_1',
        timestamp: 'Hoje, às 08:40',
        action: 'Visualização do Feed Global',
        details: 'Navegou por 15 minutos analisando ofertas de outros empreendedores',
        type: 'navigation'
      },
      {
        id: 'act_b_2',
        timestamp: '06/10/2026',
        action: 'Compra de Bilhete de Entrada',
        details: 'Pagou 5.000 Kz pelo Bilhete via Multicaixa Express',
        type: 'ticket'
      }
    ]
  },
  {
    id: 'usr_005',
    name: 'Ana Cristina Faria',
    identifier: '@anacristina_ao',
    authProvider: 'twitter',
    businessName: 'Estética Glow Angola',
    city: 'Maianga, Luanda',
    phone: '+244 928 333 444',
    role: 'business_owner',
    planStatus: 'Gratuito',
    hasTicket: false,
    ticketPricePaidKz: 0,
    joinedDate: '07/10/2026',
    totalSpentKz: 0,
    isOnline: true,
    usageTimeMinutesToday: 42,
    totalUsageHours: 3.2,
    lastActive: 'Online Agora',
    leveragedItems: [],
    activities: [
      {
        id: 'act_a1',
        timestamp: 'Hoje, às 10:15',
        action: 'Simulação de Alavancagem',
        details: 'Calculou pacote de 15 dias para tratamento facial de pele',
        type: 'leverage'
      },
      {
        id: 'act_a2',
        timestamp: 'Hoje, às 09:30',
        action: 'Tentativa de Compra de Bilhete',
        details: 'Abriu tela de Bilhete (5.000 Kz) aguardando emissão de referência',
        type: 'ticket'
      }
    ]
  },
  {
    id: 'usr_006',
    name: 'Teresa Mukwa',
    identifier: 'teresa.mukwa@gmail.com',
    authProvider: 'google',
    businessName: 'Mukwa Acessórios Benguela',
    city: 'Benguela, Zona da Praia Morena',
    phone: '+244 939 778 899',
    role: 'business_owner',
    planStatus: 'Bilhete 5.000 Kz Ativo',
    hasTicket: true,
    ticketPricePaidKz: 5000,
    joinedDate: '07/10/2026',
    totalSpentKz: 5000,
    isOnline: false,
    usageTimeMinutesToday: 12,
    totalUsageHours: 4.1,
    lastActive: 'Há 2 horas',
    leveragedItems: [
      {
        id: 'lev_t1',
        title: 'Kit Bolsas Artesanais em Couro Feitas à Mão',
        type: 'product_launch',
        category: 'Moda, Roupas & Calçados',
        priceKz: 32000,
        status: 'Ativo',
        viewsCount: 5800,
        clicksCount: 260,
        ordersCount: 19,
        createdAt: '07/10/2026',
        headline: 'Design autêntico de Benguela com frete rápido para Luanda'
      }
    ],
    activities: [
      {
        id: 'act_t1',
        timestamp: 'Ontem, às 16:10',
        action: 'Publicação no Feed Global',
        details: 'Cadastrou novo kit de bolsas de couro no catálogo nacional',
        type: 'feed'
      },
      {
        id: 'act_t2',
        timestamp: '07/10/2026',
        action: 'Compra de Bilhete de Entrada',
        details: 'Comprou Bilhete de 5.000 Kz via Unitel Money',
        type: 'ticket'
      }
    ]
  }
];

export const INITIAL_FEED_ITEMS: GlobalFeedItem[] = [
  {
    id: 'feed_001',
    creatorId: 'usr_001',
    creatorName: 'Manuel Gonçalves',
    creatorBusiness: 'Doces de Luanda',
    creatorCity: 'Luanda, Mutamba',
    creatorPhone: '244924551223',
    creatorAvatarColor: 'from-amber-500 to-orange-600',
    title: 'Bolo Vulcão de Brigadeiro & Maracujá Cremoso',
    type: 'video',
    category: 'Gastronomia & Restaurantes',
    description: 'Bolo com recheio vulcânico que escorre na hora de cortar! Massa fofa e artesanal feita diariamente. Acompanha cobertura extra de brigadeiro belga.',
    priceKz: 14500,
    originalPriceKz: 17500,
    badgeText: '🔥 MAIS VISTO EM LUANDA',
    mediaTheme: 'amber',
    videoHook: 'Pára de rolar o feed agora! Se vives em Luanda e tens vontade de doce, olha como este vulcão escorre!',
    videoScenesCount: 4,
    flyerHeadline: 'O BOLO MAIS DESEJADO DA CAPITAL',
    flyerCtaText: 'Comenta "VULCAO" para receber o cardápio no Direct ou pede no WhatsApp!',
    leverageDurationDays: 15,
    leverageDaysRemaining: 11,
    viewsCount: 18450,
    likesCount: 924,
    sharesCount: 318,
    ordersCount: 64,
    isCreatorBoosted: true,
    createdAt: 'Há 2 dias'
  },
  {
    id: 'feed_002',
    creatorId: 'usr_002',
    creatorName: 'Esperança Nzuzi',
    creatorBusiness: 'Boutique Elegance Kilamba',
    creatorCity: 'Kilamba, Luanda',
    creatorPhone: '244924112233',
    creatorAvatarColor: 'from-rose-500 to-pink-600',
    title: 'Vestido Longo Elegance Seda Luanda Chic',
    type: 'flyer',
    category: 'Moda, Roupas & Calçados',
    description: 'Perfeito para eventos, jantares e casamentos. Tecido importado anti-amasso com caimento impecável que valoriza a silhueta. Disponível nos tamanhos S ao XXL.',
    priceKz: 26000,
    originalPriceKz: 32000,
    badgeText: '👗 DESCONTO EXCLUSIVO',
    mediaTheme: 'rose',
    flyerHeadline: 'ELEVE A SUA ELEGÂNCIA NESTA SEMANA',
    flyerCtaText: 'Chama no WhatsApp para reservar o seu tamanho antes que esgote!',
    leverageDurationDays: 30,
    leverageDaysRemaining: 24,
    viewsCount: 22100,
    likesCount: 1410,
    sharesCount: 452,
    ordersCount: 88,
    isCreatorBoosted: true,
    createdAt: 'Há 4 dias'
  },
  {
    id: 'feed_003',
    creatorId: 'usr_003',
    creatorName: 'Carlos Mateus',
    creatorBusiness: 'Barbearia VIP Talatona',
    creatorCity: 'Talatona, Luanda',
    creatorPhone: '244931445667',
    creatorAvatarColor: 'from-blue-600 to-indigo-700',
    title: 'Combo Executivo: Corte Degradê + Barboterapia com Toalha Quente',
    type: 'video',
    category: 'Serviços Especializados',
    description: 'Atendimento premium com direito a bebida de cortesia, toalha quente com óleos essenciais e acabamento com navalha afiada por barbeiros premiados.',
    priceKz: 8500,
    originalPriceKz: 11000,
    badgeText: '💈 EXPERIÊNCIA VIP',
    mediaTheme: 'indigo',
    videoHook: 'Homem que se cuida fecha mais negócios. Vê este antes e depois feito em Talatona!',
    videoScenesCount: 3,
    flyerHeadline: 'TRANSFORME A SUA IMAGEM PESSOAL',
    flyerCtaText: 'Agendamento rápido no WhatsApp com horário marcado sem fila de espera!',
    leverageDurationDays: 15,
    leverageDaysRemaining: 9,
    viewsCount: 16800,
    likesCount: 856,
    sharesCount: 219,
    ordersCount: 52,
    isCreatorBoosted: false,
    createdAt: 'Há 3 dias'
  },
  {
    id: 'feed_004',
    creatorId: 'usr_004',
    creatorName: 'Bernardo Kipupa',
    creatorBusiness: 'Restaurante Sabor da Terra Huambo',
    creatorCity: 'Huambo, Cidade Alta',
    creatorPhone: '244945889001',
    creatorAvatarColor: 'from-emerald-600 to-teal-700',
    title: 'Moamba de Galinha da Terra com Funge de Milho Quente',
    type: 'flyer',
    category: 'Gastronomia & Restaurantes',
    description: 'Feita com galinha caipira selecionada no óleo de palma puro e quiabos tenros do Huambo. Acompanha funge fumegante e pirão regional.',
    priceKz: 6500,
    originalPriceKz: 8000,
    badgeText: '🥘 SABOR TRADICIONAL',
    mediaTheme: 'emerald',
    flyerHeadline: 'O VERDADEIRO ALMOÇO DO PLANALTO CENTRAL',
    flyerCtaText: 'Entrega rápida em todo o Huambo ou reserva de mesa via WhatsApp!',
    leverageDurationDays: 7,
    leverageDaysRemaining: 4,
    viewsCount: 7400,
    likesCount: 540,
    sharesCount: 145,
    ordersCount: 38,
    isCreatorBoosted: false,
    createdAt: 'Há 1 dia'
  },
  {
    id: 'feed_005',
    creatorId: 'usr_006',
    creatorName: 'Teresa Mukwa',
    creatorBusiness: 'Mukwa Acessórios Benguela',
    creatorCity: 'Benguela, Praia Morena',
    creatorPhone: '244939778899',
    creatorAvatarColor: 'from-purple-600 to-pink-700',
    title: 'Kit Bolsas Artesanais em Couro Genuíno de Benguela',
    type: 'product_launch',
    category: 'Moda, Roupas & Calçados',
    description: 'Produzidas manualmente por artesãos de Benguela com acabamento de alta durabilidade e costura reforçada. Enviamos para Luanda em 24h via transportadora.',
    priceKz: 32000,
    originalPriceKz: 38000,
    badgeText: '👜 ARTESANATO ANGOLANO',
    mediaTheme: 'purple',
    flyerHeadline: 'ARTE, COURO E EXCLUSIVIDADE',
    flyerCtaText: 'Clique e veja o catálogo completo com frete seguro para todo o país!',
    leverageDurationDays: 15,
    leverageDaysRemaining: 13,
    viewsCount: 5800,
    likesCount: 420,
    sharesCount: 98,
    ordersCount: 19,
    isCreatorBoosted: false,
    createdAt: 'Ontem'
  }
];

export const INITIAL_SUBSERVERS: SubServerNode[] = [
  {
    id: 'node-01',
    name: 'VEX-CORE-LUANDA-MASTER',
    region: 'Luanda Centro (Nó Principal Orquestrador)',
    status: 'online',
    role: 'Orquestrador Central & Banco de Dados de Usuários',
    cpu: 24,
    memory: 42,
    latencyMs: 14,
    activeWorkers: 24
  },
  {
    id: 'node-02',
    name: 'VEX-GLOBAL-FEED-DISTRIBUTOR',
    region: 'Cluster de Distribuição de Feed Cruzado',
    status: 'online',
    role: 'Motor de Entrega Mútua de Anúncios e Vídeos',
    cpu: 58,
    memory: 64,
    latencyMs: 19,
    activeWorkers: 52
  },
  {
    id: 'node-03',
    name: 'VEX-PAYMENTS-MCX-GATEWAY',
    region: 'Bridge Bancária Nacional (EMIS / MCX / Unitel / Afrimoney)',
    status: 'online',
    role: 'Processador de Bilhetes (5.000 Kz) e Alavancagem',
    cpu: 18,
    memory: 32,
    latencyMs: 16,
    activeWorkers: 16
  },
  {
    id: 'node-04',
    name: 'VEX-AI-COMMENTS-ENGINE',
    region: 'Cluster de IA (Processamento Social)',
    status: 'online',
    role: 'Motor de Roteiros, Flyers e Respostas de DMs',
    cpu: 62,
    memory: 71,
    latencyMs: 25,
    activeWorkers: 68
  },
  {
    id: 'node-05',
    name: 'VEX-REGIONAL-BENGUELA-HUAMBO',
    region: 'Nó Sul & Planalto Central',
    status: 'online',
    role: 'Cache e Distribuição Regional de Mídia',
    cpu: 22,
    memory: 34,
    latencyMs: 32,
    activeWorkers: 12
  }
];

export const INITIAL_NEGOTIATIONS = [
  {
    id: 'neg_001',
    userId: 'usr_001',
    userName: 'Manuel Gonçalves',
    businessName: 'Doces de Luanda',
    phone: '244924551223',
    originalPriceKz: 85000,
    offeredCashKz: 42500,
    serviceOrTimeProposal: 'Pagar 50% em Kwanzas (42.500 Kz) e os outros 50% em fornecimento de doces gourmet e catering para o evento presencial da V.Ex em Luanda (equivalente a 15 horas de trabalho gastronômico).',
    status: 'Aprovado 50%' as const,
    createdAt: 'Hoje, às 09:15',
    ownerNotes: 'Acordo firmado! Permuta válida para o encontro de networking de novembro.'
  },
  {
    id: 'neg_002',
    userId: 'usr_005',
    userName: 'Ana Cristina Faria',
    businessName: 'Estética Glow Angola',
    phone: '244928333444',
    originalPriceKz: 49000,
    offeredCashKz: 24500,
    serviceOrTimeProposal: 'Proposta de pagar 50% em dinheiro (24.500 Kz via MCX) e 50% em prestação de serviços de produção de conteúdo e gravação de depoimentos em vídeo (10 horas dedicadas) promovendo o app no Instagram.',
    status: 'Aguardando Avaliação do Dono' as const,
    createdAt: 'Hoje, às 10:20'
  }
];

export const INITIAL_GATEWAYS: import('../types').GatewayConfig[] = [
  {
    id: 'mcx',
    name: 'Multicaixa Express',
    providerTitle: 'EMIS GPO (Gateway de Pagamentos Online)',
    description: 'Receba pagamentos com débito automático no cartão Multicaixa Express e referências bancárias automáticas.',
    enabled: true,
    mode: 'test',
    status: 'valid',
    lastValidatedAt: 'Hoje às 10:30',
    validationMessage: 'Credenciais EMIS Sandbox validadas com sucesso (HTTP 200 - Handshake OK).',
    credentials: {
      mcxEntityCode: '00542',
      mcxSubEntity: '999',
      mcxApiKey: 'mcx_live_sec_emis_894372948123',
      mcxTerminalId: 'TERM-LUA-01'
    }
  },
  {
    id: 'paypay',
    name: 'PayPay África',
    providerTitle: 'PayPay África Merchant API',
    description: 'Receba pagamentos instantâneos via carteira digital PayPay África com QR Code e débitos direto em conta.',
    enabled: true,
    mode: 'test',
    status: 'valid',
    lastValidatedAt: 'Hoje às 10:28',
    validationMessage: 'Conexão com PayPay África OK (Conta Mercador Ativa e Pronta).',
    credentials: {
      paypayMerchantId: 'PPAY-AO-884219',
      paypayApiKey: 'ppay_sec_key_771928304912',
      paypayReceiverPhone: '924551223'
    }
  },
  {
    id: 'unitel',
    name: 'Unitel Money',
    providerTitle: 'Unitel Money B2B Gateway (*449#)',
    description: 'Cobranças automáticas via prompt USSD (*449#) direto no telemóvel dos clientes Unitel em toda Angola.',
    enabled: true,
    mode: 'test',
    status: 'valid',
    lastValidatedAt: 'Hoje às 10:25',
    validationMessage: 'Canal USSD *449# conectado com sucesso (B2B Terminal Ativo).',
    credentials: {
      unitelMerchantCode: '449012',
      unitelApiKey: 'unt_money_partner_9921820491',
      unitelAgentNumber: '923112233'
    }
  },
  {
    id: 'afrimoney',
    name: 'Afrimoney',
    providerTitle: 'Africell Afrimoney Open API',
    description: 'Receba com agilidade de clientes da rede Africell através da carteira Afrimoney com autorização por código PIN.',
    enabled: false,
    mode: 'test',
    status: 'unconfigured',
    lastValidatedAt: undefined,
    validationMessage: 'Ainda não configurado. Insira as credenciais do comerciante Afrimoney e valide as chaves.',
    credentials: {
      afrimoneyMerchantId: '',
      afrimoneyApiKey: '',
      afrimoneyTerminalPin: ''
    }
  }
];
