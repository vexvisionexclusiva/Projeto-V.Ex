import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RefreshCw,
  Send,
  Sliders,
  Radio,
  Check,
  Copy,
  Settings,
  Clock,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { FCMConfig } from '../hooks/useFcmPushNotifications';

interface PushNotificationManagerProps {
  permission: NotificationPermission;
  fcmToken: string;
  fcmConfig: FCMConfig;
  swRegistered: boolean;
  backgroundSimulation: boolean;
  onRequestPermission: () => Promise<NotificationPermission>;
  onSendTestPush: (title: string, body: string) => Promise<boolean>;
  onToggleBackgroundSimulation: (active?: boolean) => void;
  onUpdateFcmConfig: (config: Partial<FCMConfig>) => void;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  permission,
  fcmToken,
  fcmConfig,
  swRegistered,
  backgroundSimulation,
  onRequestPermission,
  onSendTestPush,
  onToggleBackgroundSimulation,
  onUpdateFcmConfig,
  onNotify
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [countdownTest, setCountdownTest] = useState<number | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Editable FCM config form state
  const [configForm, setConfigForm] = useState<FCMConfig>(fcmConfig);

  // Notification category preferences
  const [notifyNewLeads, setNotifyNewLeads] = useState(true);
  const [notifyAutomatedComments, setNotifyAutomatedComments] = useState(true);
  const [notifyFollowUps, setNotifyFollowUps] = useState(true);
  const [notifyPayments, setNotifyPayments] = useState(true);

  // Push Delivery Stats
  const [pushStats, setPushStats] = useState({
    sentCount: 148,
    openRate: '91.2%',
    avgLatency: '120ms',
    activeDevices: 3
  });

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(fcmToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
    if (onNotify) onNotify('Token FCM copiado para a área de transferência!', 'info');
  };

  const handleImmediateTestPush = async () => {
    setIsSimulating(true);
    const title = '🔥 Novo Lead Captado em Segundo Plano!';
    const body = '@mariana_luanda acabou de comentar "QUERO" e recebeu a DM com link do produto!';
    
    await onSendTestPush(title, body);
    setIsSimulating(false);
    setPushStats(prev => ({ ...prev, sentCount: prev.sentCount + 1 }));

    if (onNotify) {
      onNotify('Notificação push enviada via FCM Service Worker!', 'success');
    }
  };

  // Delayed push test: perfect for testing background behavior! User clicks, switches tabs, and sees notification pop up.
  const handleDelayedBackgroundTest = () => {
    let timeLeft = 4;
    setCountdownTest(timeLeft);
    if (onNotify) {
      onNotify('Alterne para outra aba agora! A notificação de segundo plano chegará em 4 segundos.', 'info');
    }

    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdownTest(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        setCountdownTest(null);
        setPushStats(prev => ({ ...prev, sentCount: prev.sentCount + 1 }));

        const title = '⚡ [SEGUNDO PLANO] Alerta de Lead Captado • V.Ex';
        const body = '@cliente_luanda comentou "PREÇO" enquanto o app estava minimizado!';
        onSendTestPush(title, body);
      }
    }, 1000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFcmConfig(configForm);
    setShowConfigModal(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 shadow-xs shrink-0">
            <BellRing className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Notificações Push & Firebase Cloud Messaging (FCM)
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  permission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {permission === 'granted' ? '🟢 Push Ativo & SW Pronto' : '🟡 Configuração Pendente'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Receba alertas no telemóvel ou computador mesmo com o aplicativo fechado ou em segundo plano quando novos comentários forem automatizados e leads captados.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {permission !== 'granted' ? (
            <button
              type="button"
              onClick={onRequestPermission}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              Ativar Notificações no Dispositivo
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isSimulating || countdownTest !== null}
                onClick={handleImmediateTestPush}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Disparar Teste Imediato
              </button>

              <button
                type="button"
                disabled={countdownTest !== null}
                onClick={handleDelayedBackgroundTest}
                className="px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Dá 4 segundos para você minimizar o navegador ou mudar de aba"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {countdownTest !== null ? `Mude de aba! (${countdownTest}s)...` : 'Testar em 2º Plano (4s)'}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setConfigForm(fcmConfig);
              setShowConfigModal(true);
            }}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Configurar Credenciais FCM"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FCM Connection & Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Token Card */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase text-slate-700">Token de Registro FCM (Device Token):</span>
            </div>
            <button
              type="button"
              onClick={handleCopyToken}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedToken ? 'Copiado!' : 'Copiar Token'}
            </button>
          </div>
          <code className="block p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800 break-all select-all">
            {fcmToken}
          </code>
          <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 gap-2">
            <span>
              Service Worker: {swRegistered ? '✅ /firebase-messaging-sw.js ativo' : '⏳ Registrando...'}
            </span>
            <span>
              Projeto FCM: <strong className="text-slate-700 font-semibold">{fcmConfig.projectId}</strong>
            </span>
          </div>
        </div>

