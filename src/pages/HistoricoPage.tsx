import React, { useEffect, useState } from 'react';
import { Calendar, Music, BookOpen, ChevronDown, ChevronUp, Clock, User, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loadHistory } from '../services/database';
import { HistoryEntry } from '../types';

export const HistoricoPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [filterQuery, setFilterQuery] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Chama a função loadHistory() pronta para o Supabase
      const data = await loadHistory();
      setHistory(data);

      // Inicia com a primeira data expandida por padrão
      if (data.length > 0) {
        setExpandedDates({ [data[0].date]: true });
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleExpand = (dateStr: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };

  const filteredHistory = history.filter((item) => {
    if (!filterQuery) return true;
    const query = filterQuery.toLowerCase();
    const matchesDate = item.formattedDate.toLowerCase().includes(query) || item.date.includes(query);
    const matchesSongs = item.songs.some(
      (s) => s.songName.toLowerCase().includes(query) || s.personName.toLowerCase().includes(query)
    );
    const matchesWords = item.words.some(
      (w) => w.book.toLowerCase().includes(query) || String(w.chapter).includes(query) || w.verse.includes(query)
    );
    return matchesDate || matchesSongs || matchesWords;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Registros Históricos dos Cultos
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
            Histórico por Datas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Consulte os louvores e a mensagem da Palavra registrados em cada dia de culto.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filtrar por data, hino, pessoa ou versículo..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
        />
        <Filter className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* History List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <span>Carregando histórico do culto...</span>
          </div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
          Nenhum registro histórico encontrado.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((entry) => {
            const isExpanded = !!expandedDates[entry.date];

            return (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                {/* Date Accordion Header */}
                <button
                  onClick={() => toggleExpand(entry.date)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#0f172a] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0 shadow-md">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-white">
                        {entry.formattedDate}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-[#d4af37]" />
                          {entry.totalSongs} {entry.totalSongs === 1 ? 'Hino' : 'Hinos'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                          {entry.totalWords} {entry.totalWords === 1 ? 'Palavra' : 'Palavras'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#d4af37]" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Content View */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-800/80 bg-slate-950/60 p-5 sm:p-6 space-y-6"
                    >
                      {/* Section 1: Songs for this day */}
                      <div>
                        <h4 className="font-bold text-xs text-[#d4af37] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Music className="w-4 h-4 text-[#d4af37]" />
                          Hinos Cadastrados Neste Dia ({entry.songs.length})
                        </h4>

                        {entry.songs.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">Nenhum hino registrado nesta data.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {entry.songs.map((song) => (
                              <div
                                key={song.id}
                                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                              >
                                <div>
                                  <h5 className="font-bold text-sm text-slate-100">{song.songName}</h5>
                                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                    <User className="w-3 h-3 text-[#d4af37]" />
                                    <span>{song.personName}</span>
                                  </p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {song.time}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section 2: Words for this day */}
                      <div>
                        <h4 className="font-bold text-xs text-[#d4af37] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#d4af37]" />
                          Referência da Palavra Neste Dia ({entry.words.length})
                        </h4>

                        {entry.words.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">Nenhuma palavra registrada nesta data.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {entry.words.map((word) => (
                              <div
                                key={word.id}
                                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                              >
                                <div>
                                  <h5 className="font-black text-sm text-[#d4af37]">
                                    {word.book} {word.chapter}:{word.verse}
                                  </h5>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    Mensagem do Culto
                                  </p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {word.time}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
