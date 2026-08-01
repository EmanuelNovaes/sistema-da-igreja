import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, Search, Edit3, Trash2, X, Clock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { deleteWord, editWord, loadWordsToday, submitWord } from '../services/database';
import { Word } from '../types';
import { formatDateBR, getCurrentDateBR } from '../utils/dateUtils';
import { ToastMessage } from '../components/common/Toast';
import { BIBLE_BOOKS } from '../utils/bibleBooks';

interface OutletContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PalavraPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();

  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [editBook, setEditBook] = useState('');
  const [editChapter, setEditChapter] = useState('');
  const [editVerse, setEditVerse] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingWord, setDeletingWord] = useState<Word | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBook, setNewBook] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [newVerse, setNewVerse] = useState('');

  const fetchWordsData = async () => {
    setLoading(true);
    try {
      // Carrega exclusivamente os registros da Palavra do dia atual do dispositivo
      const data = await loadWordsToday();
      setWords(data);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar a lista de Palavras do dia.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWordsData();
  }, []);

  // Filter words by search term
  const filteredWords = words.filter(
    (w) =>
      w.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(w.chapter).includes(searchTerm) ||
      w.verse.includes(searchTerm) ||
      w.date.includes(searchTerm)
  );

  // Edit Handlers
  const handleOpenEdit = (word: Word) => {
    setEditingWord(word);
    setEditBook(word.book);
    setEditChapter(String(word.chapter));
    setEditVerse(word.verse);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWord || !editBook.trim() || !editChapter || !editVerse.trim()) return;

    try {
      // Executa a função editWord() conectada ao serviço do Supabase
      await editWord(editingWord.id, {
        book: editBook.trim(),
        chapter: Number(editChapter),
        verse: editVerse.trim(),
      });

      addToast({
        type: 'success',
        title: 'Palavra Atualizada',
        description: 'A referência bíblica foi alterada com sucesso.',
      });

      setIsEditModalOpen(false);
      setEditingWord(null);
      fetchWordsData();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na Atualização',
        description: 'Falha ao editar a referência bíblica.',
      });
    }
  };

  // Delete Handlers
  const handleOpenDelete = (word: Word) => {
    setDeletingWord(word);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingWord) return;

    try {
      // Executa a função deleteWord() conectada ao serviço do Supabase
      await deleteWord(deletingWord.id);

      addToast({
        type: 'success',
        title: 'Palavra Excluída',
        description: 'A referência foi removida com sucesso.',
      });

      setIsDeleteModalOpen(false);
      setDeletingWord(null);
      fetchWordsData();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao Excluir',
        description: 'Falha ao remover a palavra.',
      });
    }
  };

  // Quick Add Handler
  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.trim() || !newChapter || !newVerse.trim()) return;

    try {
      await submitWord({
        book: newBook.trim(),
        chapter: Number(newChapter),
        verse: newVerse.trim(),
      });

      addToast({
        type: 'success',
        title: 'Palavra Cadastrada',
        description: 'A referência bíblica foi cadastrada com sucesso.',
      });

      setIsAddModalOpen(false);
      setNewBook('');
      setNewChapter('');
      setNewVerse('');
      fetchWordsData();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao Cadastrar',
        description: 'Não foi possível cadastrar a referência.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Programação do Dia ({formatDateBR(getCurrentDateBR())})
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
            Palavra do Culto
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Exibindo os textos bíblicos do dia atual. Registros anteriores ficam disponíveis no Histórico.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#b89528] text-[#0f172a] font-extrabold text-xs sm:text-sm shadow-lg shadow-[#d4af37]/10 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Cadastrar Palavra</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar por livro, capítulo ou versículo do culto de hoje..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <h3 className="font-bold text-white flex items-center gap-2.5 text-sm sm:text-base">
            <span className="w-2 h-6 bg-[#d4af37] rounded-full inline-block"></span>
            Programação da Palavra de Hoje
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Total Hoje: <strong className="text-[#d4af37]">{filteredWords.length}</strong>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/90 text-[#d4af37] border-b border-slate-800 text-[10px] uppercase tracking-widest font-extrabold">
                <th className="py-4 px-6">Livro da Bíblia</th>
                <th className="py-4 px-6">Capítulo</th>
                <th className="py-4 px-6">Versículo</th>
                <th className="py-4 px-6">Data</th>
                <th className="py-4 px-6">Hora</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                      <span>Carregando referências bíblicas de hoje...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredWords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    {searchTerm ? (
                      'Nenhuma referência encontrada com o termo pesquisado na programação de hoje.'
                    ) : (
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-300">Nenhuma palavra cadastrada para a data de hoje ({formatDateBR(getCurrentDateBR())}).</p>
                        <p className="text-xs text-slate-500">A programação está vazia e pronta para receber novos envios do culto!</p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredWords.map((word) => (
                  <tr
                    key={word.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="py-4 px-6 font-bold text-[#d4af37] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>{word.book}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-100">
                      Cap. {word.chapter}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-200">
                      Vers. {word.verse}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400 text-xs">
                      {formatDateBR(word.date)}
                    </td>
                    <td className="py-4 px-6 font-mono text-[#d4af37] text-xs">
                      <span className="inline-flex items-center gap-1 bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold">
                        <Clock className="w-3 h-3" />
                        {word.time}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(word)}
                        className="p-2 rounded-lg bg-slate-950 hover:bg-[#d4af37]/20 text-slate-300 hover:text-[#d4af37] border border-slate-800 transition-colors"
                        title="Editar Palavra"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(word)}
                        className="p-2 rounded-lg bg-slate-950 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-800 transition-colors"
                        title="Excluir Palavra"
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

      {/* Modal - Editar Palavra */}
      <AnimatePresence>
        {isEditModalOpen && editingWord && (
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
                  Editar Referência Bíblica
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
                    Livro
                  </label>
                  <input
                    type="text"
                    value={editBook}
                    onChange={(e) => setEditBook(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Capítulo
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editChapter}
                      onChange={(e) => setEditChapter(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Versículo
                    </label>
                    <input
                      type="text"
                      value={editVerse}
                      onChange={(e) => setEditVerse(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
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
        {isDeleteModalOpen && deletingWord && (
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
                  <h3 className="text-base font-bold text-white">Excluir Palavra?</h3>
                  <p className="text-xs text-slate-400">Esta ação não poderá ser desfeita.</p>
                </div>
              </div>

              <div className="py-4 text-sm text-slate-300">
                Tem certeza que deseja remover a referência{' '}
                <strong className="text-amber-300">
                  "{deletingWord.book} {deletingWord.chapter}:{deletingWord.verse}"
                </strong>
                ?
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

      {/* Modal - Cadastrar Nova Palavra */}
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
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Cadastrar Referência da Palavra
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddWord} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Livro
                  </label>
                  <input
                    type="text"
                    value={newBook}
                    onChange={(e) => setNewBook(e.target.value)}
                    placeholder="Ex: Salmos / João / Romanos"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Capítulo
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newChapter}
                      onChange={(e) => setNewChapter(e.target.value)}
                      placeholder="Ex: 23"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Versículo
                    </label>
                    <input
                      type="text"
                      value={newVerse}
                      onChange={(e) => setNewVerse(e.target.value)}
                      placeholder="Ex: 1-6"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
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
