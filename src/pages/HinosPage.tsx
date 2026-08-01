import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Music, Search, Edit3, Trash2, X, Check, Clock, User, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { deleteSong, editSong, loadSongsToday, submitSong } from '../services/database';
import { Song, SongInput } from '../types';
import { formatDateBR, getCurrentDateBR } from '../utils/dateUtils';
import { ToastMessage } from '../components/common/Toast';

interface OutletContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const HinosPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [editPersonName, setEditPersonName] = useState('');
  const [editSongName, setEditSongName] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSong, setDeletingSong] = useState<Song | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newSongName, setNewSongName] = useState('');

  const fetchSongsData = async () => {
    setLoading(true);
    try {
      // Carrega exclusivamente os registros do dia atual do dispositivo
      const data = await loadSongsToday();
      setSongs(data);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar a lista de hinos do dia.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongsData();
  }, []);

  // Filter songs by search term
  const filteredSongs = songs.filter(
    (s) =>
      s.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.date.includes(searchTerm)
  );

  // Edit Handlers
  const handleOpenEdit = (song: Song) => {
    setEditingSong(song);
    setEditPersonName(song.personName);
    setEditSongName(song.songName);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong || !editPersonName.trim() || !editSongName.trim()) return;

    try {
      // Executa a função editSong() conectada ao serviço do Supabase
      await editSong(editingSong.id, {
        personName: editPersonName.trim(),
        songName: editSongName.trim(),
      });

      addToast({
        type: 'success',
        title: 'Hino Atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });

      setIsEditModalOpen(false);
      setEditingSong(null);
      fetchSongsData();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na Atualização',
        description: 'Falha ao editar o hino.',
      });
    }
  };

  // Delete Handlers
  const handleOpenDelete = (song: Song) => {
    setDeletingSong(song);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSong) return;

    try {
      // Executa a função deleteSong() conectada ao serviço do Supabase
      await deleteSong(deletingSong.id);

      addToast({
        type: 'success',
        title: 'Hino Excluído',
        description: 'O registro do hino foi removido.',
      });

      setIsDeleteModalOpen(false);
      setDeletingSong(null);
      fetchSongsData();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao Excluir',
        description: 'Falha ao remover o hino.',
      });
    }
  };

  // Quick Add Handler from Admin
  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim() || !newSongName.trim()) return;

    try {
      await submitSong({
        personName: newPersonName.trim(),
        songName: newSongName.trim(),
      });

      addToast({
        type: 'success',
        title: 'Hino Cadastrado',
        description: 'O hino foi adicionado com sucesso.',
      });

      setIsAddModalOpen(false);
      setNewPersonName('');
      setNewSongName('');
      fetchSongsData();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao Cadastrar',
        description: 'Não foi possível adicionar o hino.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5" /> Programação do Dia ({formatDateBR(getCurrentDateBR())})
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
            Hinos do Culto
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Exibindo os louvores do dia atual. Registros anteriores ficam disponíveis no Histórico.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#b89528] text-[#0f172a] font-extrabold text-xs sm:text-sm shadow-lg shadow-[#d4af37]/10 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Cadastrar Hino</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar por nome ou hino do culto de hoje..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Modern Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
            <span className="w-2 h-6 bg-[#d4af37] rounded-full inline-block"></span>
            Programação de Louvores de Hoje
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Total Hoje: <strong className="text-[#d4af37]">{filteredSongs.length}</strong>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/90 text-[#d4af37] border-b border-slate-800 text-[10px] uppercase tracking-widest font-extrabold">
                <th className="py-4 px-6">Nome da Pessoa</th>
                <th className="py-4 px-6">Hino / Louvor</th>
                <th className="py-4 px-6">Data</th>
                <th className="py-4 px-6">Hora</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                      <span>Carregando hinos de hoje...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSongs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    {searchTerm ? (
                      'Nenhum hino encontrado com o termo pesquisado na programação de hoje.'
                    ) : (
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-300">Nenhum hino cadastrado para a data de hoje ({formatDateBR(getCurrentDateBR())}).</p>
                        <p className="text-xs text-slate-500">A programação está vazia e pronta para receber novos envios do culto!</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredSongs.map((song) => (
                  <tr
                    key={song.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-100 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>{song.personName}</span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-200 group-hover:text-[#d4af37] transition-colors">
                      {song.songName}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400 text-xs">
                      {formatDateBR(song.date)}
                    </td>
                    <td className="py-4 px-6 font-mono text-[#d4af37] text-xs">
                      <span className="inline-flex items-center gap-1 bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold">
                        <Clock className="w-3 h-3" />
                        {song.time}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(song)}
                        className="p-2 rounded-lg bg-slate-950 hover:bg-[#d4af37]/20 text-slate-300 hover:text-[#d4af37] border border-slate-800 transition-colors"
                        title="Editar Hino"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(song)}
                        className="p-2 rounded-lg bg-slate-950 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors"
                        title="Excluir Hino"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Editar Hino */}
      <AnimatePresence>
        {isEditModalOpen && editingSong && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  Editar Hino
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Nome da Pessoa
                  </label>
                  <input
                    type="text"
                    value={editPersonName}
                    onChange={(e) => setEditPersonName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Nome do Hino
                  </label>
                  <input
                    type="text"
                    value={editSongName}
                    onChange={(e) => setEditSongName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - Confirmar Exclusão */}
      <AnimatePresence>
        {isDeleteModalOpen && deletingSong && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Excluir Hino?</h3>
                  <p className="text-xs text-slate-400">Esta ação não poderá ser desfeita.</p>
                </div>
              </div>

              <div className="py-4 text-sm text-slate-300">
                Tem certeza que deseja remover o hino{' '}
                <strong className="text-amber-300">"{deletingSong.songName}"</strong> cadastrado por{' '}
                <strong className="text-white">{deletingSong.personName}</strong>?
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - Cadastrar Novo Hino (Quick Add) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-amber-400" />
                  Cadastrar Novo Hino
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSong} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Nome da Pessoa
                  </label>
                  <input
                    type="text"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Ex: Irmã Maria / Grupo de Louvor"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Nome do Hino
                  </label>
                  <input
                    type="text"
                    value={newSongName}
                    onChange={(e) => setNewSongName(e.target.value)}
                    placeholder="Ex: Quão Grande És Tu"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
