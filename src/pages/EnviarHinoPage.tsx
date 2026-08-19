import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Music, User, Mic, Send, CheckCircle2, ArrowLeft, Church } from 'lucide-react';
import { motion } from 'motion/react';
import { submitSong } from '../services/database';
import { ToastMessage } from '../components/common/Toast';

interface OutletContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const EnviarHinoPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();

  const [personName, setPersonName] = useState('');
  const [singer, setSinger] = useState('');
  const [songName, setSongName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Chama a função preparada para o Supabase com campos opcionais
      await submitSong({
        personName: personName.trim() || undefined,
        singer: singer.trim() || undefined,
        songName: songName.trim() || undefined,
      });

      // Limpa os campos
      setPersonName('');
      setSinger('');
      setSongName('');
      setSuccess(true);

      addToast({
        type: 'success',
        title: 'Hino Enviado!',
        description: 'O louvor foi registrado com sucesso no sistema do culto.',
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('ERRO COMPLETO:', err);

      addToast({
        type: 'error',
        title: 'Erro ao Enviar',
        description: err?.message || 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all text-sm font-medium shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Início
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-[#0f172a] border-2 border-[#d4af37] flex items-center justify-center shrink-0 shadow-md">
            <Music className="w-7 h-7 text-[#d4af37]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
              Culto de Louvor
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Enviar Hino
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Preencha os dados abaixo para cadastrar o louvor do dia.
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 shadow-lg"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Hino cadastrado com sucesso!</h4>
              <p className="text-xs text-emerald-300/90 mt-0.5">
                O louvor foi enviado e já está disponível para consulta do ministério de louvor.
              </p>
            </div>
          </motion.div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Pessoa */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#d4af37]" />
              Seu nome 
            </label>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Ex: Emanuel / Ednaldo / Wrylya"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          {/* Cantor */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#d4af37]" />
              Cantor / Banda
            </label>
            <input
              type="text"
              value={singer}
              onChange={(e) => setSinger(e.target.value)}
              placeholder="Ex: Fernandinho / Voz da Verdade / Gerson Rufino"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          {/* Nome do Hino */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-[#d4af37]" />
              Hino
            </label>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              placeholder="Ex: Galileu / Quem sou eu / Reconstrução"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-[#d4af37] hover:bg-[#b89528] text-[#0f172a] font-extrabold text-base tracking-wide transition-all shadow-lg shadow-[#d4af37]/10 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5 fill-[#0f172a]" />
                  <span>Enviar Hino</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Church className="w-3.5 h-3.5 text-[#d4af37]" />
            O registro será associado à data e horário atuais do culto.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
