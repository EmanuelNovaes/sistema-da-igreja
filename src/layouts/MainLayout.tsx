import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ToastContainer, ToastMessage } from '../components/common/Toast';

export const MainLayout: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full"></div>
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-10 -right-40 w-[400px] h-[400px] bg-amber-600/10 blur-[150px] rounded-full"></div>
      </div>

      <Header />

      <main className="flex-1 relative z-10">
        <Outlet context={{ addToast }} />
      </main>

      <Footer />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};
