import React, { useEffect, useState } from 'react';
import { Calendar, Music, BookOpen, Layers, Sparkles, Clock, ArrowUpRight, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { getDashboardStats, loadSongsToday, loadWordsToday } from '../services/database';
import { DashboardStats, Song, Word } from '../types';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [recentWords, setRecentWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dashboardStats = await getDashboardStats();
      const songs = await loadSongsToday();
      const words = await loadWordsToday();

      setStats(dashboardStats);
      setRecentSongs(songs.slice(0, 5));
      setRecentWords(words.slice(0, 5));
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Visão Geral do Culto
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
            Dashboard Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Visão geral e registros do ministério em tempo real
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all shadow-md active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#d4af37] ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Dados</span>
        </button>
      </div>

      {/* Metric Cards Grid - Matching Design HTML */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Data Atual */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col justify-between group hover:border-[#d4af37]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Data Atual
            </span>
            <Calendar className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">
              {stats?.currentDateFormatted || '...'}
            </p>
            <p className="text-xs text-[#d4af37] font-semibold mt-1">Culto Ativo</p>
          </div>
          <div className="h-1 w-8 bg-[#d4af37] mt-3 group-hover:w-full transition-all duration-300"></div>
        </motion.div>

        {/* Card 2: Qtd. de Hinos */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col justify-between group hover:border-[#d4af37]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Qtd. de Hinos
            </span>
            <Music className="w-4 h-4 text-slate-400 group-hover:text-[#d4af37] transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-black text-white">
                {stats?.todaySongsCount ?? 0} Registros
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {stats?.totalSongs ?? 0} no histórico total
              </p>
            </div>
            <Link
              to="/admin/hinos"
              className="text-xs text-[#d4af37] hover:underline font-bold flex items-center gap-0.5"
            >
              Ver <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-1 w-8 bg-slate-700 mt-3 group-hover:bg-[#d4af37] group-hover:w-full transition-all duration-300"></div>
        </motion.div>

        {/* Card 3: Qtd. Palavra */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col justify-between group hover:border-[#d4af37]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Qtd. Palavra
            </span>
            <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#d4af37] transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-black text-white">
                {stats?.todayWordsCount ?? 0} Registros
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {stats?.totalWords ?? 0} no histórico total
              </p>
            </div>
            <Link
              to="/admin/palavra"
              className="text-xs text-[#d4af37] hover:underline font-bold flex items-center gap-0.5"
            >
              Ver <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-1 w-8 bg-[#d4af37] mt-3 group-hover:w-full transition-all duration-300"></div>
        </motion.div>

        {/* Card 4: Total Envios */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col justify-between group hover:border-[#d4af37]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Total Envios
            </span>
            <Layers className="w-4 h-4 text-slate-400 group-hover:text-[#d4af37] transition-colors" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-black text-white">
                {stats?.todayTotalSubmissions ?? 0} Total
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {stats?.grandTotal ?? 0} no banco
              </p>
            </div>
            <Link
              to="/admin/banco-de-dados"
              className="text-xs text-[#d4af37] hover:underline font-bold flex items-center gap-0.5"
            >
              Banco <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-1 w-8 bg-slate-700 mt-3 group-hover:bg-[#d4af37] group-hover:w-full transition-all duration-300"></div>
        </motion.div>
      </div>

      {/* Activity Summary Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        {/* Recent Songs */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
            <h3 className="font-bold text-white flex items-center gap-2.5 text-base">
              <span className="w-2 h-6 bg-[#d4af37] rounded-full inline-block"></span>
              Hinos Recentes
            </h3>
            <Link
              to="/admin/hinos"
              className="px-3.5 py-1.5 bg-[#0f172a] text-[#d4af37] hover:bg-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-800"
            >
              Ver Todos
            </Link>
          </div>

          <div className="p-5 flex-1">
            {recentSongs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Nenhum hino cadastrado até o momento.</p>
            ) : (
              <div className="space-y-3">
                {recentSongs.map((song) => (
                  <div
                    key={song.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-[#d4af37]/40 transition-all group"
                  >
                    <div className="overflow-hidden pr-2">
                      <h4 className="font-semibold text-sm text-slate-100 truncate group-hover:text-[#d4af37] transition-colors">
                        {song.songName}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        Cantado por: <span className="text-slate-200">{song.personName}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold">
                        <Clock className="w-3 h-3" />
                        {song.time}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{song.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Words */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
            <h3 className="font-bold text-white flex items-center gap-2.5 text-base">
              <span className="w-2 h-6 bg-[#d4af37] rounded-full inline-block"></span>
              Palavras Recentes
            </h3>
            <Link
              to="/admin/palavra"
              className="px-3.5 py-1.5 bg-[#0f172a] text-[#d4af37] hover:bg-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-800"
            >
              Ver Todas
            </Link>
          </div>

          <div className="p-5 flex-1">
            {recentWords.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Nenhuma palavra cadastrada até o momento.</p>
            ) : (
              <div className="space-y-3">
                {recentWords.map((word) => (
                  <div
                    key={word.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-[#d4af37]/40 transition-all group"
                  >
                    <div className="overflow-hidden pr-2">
                      <h4 className="font-bold text-sm text-[#d4af37] truncate">
                        {word.book} {word.chapter}:{word.verse}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        Referência da Sagrada Escritura
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold">
                        <Clock className="w-3 h-3" />
                        {word.time}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{word.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
