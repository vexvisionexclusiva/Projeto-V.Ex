import React, { useState } from 'react';
import { GatewayConfig, PaymentMethodType } from '../types';
import {
  CreditCard,
  Smartphone,
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Key,
  Lock,
  Eye,
  EyeOff,
  Server,
  Zap,
  Globe,
  Save,
  HelpCircle,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';

interface PaymentGatewaysConfigProps {
  gateways: GatewayConfig[];
  onUpdateGateway: (gateway: GatewayConfig) => void;
  onValidateGateway: (gatewayId: PaymentMethodType) => Promise<boolean>;
  onFillSandboxCredentials: (gatewayId: PaymentMethodType) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const PaymentGatewaysConfig: React.FC<PaymentGatewaysConfigProps> = ({
  gateways,
  onUpdateGateway,
  onValidateGateway,
  onFillSandboxCredentials,
  onNotify
}) => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [validatingId, setValidatingId] = useState<PaymentMethodType | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState<string | null>(null);
  const [selectedGatewayTab, setSelectedGatewayTab] = useState<PaymentMethodType>('mcx');

  const toggleShowKey = (fieldId: string) => {
    setShowKeys(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const handleValidate = async (gatewayId: PaymentMethodType) => {
    setValidatingId(gatewayId);
    const success = await onValidateGateway(gatewayId);
    setValidatingId(null);
    if (onNotify) {
      if (success) {
        onNotify(`Gateway ${gatewayId.toUpperCase()} validado com sucesso! Checkout desbloqueado.`, 'success');
      } else {
        onNotify(`Falha na validação do gateway ${gatewayId.toUpperCase()}. Verifique as credenciais.`, 'error');
      }
    }
  };

  const handleCopyWebhook = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedWebhook(id);
    if (onNotify) onNotify('URL do Webhook copiada para a área de transferência!', 'info');
    setTimeout(() => setCopiedWebhook(null), 2500);
  };

  const validatedCount = gateways.filter(g => g.status === 'valid' && g.enabled).length;
  const currentGateway = gateways.find(g => g.id === selectedGatewayTab) || gateways[0];

  const getGatewayIcon = (id: PaymentMethodType) => {
    switch (id) {
      case 'mcx':
        return <CreditCard className="w-5 h-5 text-indigo-600" />;
      case 'paypay':
        return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'unitel':
        return <Phone className="w-5 h-5 text-emerald-600" />;
      case 'afrimoney':
        return <Phone className="w-5 h-5 text-purple-600" />;
    }
  };

  const getStatusBadge = (gateway: GatewayConfig) => {
    if (!gateway.enabled) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-500 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Desativado
        </span>
      );
    }
    if (gateway.status === 'valid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Chaves Validadas & Operacional
        </span>
      );
    }
    if (gateway.status === 'invalid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Chave Inválida (Bloqueia Checkout)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Pendente de Validação
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-xs">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Configuração de Gateways de Pagamento em Angola
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Insira e valide as credenciais de API bancárias para permitir o checkout com MCX, PayPay, Unitel Money e Afrimoney.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
            <div className="text-right">
              <div className="text-[10px] font-black uppercase text-slate-400">Estado do Checkout</div>
              <div className="text-xs font-black text-slate-800">
                <span className="text-emerald-600">{validatedCount}</span> de {gateways.length} Gateways Prontos
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${validatedCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          </div>
        </div>

        {/* Informative Security & Rule Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900 leading-relaxed">
          <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-extrabold">Regra de Segurança do Sistema:</strong> Antes de qualquer cliente ou usuário poder finalizar um pagamento no checkout, o sistema verifica e exige que as credenciais do gateway escolhido estejam <span className="underline font-bold">validadas e ativas</span>. Se as chaves estiverem incorretas ou vazias, o checkout é bloqueado com aviso imediato para proteger os fundos da sua empresa.
          </div>
        </div>
      </div>

      {/* Gateway Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {gateways.map((g) => {
          const isSelected = g.id === selectedGatewayTab;
          const isValid = g.status === 'valid' && g.enabled;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGatewayTab(g.id)}
              className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  {getGatewayIcon(g.id)}
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${isValid ? 'bg-emerald-500' : g.enabled ? 'bg-amber-400' : 'bg-slate-300'}`} />
              </div>
              <div className="mt-2.5">
                <div className="font-extrabold text-xs text-slate-900">{g.name}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {isValid ? '🟢 Operacional' : g.enabled ? '🟡 Aguardando Chaves' : '⚪ Desativado'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Selected Gateway Configuration Card */}
      {currentGateway && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          {/* Gateway Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                {getGatewayIcon(currentGateway.id)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">{currentGateway.name}</h2>
                  {getStatusBadge(currentGateway)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{currentGateway.providerTitle}</p>
              </div>
            </div>

            {/* Quick Controls: Active Toggle and Mode */}
            <div className="flex items-center gap-3">
              {/* Environment Mode: Sandbox vs Live */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => onUpdateGateway({ ...currentGateway, mode: 'test' })}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    currentGateway.mode === 'test'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sandbox (Testes)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateGateway({ ...currentGateway, mode: 'live' })}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    currentGateway.mode === 'live'
                      ? 'bg-emerald-600 text-white font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Produção (Ao Vivo)
                </button>
              </div>

              {/* Enable Gateway Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                <span>{currentGateway.enabled ? 'Ativo no Checkout' : 'Inativo'}</span>
                <input
                  type="checkbox"
                  checked={currentGateway.enabled}
                  onChange={(e) => onUpdateGateway({ ...currentGateway, enabled: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
            {currentGateway.description}
          </p>

          {/* Validation Status Notice */}
          {currentGateway.validationMessage && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                currentGateway.status === 'valid'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : currentGateway.status === 'invalid'
                  ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}
            >
              {currentGateway.status === 'valid' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : currentGateway.status === 'invalid' ? (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-extrabold">
                  {currentGateway.status === 'valid'
                    ? 'Chaves Prontas e Validadas com Sucesso'
                    : currentGateway.status === 'invalid'
                    ? 'Erro de Validação - Checkout Bloqueado'
                    : 'Aguardando Validação de Credenciais'}
                </div>
                <div className="mt-0.5">{currentGateway.validationMessage}</div>
                {currentGateway.lastValidatedAt && (
                  <div className="text-[10px] opacity-75 mt-1">
                    Última verificação: {currentGateway.lastValidatedAt}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CREDENTIAL FIELDS SPECIFIC TO GATEWAY */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              Chaves de Autenticação e Credenciais ({currentGateway.mode === 'test' ? 'Ambiente Sandbox' : 'Ambiente Produção'})
            </h3>

            {/* MULTICAIXA EXPRESS (MCX / EMIS) */}
            {currentGateway.id === 'mcx' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Código da Entidade EMIS (5 dígitos):
                  </label>
                  <input
                    type="text"
                    value={currentGateway.credentials.mcxEntityCode || ''}
                    maxLength={5}
                    placeholder="Ex: 00542"
                    onChange={(e) => {
                      onUpdateGateway({
                        ...currentGateway,
                        status: 'unconfigured',
                        credentials: { ...currentGateway.credentials, mcxEntityCode: e.target.value }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Fornecido pela EMIS no contrato de comerciante GPO (Ex: 00542).
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sub-Entidade / Terminal ID:
                  </label>
                  <input
                    type="text"
                    value={currentGateway.credentials.mcxSubEntity || ''}
                    placeholder="Ex: 999 ou TERM-01"
                    onChange={(e) => {
                      onUpdateGateway({
                        ...currentGateway,
                        status: 'unconfigured',
                        credentials: { ...currentGateway.credentials, mcxSubEntity: e.target.value }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Sub-código ou identificador de terminal POS / Web.
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chave Secreta de API EMIS (Assinatura HMAC / Secret):
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys['mcx_key'] ? 'text' : 'password'}
                      value={currentGateway.credentials.mcxApiKey || ''}
                      placeholder="mcx_live_sec_emis_..."
                      onChange={(e) => {
                        onUpdateGateway({
                          ...currentGateway,
                          status: 'unconfigured',
                          credentials: { ...currentGateway.credentials, mcxApiKey: e.target.value }
                        });
                      }}
                      className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('mcx_key')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['mcx_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Chave criptográfica usada para validar o token de débito do cartão Multicaixa.
                  </span>
                </div>
              </div>
            )}

            {/* PAYPAY ÁFRICA */}
            {currentGateway.id === 'paypay' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ID do Comerciante PayPay (Merchant ID):
                  </label>
                  <input
                    type="text"
                    value={currentGateway.credentials.paypayMerchantId || ''}
                    placeholder="Ex: PPAY-AO-884219"
                    onChange={(e) => {
                      onUpdateGateway({
                        ...currentGateway,
                        status: 'unconfigured',
                        credentials: { ...currentGateway.credentials, paypayMerchantId: e.target.value }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Identificador da conta empresarial no portal PayPay África.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Número do Telemóvel Receptor (+244):
                  </label>
                  <input
                    type="text"
                    value={currentGateway.credentials.paypayReceiverPhone || ''}
                    placeholder="Ex: 924551223"
                    onChange={(e) => {
                      onUpdateGateway({
                        ...currentGateway,
                        status: 'unconfigured',
                        credentials: { ...currentGateway.credentials, paypayReceiverPhone: e.target.value }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Número associado à carteira comercial para receber as liquidações.
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Token Secreto de API PayPay (Secret Key):
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys['paypay_key'] ? 'text' : 'password'}
                      value={currentGateway.credentials.paypayApiKey || ''}
                      placeholder="ppay_sec_key_..."
                      onChange={(e) => {
                        onUpdateGateway({
                          ...currentGateway,
                          status: 'unconfigured',
                          credentials: { ...currentGateway.credentials, paypayApiKey: e.target.value }
                        });
                      }}
                      className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('paypay_key')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['paypay_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* UNITEL MONEY (*449#) */}
            {currentGateway.id === 'unitel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Código de Comerciante Unitel (*449# Merchant Code):
                  </label>
                  <input
                    type="text"
                    value={currentGateway.credentials.unitelMerchantCode || ''}
                    placeholder="Ex: 449012"
                    onChange={(e) => {
                      onUpdateGateway({
                        ...currentGateway,
                        status: 'unconfigured',
                        credentials: { ...currentGateway.credentials, unitelMerchantCode: e.target.value }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Código de 6 dígitos que identifica sua empresa no menu *449# da Unitel.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Número de Agente / Terminal Unitel (+244):
                  </label>
                  <input
                    type="text"
                    value={currentGateway.credentials.unitelAgentNumber || ''}
                    placeholder="Ex: 923112233"
                    onChange={(e) => {
                      onUpdateGateway({
                        ...currentGateway,
                        status: 'unconfigured',
                        credentials: { ...currentGateway.credentials, unitelAgentNumber: e.target.value }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Número Unitel oficial registrado na carteira B2B do Unitel Money.
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chave de Autenticação Unitel Money B2B (Partner Secret):
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys['unitel_key'] ? 'text' : 'password'}
                      value={currentGateway.credentials.unitelApiKey || ''}
                      placeholder="unt_money_partner_..."
                      onChange={(e) => {
                        onUpdateGateway({
                          ...currentGateway,
                          status: 'unconfigured',
                          credentials: { ...currentGateway.credentials, unitelApiKey: e.target.value }
                        });
                      }}
                      className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('unitel_key')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['unitel_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AFRIMONEY (AFRICELL) */}
            {currentGateway.id === 'afrimoney' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ID do Comerciante Afrimoney (Africell Merchant ID):
                  </label>
                  <input
                    type="text"
                    value={currentGateway.credentials.afrimoneyMerchantId || ''}
                    placeholder="Ex: AFR-AO-55210 ou 950000000"
                    onChange={(e) => {
                      onUpdateGateway({
                        ...currentGateway,
                        status: 'unconfigured',
                        credentials: { ...currentGateway.credentials, afrimoneyMerchantId: e.target.value }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ID atribuído pelo departamento de soluções empresariais da Africell.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    PIN Operacional / Terminal Afrimoney (4-6 dígitos):
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys['afri_pin'] ? 'text' : 'password'}
                      value={currentGateway.credentials.afrimoneyTerminalPin || ''}
                      placeholder="Ex: 8842"
                      maxLength={6}
                      onChange={(e) => {
                        onUpdateGateway({
                          ...currentGateway,
                          status: 'unconfigured',
                          credentials: { ...currentGateway.credentials, afrimoneyTerminalPin: e.target.value }
                        });
                      }}
                      className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('afri_pin')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['afri_pin'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Código de segurança de transações para confirmações da carteira.
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chave de API Afrimoney Open API (HMAC Key / Token):
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys['afri_key'] ? 'text' : 'password'}
                      value={currentGateway.credentials.afrimoneyApiKey || ''}
                      placeholder="afri_sec_key_..."
                      onChange={(e) => {
                        onUpdateGateway({
                          ...currentGateway,
                          status: 'unconfigured',
                          credentials: { ...currentGateway.credentials, afrimoneyApiKey: e.target.value }
                        });
                      }}
                      className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('afri_key')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['afri_key'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Webhook Endpoint for Notifications */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                URL do Webhook de Notificação Automática (Callback):
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopyWebhook(
                    `https://api.vex.ao/webhooks/gateways/${currentGateway.id}/callback`,
                    currentGateway.id
                  )
                }
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
              >
                {copiedWebhook === currentGateway.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar URL
                  </>
                )}
              </button>
            </div>
            <code className="block p-2 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-700 truncate">
              https://api.vex.ao/webhooks/gateways/{currentGateway.id}/callback
            </code>
            <p className="text-[10px] text-slate-400">
              Cole este endereço no painel do banco/provedor para receber notificações automáticas em milissegundos quando o cliente pagar.
            </p>
          </div>

          {/* Validation & Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              disabled={validatingId === currentGateway.id}
              onClick={() => handleValidate(currentGateway.id)}
              className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {validatingId === currentGateway.id ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Testando Conexão e Validando Chaves...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Testar e Validar Credenciais de {currentGateway.name}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onFillSandboxCredentials(currentGateway.id)}
              className="w-full sm:w-auto py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              title="Carregar chaves de sandbox para testes"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Preencher Sandbox V.Ex
            </button>
          </div>
        </div>
      )}

      {/* Guide: How to obtain credentials in Angola */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          Como Obter as Credenciais Oficiais em Angola?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              Multicaixa Express (EMIS GPO)
            </div>
            Solicite o contrato de Comerciante GPO junto ao seu banco angolano (BAI, BFA, BIC, Standard Bank, etc.) ou diretamente à EMIS. Eles fornecerão o Código da Entidade (5 dígitos) e a Chave de API HMAC.
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              PayPay África
            </div>
            Cadastre sua conta comercial no aplicativo ou portal Web da PayPay África (Luanda). No menu Desenvolvedores & Integrações, gere seu Client ID e Token Secreto.
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Unitel Money (*449#)
            </div>
            Entre em contato com a equipe de Soluções Corporativas da Unitel em Luanda para solicitar a ativação do serviço de Comerciante B2B. Receberá o código USSD de 6 dígitos e as chaves de integração.
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-purple-600" />
              Afrimoney (Africell)
            </div>
            Procure uma loja Africell ou o portal Afrimoney Empresas. A Africell fornece um Merchant ID com chaves HMAC e PIN de segurança para processamento via API.
          </div>
        </div>
      </div>
    </div>
  );
};
