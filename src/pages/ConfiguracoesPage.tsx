import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Trash2,
  Database,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ConfiguracoesPage: React.FC = () => {
  const [activeActionModal, setActiveActionModal] = useState<{
    title: string;
    description: string;
    icon: React.ElementType;
  } | null>(null);

  const configCards = [
    {
      id: 'export-pdf',
      title: 'Exportar PDF',
      description: 'Gere relatórios formatados em arquivo PDF para impressão do boletim do culto.',
      icon: FileText,
      badge: 'Visual',
      color: 'from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-400',
    },
    {
      id: 'export-excel',
      title: 'Exportar Excel',
      description: 'Exporte todas as tabelas de hinos e mensagens em planilha para análise.',
      icon: FileSpreadsheet,
      badge: 'Visual',
      color: 'from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'clear-day',
      title: 'Limpar Registros do Dia',
      description: 'Apague temporariamente a fila de louvores do culto ativo mantendo o histórico.',
      icon: Trash2,
      badge: 'Visual',
      color: 'from-rose-500/20 to-rose-700/10 border-rose-500/30 text-rose-400',
    },
    {
      id: 'backup',
      title: 'Backup',
      description: 'Faça o download ou sincronização completa de segurança de todas as tabelas.',
      icon: Database,
      badge: 'Visual',
      color: 'from-blue-500/20 to-blue-700/10 border-blue-500/30 text-blue-400',
    },
    {
      id: 'restore-backup',
      title: 'Restaurar Backup',
      description: 'Restaure uma cópia de segurança salva em formato JSON ou SQL.',
      icon: RotateCcw,
      badge: 'Visual',
      color: 'from-purple-500/20 to-purple-700/10 border-purple-500/30 text-purple-400',
    },
  ];

  const handleCardClick = (card: typeof configCards[0]) => {
    setActiveActionModal({
      title: card.title,
      description: card.description,
      icon: card.icon,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Administração de Dados
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
          Configurações & Ferramentas
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Ações e exportações preparadas para a integração com o Supabase.
        </p>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-[#0f172a] border border-[#d4af37]/40 text-slate-200 flex items-start gap-3 shadow-md">
        <Info className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="font-bold text-[#d4af37]">Módulo de Configurações do Sistema:</strong> As ações
          abaixo foram estruturadas visualmente conforme solicitado. As integrações de download, exportação e manutenção serão conectadas diretamente ao banco de dados Supabase futuramente.
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configCards.map((card) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -4 }}
              onClick={() => handleCardClick(card)}
              className="bg-slate-900 border border-slate-800 hover:border-[#d4af37]/50 rounded-3xl p-6 shadow-xl cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d4af37]/10 transition-all"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0f172a] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[#d4af37]">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-[#d4af37] transition-colors">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#d4af37] group-hover:text-[#d4af37]">
                <span>Acessar Função</span>
                <span className="text-slate-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visual Feedback Modal */}
      <AnimatePresence>
        {activeActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl text-center relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0f172a] border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto mb-4 shadow-md">
                <activeActionModal.icon className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black text-white mb-2">
                {activeActionModal.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {activeActionModal.description}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left mb-6 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400">
                  <strong className="text-slate-200">Estrutura Pronta:</strong> Esta ação visual está configurada para receber a lógica de execução no Supabase.
                </p>
              </div>

              <button
                onClick={() => setActiveActionModal(null)}
                className="w-full py-3 px-6 rounded-xl bg-[#d4af37] hover:bg-[#b89528] text-[#0f172a] font-extrabold text-xs tracking-wide shadow-md transition-all"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
