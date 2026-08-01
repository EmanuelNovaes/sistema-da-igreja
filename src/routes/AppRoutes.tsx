import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { HomePage } from '../pages/HomePage';
import { EnviarHinoPage } from '../pages/EnviarHinoPage';
import { EnviarPalavraPage } from '../pages/EnviarPalavraPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';

import { DashboardPage } from '../pages/DashboardPage';
import { HinosPage } from '../pages/HinosPage';
import { PalavraPage } from '../pages/PalavraPage';
import { HistoricoPage } from '../pages/HistoricoPage';
import { BancoDeDadosPage } from '../pages/BancoDeDadosPage';
import { ConfiguracoesPage } from '../pages/ConfiguracoesPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/enviar-hino" element={<EnviarHinoPage />} />
        <Route path="/enviar-palavra" element={<EnviarPalavraPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Route>

      {/* Admin Panel Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="hinos" element={<HinosPage />} />
        <Route path="palavra" element={<PalavraPage />} />
        <Route path="historico" element={<HistoricoPage />} />
        <Route path="banco-de-dados" element={<BancoDeDadosPage />} />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
