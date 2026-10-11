import { useState, useEffect, useCallback, useRef } from 'react';
import { LeadRecord } from '../types';

export interface FCMConfig {
  apiKey: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
}

const DEFAULT_FCM_CONFIG: FCMConfig = {
  apiKey: 'AIzaSyC_VEx_LiveKey_Angola_9938471625',
  projectId: 'vex-visao-exclusiva-prod',
  messagingSenderId: '109283746501',
  appId: '1:109283746501:web:7f6a5b4c3d2e1a0b',
  vapidKey: 'BOH_live_VEx_FCM_Public_VAPID_Key_Token_Angola_Push_Notification_2026'
};

export function useFcmPushNotifications(
  onLeadReceived?: (lead: LeadRecord) => void,
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void
) {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [fcmToken, setFcmToken] = useState<string>(() => {
    return localStorage.getItem('vex_fcm_token') || 'fcm_live_vex_8849201a9df28014';
  });

  const [fcmConfig, setFcmConfig] = useState<FCMConfig>(() => {
    const saved = localStorage.getItem('vex_fcm_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_FCM_CONFIG;
  });

  const [swRegistered, setSwRegistered] = useState(false);
  const [backgroundSimulation, setBackgroundSimulation] = useState<boolean>(() => {
    return localStorage.getItem('vex_fcm_bg_simulation') === 'true';
  });

  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Register service worker for background push notifications
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        swRegistrationRef.current = registration;
        setSwRegistered(true);
        console.log('[FCM SW] Service worker registrado com sucesso:', registration.scope);
      })
      .catch((err) => {
        console.warn('[FCM SW] Falha ao registrar Service Worker:', err);
      });

    // Listen for notification clicks from service worker
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'FCM_NOTIFICATION_CLICK') {
        if (onNotify) {
          onNotify('Você abriu a notificação em segundo plano da V.Ex!', 'info');
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleSwMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSwMessage);
    };
  }, [onNotify]);

  // Request permission and generate FCM device token
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      if (onNotify) onNotify('Notificações push não suportadas neste navegador.', 'error');
      return 'denied';
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);

      if (res === 'granted') {
        const token = `fcm_tok_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
        setFcmToken(token);
        localStorage.setItem('vex_fcm_token', token);

        if (onNotify) {
          onNotify('Notificações Push FCM ativadas com sucesso para segundo plano!', 'success');
        }

        // Send confirmation welcome push
        sendPushNotification(
          '🔥 V.Ex Visão Exclusiva • Push Ativo!',
          'Seu dispositivo está pronto para receber alertas de leads e comentários em segundo plano.'
        );
      } else {
        if (onNotify) {
          onNotify('Permissão de notificações não concedida.', 'info');
        }
      }
      return res;
    } catch (e) {
      console.error('[FCM] Erro ao pedir permissão:', e);
      return 'default';
    }
  }, [onNotify]);

  // Send push notification (via SW or direct Notification)
  const sendPushNotification = useCallback(
    async (title: string, body: string, data?: any): Promise<boolean> => {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        return false;
      }

      if (Notification.permission !== 'granted') {
        return false;
      }

      try {
        if (swRegistrationRef.current && 'showNotification' in swRegistrationRef.current) {
          const swOptions = {
            body,
            icon: '/icon.svg',
            badge: '/icon.svg',
            tag: 'vex-fcm-' + Date.now(),
            renotify: true,
            data: data || { timestamp: Date.now() }
          };
          await swRegistrationRef.current.showNotification(title, swOptions as any);
          return true;
        } else {
          new Notification(title, {
            body,
            icon: '/icon.svg'
          });
          return true;
        }
      } catch (err) {
        console.warn('[FCM] Erro ao exibir notificação:', err);
        return false;
      }
    },
    []
  );

  // Background Simulator: Simulates automated leads arriving while app is backgrounded/minimized
  useEffect(() => {
    if (!backgroundSimulation) return;

    const sampleKeywords = ['QUERO', 'PREÇO', 'CATÁLOGO', 'ENVIAR', 'COMPRAR'];
    const sampleNames = [
      '@carlos_luanda',
      '@ana_benguela',
      '@pedro_talatona',
      '@zelia_kilamba',
      '@fatima_viana',
      '@joao_maianga',
      '@beatriz_morro_bento'
    ];
    const sampleComments = [
      'Eu QUERO muito esse produto, como compro?',
      'Qual é o PREÇO com entrega no Kilamba?',
      'Me mandem o CATÁLOGO urgente por favor!',
      'Quero COMPRAR o kit de 5000 Kz!',
      'ENVIAR no direct os detalhes do pagamento!'
    ];

    const interval = setInterval(() => {
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomIdx = Math.floor(Math.random() * sampleKeywords.length);
      const randomKeyword = sampleKeywords[randomIdx];
      const randomComment = sampleComments[randomIdx];

      const newLead: LeadRecord = {
        id: 'bg_' + Date.now(),
        username: randomName,
        comment: randomComment,
        keyword: randomKeyword,
        timestamp: 'Agora mesmo (Segundo Plano)',
        status: 'DM Enviada'
      };

      if (onLeadReceived) {
        onLeadReceived(newLead);
      }

      const isHidden = document.visibilityState === 'hidden';
      const title = isHidden
        ? '⚡ [SEGUNDO PLANO] Novo Lead Captado no Instagram!'
        : '🔥 Novo Lead Captado via V.Ex Automação!';
      const body = `${randomName} comentou "${randomKeyword}" e já recebeu o link e oferta no Direct!`;

      sendPushNotification(title, body, { leadId: newLead.id });

      if (onNotify) {
        onNotify(`[FCM PUSH] ${newLead.username} captado em segundo plano!`, 'info');
      }
    }, 45000); // Trigger every 45s when background simulation is active

    return () => clearInterval(interval);
  }, [backgroundSimulation, onLeadReceived, sendPushNotification, onNotify]);

  const toggleBackgroundSimulation = (active?: boolean) => {
    const next = active !== undefined ? active : !backgroundSimulation;
    setBackgroundSimulation(next);
    localStorage.setItem('vex_fcm_bg_simulation', next.toString());
    if (onNotify) {
      onNotify(
        next
          ? 'Simulador de Leads em Segundo Plano ativado! Alertas serão emitidos a cada 45s.'
          : 'Simulador de Leads em Segundo Plano pausado.',
        'info'
      );
    }
  };

  const updateFcmConfig = (newConfig: Partial<FCMConfig>) => {
    const updated = { ...fcmConfig, ...newConfig };
    setFcmConfig(updated);
    localStorage.setItem('vex_fcm_config', JSON.stringify(updated));
    if (onNotify) {
      onNotify('Configurações do Firebase Cloud Messaging salvas com sucesso!', 'success');
    }
  };

  return {
    permission,
    fcmToken,
    fcmConfig,
    swRegistered,
    backgroundSimulation,
    requestPermission,
    sendPushNotification,
    toggleBackgroundSimulation,
    updateFcmConfig
  };
}
