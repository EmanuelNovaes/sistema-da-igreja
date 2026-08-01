-- ==========================================================
-- SCRIPT DE BANCO DE DADOS SUPABASE PARA SISTEMA CFEC
-- Comunidade Família Em Cristo
-- Produção & Segurança
-- ==========================================================

-- 1. Habilitar extensão pgcrypto para UUIDs e funções criptográficas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- TABELA: songs (Hinos cadastrados)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name TEXT NOT NULL,
  song_name TEXT NOT NULL,
  date TEXT NOT NULL, -- Formato YYYY-MM-DD
  time TEXT NOT NULL, -- Formato HH:MM
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_songs_date ON public.songs(date);
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON public.songs(created_at DESC);

-- ==========================================================
-- TABELA: words (Leituras da Palavra)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL,
  chapter INT NOT NULL,
  verse TEXT NOT NULL,
  date TEXT NOT NULL, -- Formato YYYY-MM-DD
  time TEXT NOT NULL, -- Formato HH:MM
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_words_date ON public.words(date);
CREATE INDEX IF NOT EXISTS idx_words_created_at ON public.words(created_at DESC);

-- ==========================================================
-- TABELA: settings (Garantia de registro único para senha Admin com Hash)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
  admin_password TEXT NOT NULL,
  is_singleton BOOLEAN DEFAULT true UNIQUE CHECK (is_singleton),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserção inicial com HASH SHA-256 da senha 'cfec@2026'
-- Hash SHA-256 de 'cfec@2026' = 9f2b38038b335a92a5b23d91cf0eb2a2979bb950798e4d3a2bd1a70ff3833df3
INSERT INTO public.settings (id, admin_password, is_singleton)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  encode(digest('cfec@2026', 'sha256'), 'hex'),
  true
)
ON CONFLICT (is_singleton) DO NOTHING;

-- ==========================================================
-- FUNCTION & TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE updated_at
-- ==========================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_songs_updated_at ON public.songs;
CREATE TRIGGER set_songs_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_words_updated_at ON public.words;
CREATE TRIGGER set_words_updated_at
  BEFORE UPDATE ON public.words
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) & POLÍCIAS DE SEGURANÇA
-- ==========================================================
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura publica de hinos" ON public.songs;
DROP POLICY IF EXISTS "Permitir insercao publica de hinos" ON public.songs;
DROP POLICY IF EXISTS "Permitir atualizacao publica de hinos" ON public.songs;
DROP POLICY IF EXISTS "Permitir delecao publica de hinos" ON public.songs;

DROP POLICY IF EXISTS "Permitir leitura publica de palavras" ON public.words;
DROP POLICY IF EXISTS "Permitir insercao publica de palavras" ON public.words;
DROP POLICY IF EXISTS "Permitir atualizacao publica de palavras" ON public.words;
DROP POLICY IF EXISTS "Permitir delecao publica de palavras" ON public.words;

DROP POLICY IF EXISTS "Permitir leitura publica de configuracoes" ON public.settings;
DROP POLICY IF EXISTS "Permitir atualizacao publica de configuracoes" ON public.settings;
DROP POLICY IF EXISTS "Permitir insercao publica de configuracoes" ON public.settings;

-- Políticas para HINOS (songs)
CREATE POLICY "Permitir leitura publica de hinos" ON public.songs FOR SELECT USING (true);
CREATE POLICY "Permitir insercao publica de hinos" ON public.songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualizacao publica de hinos" ON public.songs FOR UPDATE USING (true);
CREATE POLICY "Permitir delecao publica de hinos" ON public.songs FOR DELETE USING (true);

-- Políticas para PALAVRAS (words)
CREATE POLICY "Permitir leitura publica de palavras" ON public.words FOR SELECT USING (true);
CREATE POLICY "Permitir insercao publica de palavras" ON public.words FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualizacao publica de palavras" ON public.words FOR UPDATE USING (true);
CREATE POLICY "Permitir delecao publica de palavras" ON public.words FOR DELETE USING (true);

-- Políticas para CONFIGURAÇÕES (settings)
CREATE POLICY "Permitir leitura publica de configuracoes" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Permitir atualizacao publica de configuracoes" ON public.settings FOR UPDATE USING (true);
CREATE POLICY "Permitir insercao publica de configuracoes" ON public.settings FOR INSERT WITH CHECK (true);
