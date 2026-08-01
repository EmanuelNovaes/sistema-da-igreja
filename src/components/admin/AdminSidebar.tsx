import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Music,
  BookOpen,
  Calendar,
  Database,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      label: 'Hinos',
      icon: Music,
      path: '/admin/hinos',
    },
    {
      label: 'Palavra',
      icon: BookOpen,
      path: '/admin/palavra',
    },
    {
      label: 'Histórico',
      icon: Calendar,
      path: '/admin/historico',
    },
    {
      label: 'Banco de Dados',
      icon: Database,
      path: '/admin/banco-de-dados',
    },
    {
      label: 'Configurações',
      icon: Settings,
      path: '/admin/configuracoes',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] border-r border-slate-800 text-slate-200 select-none shadow-2xl">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between min-h-[70px]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
            <img src="/logo/cfec.png" alt="Logo CFEC" className="w-full h-full object-contain" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-base text-white tracking-tight leading-none">
                CFEC
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold mt-1">
                Gestão de Culto
              </span>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        {!mobileOpen && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-[#d4af37] hover:bg-slate-900 border border-slate-800 transition-colors"
            title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#d4af37] text-[#0f172a] font-bold shadow-lg shadow-[#d4af37]/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/90'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      isActive ? 'text-[#0f172a]' : 'text-slate-500 group-hover:text-[#d4af37]'
                    }`}
                  />
                  {(!collapsed || mobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Admin User Info & Logout Button */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        {(!collapsed || mobileOpen) ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-200 truncate">Administrador</span>
                <span className="text-[10px] text-amber-400 font-mono">CFEC Church</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sair do Painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
