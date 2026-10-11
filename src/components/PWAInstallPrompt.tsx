import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, Share2, PlusSquare, X, Check } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  // If on Android or Desktop Chrome where beforeinstallprompt fired:
  if (isInstallable) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white px-4 py-2.5 border-b border-indigo-700/50 flex items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
            V.Ex
          </div>
          <div>
            <span className="font-extrabold text-amber-300">Instalar App V.Ex no teu telemóvel</span>
            <span className="hidden sm:inline text-indigo-200 ml-1.5">• Acesso rápido e otimizado para Android</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={install}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg text-xs transition flex items-center gap-1 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Instalar App
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-white/60 hover:text-white rounded-md"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // If on iOS Safari:
  if (isIOS) {
    return (
      <>
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-4 py-2 border-b border-indigo-700/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Usar no iPhone / iPad como App nativo</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIOSModal(true)}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
            >
              <span>Ver Como Instalar</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                    V.Ex
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Instalar no iPhone / iOS</h3>
                    <p className="text-[10px] text-slate-500">2 passos simples no Safari</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">1. Toca no botão Partilhar</div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Na barra inferior do Safari no teu iPhone, clica no ícone de Partilha (quadrado com seta para cima).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-xl shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">2. "Adicionar ao Ecrã Principal"</div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Rola para baixo nas opções e escolhe <strong>"Adicionar ao Ecrã Principal"</strong> (Add to Home Screen).
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition"
              >
                Entendi, Concluir
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // If generic mobile device (or Android without triggered prompt yet), show a friendly badge
  if (isAndroid) {
    return (
      <div className="bg-slate-900 text-white px-4 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Versão otimizada para <strong>Android</strong> ativa</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-white"
        >
          ✕
        </button>
      </div>
    );
  }

  return null;
};
