import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Music, BookOpen, ArrowLeft } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] border-b border-slate-800 px-4 lg:px-8 py-4 transition-all shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Church Title */}
        <div className="flex items-center gap-3">
          {!isHome && (
            <Link
              to="/"
              className="mr-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all flex items-center gap-1 text-sm font-medium"
              title="Voltar ao início"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </Link>
          )}

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] shadow-md group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              <img src="/logo/cfec.png" alt="Logo CFEC" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-white leading-tight flex items-center gap-2">
                Comunidade Familia Em Cristo
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 font-bold hidden xs:inline-block">
                  Igreja
                </span>
              </h1>
              <p className="text-xs text-slate-400">Registro de Louvor & Palavra</p>
            </div>
          </Link>
        </div>

        {/* Top Right Admin Button */}
        <div className="flex items-center gap-2">
          {!isHome && (
            <div className="hidden md:flex items-center gap-1 mr-2 text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <Music className="w-3.5 h-3.5 text-[#d4af37]" />
              <Link to="/enviar-hino" className="hover:text-[#d4af37] px-1">Enviar Hino</Link>
              <span className="text-slate-700">•</span>
              <BookOpen className="w-3.5 h-3.5 text-[#d4af37] ml-1" />
              <Link to="/enviar-palavra" className="hover:text-[#d4af37] px-1">Enviar Palavra</Link>
            </div>
          )}

          <Link
            to="/admin/login"
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-[#0f172a] bg-[#d4af37] hover:bg-[#b89528] transition-all shadow-md active:scale-95"
            title="Acesso Administrativo"
          >
            <Shield className="w-3.5 h-3.5 text-[#0f172a]" />
            <span>Painel Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
