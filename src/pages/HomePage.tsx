import React from 'react';
import { Link } from 'react-router-dom';
import { Music, BookOpen, Sparkles, Church, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      {/* Title & Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-14 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f172a] border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-4 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          Culto de Louvor & Adoração
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Registro de Louvores & <span className="text-[#d4af37]">Sagrada Escritura</span>
        </h1>

        <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          Selecione uma opção abaixo para registrar os hinos a serem cantados ou a referência bíblica da Palavra compartilhada no culto.
        </p>
      </motion.div>

      {/* Two Large Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">
        {/* Card 1: Enviar Hino */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -6 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-[#d4af37] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
          <Link
            to="/enviar-hino"
            className="relative flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 hover:border-[#d4af37] transition-all shadow-2xl h-full overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl group-hover:bg-[#d4af37]/20 transition-all"></div>

            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border-2 border-[#d4af37] flex items-center justify-center mb-6 group-hover:scale-105 transition-all shadow-md">
                <Music className="w-8 h-8 text-[#d4af37]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-[#d4af37] transition-colors flex items-center gap-2">
                Enviar Hino
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Registre os louvores e hinos a serem cantados durante o momento de adoração do culto.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-[#d4af37] font-extrabold text-sm group-hover:text-[#d4af37]">
              <span>Registrar Hino Agora</span>
              <div className="w-9 h-9 rounded-full bg-[#0f172a] border border-[#d4af37]/40 flex items-center justify-center group-hover:translate-x-1.5 transition-transform shadow-md">
                <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Card 2: Enviar Palavra */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -6 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-[#d4af37] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
          <Link
            to="/enviar-palavra"
            className="relative flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 hover:border-[#d4af37] transition-all shadow-2xl h-full overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl group-hover:bg-[#d4af37]/20 transition-all"></div>

            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#0f172a] border-2 border-[#d4af37] flex items-center justify-center mb-6 group-hover:scale-105 transition-all shadow-md">
                <BookOpen className="w-8 h-8 text-[#d4af37]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-[#d4af37] transition-colors flex items-center gap-2">
                Enviar Palavra
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Registre a referência bíblica (livro, capítulo e versículo) pregada durante a mensagem do culto.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-[#d4af37] font-extrabold text-sm group-hover:text-[#d4af37]">
              <span>Registrar Palavra Agora</span>
              <div className="w-9 h-9 rounded-full bg-[#0f172a] border border-[#d4af37]/40 flex items-center justify-center group-hover:translate-x-1.5 transition-transform shadow-md">
                <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Additional Church Info & Admin Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 text-center flex flex-col items-center gap-3"
      >
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <Church className="w-4 h-4 text-[#d4af37]" />
          Registros organizados para a edificação da igreja
        </p>
        <Link
          to="/admin/login"
          className="text-xs text-slate-400 hover:text-[#d4af37] underline decoration-[#d4af37]/40 underline-offset-4 transition-colors inline-flex items-center gap-1"
        >
          <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
          Acesso Administrativo dos Louvores e Palavra
        </Link>
      </motion.div>
    </div>
  );
};
