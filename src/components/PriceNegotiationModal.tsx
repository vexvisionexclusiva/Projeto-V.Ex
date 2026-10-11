import React, { useState } from 'react';
import { PlatformUser, PriceNegotiationRequest } from '../types';
import {
  Handshake,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Send,
  X
} from 'lucide-react';

interface PriceNegotiationModalProps {
  currentUser: PlatformUser;
  originalPriceKz: number;
  serviceTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposal: (proposal: Omit<PriceNegotiationRequest, 'id' | 'createdAt'>) => void;
}

export default function PriceNegotiationModal({
  currentUser,
  originalPriceKz,
  serviceTitle,
  isOpen,
  onClose,
  onSubmitProposal
}: PriceNegotiationModalProps) {
  const [proposalDetails, setProposalDetails] = useState(
    'Tenho interesse em pagar 50% do valor em Kwanzas e os restantes 50% em prestação de serviços da minha empresa (ex: produtos do meu estoque, horas de trabalho especializado ou divulgação de mídia).'
  );
  const [userPhone, setUserPhone] = useState(currentUser.phone || '244923456789');
  const [offeredHours, setOfferedHours] = useState('15');

  if (!isOpen) return null;

  const fiftyPercentCashKz = Math.round(originalPriceKz * 0.5);
  const fiftyPercentServicesKz = originalPriceKz - fiftyPercentCashKz;

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalDetails.trim()) {
      alert('Por favor, descreva a proposta de serviços/tempo.');
      return;
    }

    onSubmitProposal({
      userId: currentUser.id,
      userName: currentUser.name,
      businessName: currentUser.businessName,
      phone: userPhone,
      originalPriceKz,
      offeredCashKz: fiftyPercentCashKz,
      serviceOrTimeProposal: `${proposalDetails} (Proposta: ${offeredHours} horas estimadas de serviço equivalente a ${fiftyPercentServicesKz.toLocaleString('pt-AO')} Kz).`,
      status: 'Aguardando Avaliação do Dono'
    });

    onClose();
    alert('🤝 A sua proposta de negociação de 50% em serviços de tempo foi enviada diretamente para o Dono da plataforma! Ele responderá no seu WhatsApp ou pelo painel.');
  };

  const whatsappDonoMessage = encodeURIComponent(
    `Olá Dono da V.Ex Visão Exclusiva! Sou ${currentUser.name} da empresa ${currentUser.businessName}. Gostaria de negociar o plano "${serviceTitle}" (Valor: ${originalPriceKz.toLocaleString('pt-AO')} Kz) com a opção de 50% em dinheiro (${fiftyPercentCashKz.toLocaleString('pt-AO')} Kz) e 50% em serviços de tempo (${offeredHours} horas de cooperação). Podemos conversar?`
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Canal Direto com o Dono da V.Ex
              </div>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                Negociação: 50% em Serviços de Tempo
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Na <strong>V.Ex Visão Exclusiva</strong> acreditamos na parceria ganha-ganha entre empreendedores. Se o teu orçamento imediato for reduzido, podes <strong>negociar diretamente com o Dono</strong> a probabilidade de pagar <strong>50% em Kwanzas</strong> e os outros <strong>50% em contrapartida de tempo/serviços</strong> do teu próprio negócio!
        </p>

        {/* 50% / 50% Split Visual Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">
            Divisão Proposta da Negociação:
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase">50% em Dinheiro (Kz)</div>
              <div className="text-base font-black text-emerald-400 mt-0.5">
                {fiftyPercentCashKz.toLocaleString('pt-AO')} Kz
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Via MCX / Unitel / PayPay</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase">50% em Serviços/Tempo</div>
              <div className="text-base font-black text-amber-300 mt-0.5">
                {fiftyPercentServicesKz.toLocaleString('pt-AO')} Kz
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Em tempo de trabalho útil</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Preço Integral de Tabela:</span>
            <strong className="text-white">{originalPriceKz.toLocaleString('pt-AO')} Kz</strong>
          </div>
        </div>

        {/* Proposal Form */}
        <form onSubmit={handleSendProposal} className="space-y-3 text-xs">
          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Descreva a contrapartida dos 50% em serviços do teu negócio:
            </label>
            <textarea
              rows={3}
              required
              value={proposalDetails}
              onChange={(e) => setProposalDetails(e.target.value)}
              placeholder="Ex: Ofereço 15 horas de serviços gráficos / 10 pacotes de produtos do meu restaurante / divulgação para minha base de 8.000 clientes em Luanda..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Estimativa de Horas de Serviço:
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={offeredHours}
                  onChange={(e) => setOfferedHours(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  horas
                </span>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                O Teu Telemóvel / WhatsApp:
              </label>
              <input
                type="text"
                required
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar Proposta de 50% ao Dono
            </button>

            {/* Direct WhatsApp to the Owner */}
            <a
              href={`https://wa.me/244923000001?text=${whatsappDonoMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Direto do Dono
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
