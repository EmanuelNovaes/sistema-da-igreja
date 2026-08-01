import React from 'react';
import { Menu, Calendar, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentFullDateFormattedBR } from '../../utils/dateUtils';

interface AdminTopbarProps {
  onOpenMobileMenu: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onOpenMobileMenu }) => {
  const currentDateStr = getCurrentFullDateFormattedBR();

  return (
    <header className="sticky top-0 z-20 bg-[#0f172a] border-b border-slate-800 px-4 lg:px-8 py-4 flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#d4af37] hover:border-[#d4af37]/30 transition-all"
          aria-label="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
          <span className="truncate">{currentDateStr}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#d4af37]/40 text-xs font-semibold text-slate-300 hover:text-[#d4af37] transition-all"
          title="Ver Portal do Culto (Visão do Usuário)"
        >
          <Home className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="hidden sm:inline">Portal do Culto</span>
        </Link>

        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight">Igreja CFEC</p>
            <p className="text-[10px] text-[#d4af37] font-extrabold uppercase tracking-wider">Admin Logado</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#0f172a] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-xs shadow-md">
            AC
          </div>
        </div>
      </div>
    </header>
  );
};
