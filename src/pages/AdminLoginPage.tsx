import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, KeyRound, LogIn, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect to admin dashboard
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password) {
      setErrorMessage('Por favor, informe a senha de acesso.');
      return;
    }

    setLoading(true);
    try {
      // Chama a função loginAdmin() definida no serviço (preparada para o Supabase)
      const success = await loginAdmin(password);

      if (success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMessage('Senha incorreta.');
      }
    } catch (err) {
      setErrorMessage('Ocorreu um erro ao verificar a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 flex flex-col justify-center min-h-[calc(100vh-140px)]">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Início
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 shadow-md">
            <Shield className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Painel Administrativo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Digite a senha de administrador para acessar o gerenciamento do culto.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-2.5 text-sm"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Informe a senha..."
                className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
                autoFocus
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center space-y-2">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <img src="/logo/cfec.png" alt="Logo CFEC" className="w-3.5 h-3.5 object-contain" />
            Acesso restrito à equipe técnica e de louvor da igreja.
          </p>
          <p className="text-[10px] text-slate-500">
            Dica temporária: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">cfec@2026</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