        {/* Live Delivery Stats */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold block">
              Métricas de Entrega FCM
            </span>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              <div>
                <span className="text-[10px] text-indigo-300 block">Envios 7D</span>
                <span className="text-lg font-black">{pushStats.sentCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 block">Abertura</span>
                <span className="text-lg font-black text-emerald-400">{pushStats.openRate}</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 block">Latência</span>
                <span className="text-lg font-black text-amber-300">{pushStats.avgLatency}</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-indigo-200">
            <span>Dispositivos Conectados:</span>
            <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">{pushStats.activeDevices}</span>
          </div>
        </div>
      </div>

      {/* Background Simulation Toggle */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 sm:mt-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-950">
              Simulador Automático de Leads em Segundo Plano (FCM Daemon)
            </h4>
            <p className="text-[11px] text-indigo-700 mt-0.5">
              Dispara notificações push reais a cada 45 segundos simulando clientes comentando palavras-chave no Instagram enquanto você navega em outras abas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleBackgroundSimulation()}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            backgroundSimulation
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-xs'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${backgroundSimulation ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
          {backgroundSimulation ? 'Desativar Daemon (Ativo)' : 'Ativar Simulação 2º Plano'}
        </button>
      </div>

      {/* Notification Categories */}
      <div className="space-y-3 pt-1">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-indigo-600" />
          Eventos e Canais de Alerta Push Habilitados:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Novos Leads Captados no Direct</span>
              <span className="text-[11px] text-slate-500">Notifica na hora quando uma DM for disparada com o link de compra</span>
            </div>
            <input
              type="checkbox"
              checked={notifyNewLeads}
              onChange={(e) => setNotifyNewLeads(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer ml-3"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Comentários Automatizados pela IA</span>
              <span className="text-[11px] text-slate-500">Alertas de respostas públicas efetuadas pela regra de palavras-chave</span>
            </div>
            <input
              type="checkbox"
              checked={notifyAutomatedComments}
              onChange={(e) => setNotifyAutomatedComments(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer ml-3"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Lembretes de Follow-Up Agendados</span>
              <span className="text-[11px] text-slate-500">Avisa quando for o momento de recontatar clientes via WhatsApp</span>
            </div>
            <input
              type="checkbox"
              checked={notifyFollowUps}
              onChange={(e) => setNotifyFollowUps(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer ml-3"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Pagamentos Multicaixa Express & PayPay</span>
              <span className="text-[11px] text-slate-500">Confirmação instantânea de transação concluída nos gateways</span>
            </div>
            <input
              type="checkbox"
              checked={notifyPayments}
              onChange={(e) => setNotifyPayments(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer ml-3"
            />
          </label>
        </div>
      </div>

      {/* FCM Modal Settings */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-base">
                  Configuração do Firebase Cloud Messaging (FCM)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Firebase Project ID:</label>
                <input
                  type="text"
                  value={configForm.projectId}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Firebase Web API Key:</label>
                <input
                  type="text"
                  value={configForm.apiKey}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">FCM Messaging Sender ID (Cloud Messaging):</label>
                <input
                  type="text"
                  value={configForm.messagingSenderId}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, messagingSenderId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chave Pública VAPID (Web Push Certificate):</label>
                <input
                  type="text"
                  value={configForm.vapidKey}
                  onChange={(e) => setConfigForm(prev => ({ ...prev, vapidKey: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-800"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Salvar Credenciais FCM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
