export type AuthProviderType = 'email' | 'phone' | 'google' | 'facebook' | 'twitter';
export type PaymentMethodType = 'mcx' | 'paypay' | 'unitel' | 'afrimoney';

export interface LeveragedItem {
  id: string;
  title: string;
  type: 'video' | 'flyer' | 'product_launch';
  category: string;
  priceKz: number;
  status: 'Ativo' | 'Pausado' | 'Em Destaque' | 'Concluído';
  viewsCount: number;
  clicksCount: number;
  ordersCount: number;
  createdAt: string;
  headline?: string;
  badge?: string;
}

export interface UserActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'auth' | 'leverage' | 'payment' | 'navigation' | 'ticket' | 'feed';
}

export interface PlatformUser {
  id: string;
  name: string;
  identifier: string; // email or phone
  authProvider: AuthProviderType;
  businessName: string;
  city: string;
  phone: string;
  role: 'creator' | 'superadmin' | 'business_owner';
  planStatus: 'Bilhete 5.000 Kz Ativo' | 'Alavancagem Ativa' | 'BioLink Vitalícia' | 'Gratuito' | 'Bloqueado';
  hasTicket: boolean;
  ticketPricePaidKz: number;
  joinedDate: string;
  totalSpentKz: number;
  isOnline: boolean;
  usageTimeMinutesToday: number;
  totalUsageHours: number;
  lastActive: string;
  leveragedItems: LeveragedItem[];
  activities: UserActivityLog[];
}

export interface GlobalFeedItem {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorBusiness: string;
  creatorCity: string;
  creatorPhone: string;
  creatorAvatarColor: string;
  title: string;
  type: 'video' | 'flyer' | 'product_launch';
  category: string;
  description: string;
  priceKz: number;
  originalPriceKz?: number;
  badgeText: string;
  mediaTheme: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate';
  videoHook?: string;
  videoScenesCount?: number;
  flyerHeadline?: string;
  flyerCtaText?: string;
  leverageDurationDays: number;
  leverageDaysRemaining: number;
  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  ordersCount: number;
  isCreatorBoosted: boolean;
  createdAt: string;
}

export interface SubServerNode {
  id: string;
  name: string;
  region: string;
  status: 'online' | 'degraded' | 'syncing';
  role: string;
  cpu: number;
  memory: number;
  latencyMs: number;
  activeWorkers: number;
}

export interface PriceNegotiationRequest {
  id: string;
  userId: string;
  userName: string;
  businessName: string;
  phone: string;
  originalPriceKz: number;
  offeredCashKz: number;
  serviceOrTimeProposal: string;
  status: 'Aguardando Avaliação do Dono' | 'Aprovado 50%' | 'Contraproposta' | 'Recusado';
  createdAt: string;
  ownerNotes?: string;
}

export interface BusinessProfile {
  name: string;
  niche: string;
  phone: string;
  instagram: string;
  city: string;
  nif?: string;
}

export function validateAngolanNIF(nif: string): { isValid: boolean; type?: 'Empresa (Pessoa Coletiva)' | 'Pessoa Singular'; message: string } {
  const clean = (nif || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!clean) {
    return { isValid: false, message: 'NIF não pode estar vazio.' };
  }
  
  // Empresa / Pessoa Coletiva: exatamente 10 dígitos numéricos (comum iniciar com 5 em Angola)
  if (/^\d{10}$/.test(clean)) {
    return {
      isValid: true,
      type: 'Empresa (Pessoa Coletiva)',
      message: 'NIF Empresarial Válido (Pessoa Coletiva AGT)'
    };
  }
  
  // Pessoa Singular: Formato de Bilhete de Identidade Angolano (9 dígitos + 2 letras maiúsculas + 3 dígitos)
  if (/^\d{9}[A-Z]{2}\d{3}$/.test(clean)) {
    return {
      isValid: true,
      type: 'Pessoa Singular',
      message: 'NIF Singular Válido (Formato BI AGT)'
    };
  }
  
  return {
    isValid: false,
    message: 'NIF inválido. Padrão AGT: 10 dígitos numéricos para Empresa (ex: 5417089123) ou 14 caracteres formato BI (ex: 004819231LA042).'
  };
}

export interface CommentRule {
  id: string;
  keyword: string;
  publicReply: string;
  dmMessage: string;
  isActive: boolean;
  matchCount: number;
}

export interface LeadRecord {
  id: string;
  username: string;
  comment: string;
  keyword: string;
  timestamp: string;
  status: 'DM Enviada' | 'Conversou no Whats' | 'Venda Fechada';
  phone?: string;
}

export interface FollowUpReminder {
  id: string;
  leadId: string;
  leadUsername: string;
  keyword: string;
  productName: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  suggestedMessage: string;
  status: 'Pendente' | 'Concluído' | 'Cancelado';
  priority: 'Alta' | 'Média' | 'Normal';
  channel: 'WhatsApp' | 'Instagram Direct';
  createdAt: string;
}

export type GatewayValidationStatus = 'unconfigured' | 'validating' | 'valid' | 'invalid';

export interface GatewayCredentials {
  // Multicaixa Express (MCX / EMIS GPO)
  mcxEntityCode?: string;
  mcxSubEntity?: string;
  mcxApiKey?: string;
  mcxTerminalId?: string;

  // PayPay África
  paypayMerchantId?: string;
  paypayApiKey?: string;
  paypayReceiverPhone?: string;

  // Unitel Money (*449#)
  unitelMerchantCode?: string;
  unitelApiKey?: string;
  unitelAgentNumber?: string;

  // Afrimoney (Africell)
  afrimoneyMerchantId?: string;
  afrimoneyApiKey?: string;
  afrimoneyTerminalPin?: string;
}

export interface GatewayConfig {
  id: PaymentMethodType;
  name: string;
  providerTitle: string;
  description: string;
  enabled: boolean;
  mode: 'test' | 'live';
  status: GatewayValidationStatus;
  lastValidatedAt?: string;
  validationMessage?: string;
  credentials: GatewayCredentials;
}
