import React from 'react';
import { Church, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950 text-slate-400 py-6 px-4 text-center text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Church className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-medium text-slate-300">
            Sistema de Registro de Cultos &bull; Louvor & Palavra
          </span>
        </div>

        <p className="flex items-center gap-1 text-slate-500">
          Feito com <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" /> para a comunidade de fé
        </p>

        <p className="text-slate-500 font-mono text-[11px]">
          &copy; {new Date().getFullYear()} CFEC. Todos os direitos reservados.
        </p>
      </div>

      <p className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900/60 text-center text-[10px] text-slate-600 tracking-wide">
        Desenvolvido por <span className="text-amber-500 font-semibold">EMANUEL._.NOVAES</span>
      </p>
    </footer>
  );
};
