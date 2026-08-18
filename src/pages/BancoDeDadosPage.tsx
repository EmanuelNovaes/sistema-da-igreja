import React, { useEffect, useState } from 'react';
import { Database, Music, BookOpen, Search, Clock, User, Sparkles, Mic, Youtube, ExternalLink } from 'lucide-react';
import { loadSongs, loadWords } from '../services/database';
import { DatabaseTab, Song, Word } from '../types';
import { formatDateBR } from '../utils/dateUtils';

export const BancoDeDadosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DatabaseTab>('songs');
  const [songs, setSongs] = useState<Song[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Chama as funções do serviço preparadas para o Supabase
      const loadedSongs = await loadSongs();
      const loadedWords = await loadWords();

      setSongs(loadedSongs);
      setWords(loadedWords);
    } catch (err) {
      console.error('Erro ao carregar banco de dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredSongs = songs.filter((s) => {
    const term = searchTerm.toLowerCase();
    const songMatch = s.songName ? s.songName.toLowerCase().includes(term) : false;
    const personMatch = s.personName ? s.personName.toLowerCase().includes(term) : false;
    const singerMatch = s.singer ? s.singer.toLowerCase().includes(term) : false;
    const dateMatch = s.date ? s.date.includes(term) : false;
    return songMatch || personMatch || singerMatch || dateMatch;
  });

  const filteredWords = words.filter((w) => {
    const term = searchTerm.toLowerCase();
    const bookMatch = w.book ? w.book.toLowerCase().includes(term) : false;
    const chapterMatch = w.chapter !== null && w.chapter !== undefined ? String(w.chapter).includes(term) : false;
    const verseMatch = w.verse ? w.verse.toLowerCase().includes(term) : false;
    const dateMatch = w.date ? w.date.includes(term) : false;
    return bookMatch || chapterMatch || verseMatch || dateMatch;
  });

  const formatUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Visão Completa dos Dados
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
            Banco de Dados
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Consulte a base de registros completa exportável para integração futura.
          </p>
        </div>
      </div>

      {/* Two Tabs Selector */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('songs')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'songs'
              ? 'bg-[#d4af37] text-[#0f172a] shadow-lg shadow-[#d4af37]/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Hinos ({songs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('words')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'words'
              ? 'bg-[#d4af37] text-[#0f172a] shadow-lg shadow-[#d4af37]/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Palavra ({words.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            activeTab === 'songs'
              ? 'Pesquisar hino, pessoa ou cantor no banco...'
              : 'Pesquisar livro ou versículo no banco...'
          }
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Tab 1: Hinos Complete Table */}
      {activeTab === 'songs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
              <span className="w-2 h-6 bg-[#d4af37] rounded-full inline-block"></span>
              Tabela de Hinos Registrados
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Total: <strong className="text-[#d4af37]">{filteredSongs.length}</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-[#d4af37] border-b border-slate-800 text-[10px] uppercase tracking-widest font-extrabold">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Pessoa / Grupo</th>
                  <th className="py-4 px-6">Cantor</th>
                  <th className="py-4 px-6">Hino / Louvor</th>
                  <th className="py-4 px-6">Link do YouTube</th>
                  <th className="py-4 px-6">Data</th>
                  <th className="py-4 px-6">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Carregando tabela do banco de dados...
                    </td>
                  </tr>
                ) : filteredSongs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Nenhum registro de hino encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredSongs.map((song) => (
                    <tr key={song.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="py-4 px-6 font-mono text-xs text-slate-500 max-w-[120px] truncate" title={song.id}>
                        {song.id}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-100 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#d4af37] shrink-0" />
                        <span>{song.personName || <span className="text-slate-500 font-normal italic">—</span>}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-medium">
                        {song.singer ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-200">
                            <Mic className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                            {song.singer}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal italic">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-200 group-hover:text-[#d4af37] transition-colors">
                        {song.songName || <span className="text-slate-500 font-normal italic">—</span>}
                      </td>
                      <td className="py-4 px-6 text-xs">
                        {song.youtubeUrl ? (
                          <a
                            href={formatUrl(song.youtubeUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors font-semibold"
                          >
                            <Youtube className="w-3.5 h-3.5 text-red-500" />
                            <span>YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-600 font-normal italic">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {formatDateBR(song.date)}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-[#d4af37]">
                        <span className="inline-flex items-center gap-1 bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold">
                          <Clock className="w-3 h-3" />
                          {song.time}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Palavra Complete Table */}
      {activeTab === 'words' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
              <span className="w-2 h-6 bg-[#d4af37] rounded-full inline-block"></span>
              Tabela de Referências da Palavra
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Total: <strong className="text-[#d4af37]">{filteredWords.length}</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-[#d4af37] border-b border-slate-800 text-[10px] uppercase tracking-widest font-extrabold">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Livro da Bíblia</th>
                  <th className="py-4 px-6">Capítulo</th>
                  <th className="py-4 px-6">Versículo</th>
                  <th className="py-4 px-6">Data</th>
                  <th className="py-4 px-6">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Carregando tabela do banco de dados...
                    </td>
                  </tr>
                ) : filteredWords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Nenhum registro da palavra encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredWords.map((word) => (
                    <tr key={word.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="py-4 px-6 font-mono text-xs text-slate-500 max-w-[120px] truncate" title={word.id}>
                        {word.id}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#d4af37] flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#d4af37] shrink-0" />
                        <span>{word.book || <span className="text-slate-500 font-normal italic">—</span>}</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-100">
                        {word.chapter !== null && word.chapter !== undefined ? (
                          `Cap. ${word.chapter}`
                        ) : (
                          <span className="text-slate-500 font-normal italic">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-200">
                        {word.verse ? (
                          `Vers. ${word.verse}`
                        ) : (
                          <span className="text-slate-500 font-normal italic">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {formatDateBR(word.date)}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-[#d4af37]">
                        <span className="inline-flex items-center gap-1 bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold">
                          <Clock className="w-3 h-3" />
                          {word.time}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
