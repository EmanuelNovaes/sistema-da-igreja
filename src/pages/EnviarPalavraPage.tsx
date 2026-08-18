import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { BookOpen, Send, CheckCircle2, ArrowLeft, Church, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { submitWord } from '../services/database';
import { BIBLE_BOOKS } from '../utils/bibleBooks';
import { ToastMessage } from '../components/common/Toast';

interface OutletContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const EnviarPalavraPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();

  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Filter books for dropdown suggestion
  const [filteredBooks, setFilteredBooks] = useState<string[]>([]);
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  const handleBookChange = (value: string) => {
    setBook(value);

    if (value.trim()) {
      const matches = BIBLE_BOOKS.filter((b) =>
        b.name.toLowerCase().includes(value.toLowerCase())
      ).map((b) => b.name);
      setFilteredBooks(matches.slice(0, 8));
      setShowBookDropdown(true);
    } else {
      setShowBookDropdown(false);
    }
  };

  const selectBook = (bookName: string) => {
    setBook(bookName);
    setShowBookDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Chama a função preparada para o Supabase com campos opcionais
      await submitWord({
        book: book.trim() || undefined,
        chapter: chapter ? Number(chapter) : undefined,
        verse: verse.trim() || undefined,
      });

      // Limpa os campos
      setBook('');
      setChapter('');
      setVerse('');
      setSuccess(true);

      addToast({
        type: 'success',
        title: 'Palavra Enviada!',
        description: 'A referência bíblica foi registrada com sucesso.',
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao Enviar',
        description: 'Não foi possível registrar a Palavra. Tente novamente.',
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
            <BookOpen className="w-7 h-7 text-[#d4af37]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
              Mensagem do Culto
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Enviar Palavra
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Informe o Livro, Capítulo e Versículo prega no dia.
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
              <h4 className="font-bold text-sm">Palavra cadastrada com sucesso!</h4>
              <p className="text-xs text-emerald-300/90 mt-0.5">
                A referência da Sagrada Escritura foi registrada e armazenada para o culto.
              </p>
            </div>
          </motion.div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Livro */}
          <div className="relative">
            <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              Livro
            </label>
            <div className="relative">
              <input
                type="text"
                value={book}
                onChange={(e) => handleBookChange(e.target.value)}
                onFocus={() => {
                  if (book.trim()) setShowBookDropdown(true);
                }}
                placeholder="Ex: Salmos, João, Romanos, Isaías..."
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Book Dropdown Suggestions */}
            {showBookDropdown && filteredBooks.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1">
                {filteredBooks.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => selectBook(b)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#d4af37]/20 hover:text-[#d4af37] transition-colors"
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Capítulo e Versículo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Capítulo */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Capítulo
              </label>
              <input
                type="number"
                min="1"
                max="150"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="Ex: 23"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
              />
            </div>

            {/* Versículo */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Versículo
              </label>
              <input
                type="text"
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
                placeholder="Ex: 1 - 6  ou 16"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-all"
              />
            </div>
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
                  <span>Enviar Palavra</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Church className="w-3.5 h-3.5 text-[#d4af37]" />
            O registro será gravado com a data do culto de hoje.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
