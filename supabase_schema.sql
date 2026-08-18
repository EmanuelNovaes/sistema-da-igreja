-- ==========================================================
-- SCRIPT COMPLETO DO BANCO DE DADOS SUPABASE
-- SISTEMA CFEC - COMUNIDADE FAMÍLIA EM CRISTO
-- ==========================================================

-- ==========================================================
-- 1. EXTENSÃO PGCRYPTO
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ==========================================================
-- 2. TABELA: songs
-- Hinos cadastrados
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Todos opcionais conforme solicitado
    person_name TEXT,
    singer TEXT,
    song_name TEXT,

    -- Dados de controle do envio
    date TEXT NOT NULL,
    time TEXT NOT NULL,

    -- Link opcional do YouTube
    youtube_url TEXT,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================
-- 3. GARANTIR NOVAS COLUNAS EM BANCO JÁ EXISTENTE
-- ==========================================================

ALTER TABLE public.songs
ADD COLUMN IF NOT EXISTS singer TEXT;

ALTER TABLE public.songs
ADD COLUMN IF NOT EXISTS youtube_url TEXT;


-- ==========================================================
-- 4. TORNAR CAMPOS DOS HINOS OPCIONAIS
-- ==========================================================

ALTER TABLE public.songs
ALTER COLUMN person_name DROP NOT NULL;

ALTER TABLE public.songs
ALTER COLUMN song_name DROP NOT NULL;


-- ==========================================================
-- 5. ÍNDICES DA TABELA SONGS
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_songs_date
ON public.songs(date);

CREATE INDEX IF NOT EXISTS idx_songs_created_at
ON public.songs(created_at DESC);


-- ==========================================================
-- 6. TABELA: words
-- Leituras / Palavra
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Referência bíblica opcional
    book TEXT,
    chapter INT,
    verse TEXT,

    -- Controle do registro
    date TEXT NOT NULL,
    time TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================
-- 7. TORNAR OS CAMPOS DE VERSÍCULO OPCIONAIS
-- ==========================================================

ALTER TABLE public.words
ALTER COLUMN book DROP NOT NULL;

ALTER TABLE public.words
ALTER COLUMN chapter DROP NOT NULL;

ALTER TABLE public.words
ALTER COLUMN verse DROP NOT NULL;


-- ==========================================================
-- 8. ÍNDICES DA TABELA WORDS
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_words_date
ON public.words(date);

CREATE INDEX IF NOT EXISTS idx_words_created_at
ON public.words(created_at DESC);


-- ==========================================================
-- 9. TABELA: settings
-- Configurações / senha administrativa
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY
        DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,

    admin_password TEXT NOT NULL,

    is_singleton BOOLEAN DEFAULT true UNIQUE CHECK (is_singleton),

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


-- ==========================================================
-- 10. INSERÇÃO DA CONFIGURAÇÃO INICIAL
-- ==========================================================

INSERT INTO public.settings (
    id,
    admin_password,
    is_singleton
)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    encode(digest('cfec@2026', 'sha256'), 'hex'),
    true
)
ON CONFLICT (is_singleton) DO NOTHING;


-- ==========================================================
-- 11. FUNÇÃO PARA updated_at
-- ==========================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ==========================================================
-- 12. TRIGGER - SONGS
-- ==========================================================

DROP TRIGGER IF EXISTS set_songs_updated_at
ON public.songs;

CREATE TRIGGER set_songs_updated_at
BEFORE UPDATE ON public.songs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();


-- ==========================================================
-- 13. TRIGGER - WORDS
-- ==========================================================

DROP TRIGGER IF EXISTS set_words_updated_at
ON public.words;

CREATE TRIGGER set_words_updated_at
BEFORE UPDATE ON public.words
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();


-- ==========================================================
-- 14. TRIGGER - SETTINGS
-- ==========================================================

DROP TRIGGER IF EXISTS set_settings_updated_at
ON public.settings;

CREATE TRIGGER set_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();


-- ==========================================================
-- 15. ATIVAR ROW LEVEL SECURITY
-- ==========================================================

ALTER TABLE public.songs
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.words
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.settings
ENABLE ROW LEVEL SECURITY;


-- ==========================================================
-- 16. REMOVER POLÍTICAS ANTIGAS - SONGS
-- ==========================================================

DROP POLICY IF EXISTS
"Permitir leitura publica de hinos"
ON public.songs;

DROP POLICY IF EXISTS
"Permitir insercao publica de hinos"
ON public.songs;

DROP POLICY IF EXISTS
"Permitir atualizacao publica de hinos"
ON public.songs;

DROP POLICY IF EXISTS
"Permitir delecao publica de hinos"
ON public.songs;


-- ==========================================================
-- 17. REMOVER POLÍTICAS ANTIGAS - WORDS
-- ==========================================================

DROP POLICY IF EXISTS
"Permitir leitura publica de palavras"
ON public.words;

DROP POLICY IF EXISTS
"Permitir insercao publica de palavras"
ON public.words;

DROP POLICY IF EXISTS
"Permitir atualizacao publica de palavras"
ON public.words;

DROP POLICY IF EXISTS
"Permitir delecao publica de palavras"
ON public.words;


-- ==========================================================
-- 18. REMOVER POLÍTICAS ANTIGAS - SETTINGS
-- ==========================================================

DROP POLICY IF EXISTS
"Permitir leitura publica de configuracoes"
ON public.settings;

DROP POLICY IF EXISTS
"Permitir atualizacao publica de configuracoes"
ON public.settings;

DROP POLICY IF EXISTS
"Permitir insercao publica de configuracoes"
ON public.settings;


-- ==========================================================
-- 19. POLÍTICAS - HINOS
-- ==========================================================

CREATE POLICY
"Permitir leitura publica de hinos"
ON public.songs
FOR SELECT
USING (true);


CREATE POLICY
"Permitir insercao publica de hinos"
ON public.songs
FOR INSERT
WITH CHECK (true);


CREATE POLICY
"Permitir atualizacao publica de hinos"
ON public.songs
FOR UPDATE
USING (true)
WITH CHECK (true);


CREATE POLICY
"Permitir delecao publica de hinos"
ON public.songs
FOR DELETE
USING (true);


-- ==========================================================
-- 20. POLÍTICAS - PALAVRAS
-- ==========================================================

CREATE POLICY
"Permitir leitura publica de palavras"
ON public.words
FOR SELECT
USING (true);


CREATE POLICY
"Permitir insercao publica de palavras"
ON public.words
FOR INSERT
WITH CHECK (true);


CREATE POLICY
"Permitir atualizacao publica de palavras"
ON public.words
FOR UPDATE
USING (true)
WITH CHECK (true);


CREATE POLICY
"Permitir delecao publica de palavras"
ON public.words
FOR DELETE
USING (true);


-- ==========================================================
-- 21. POLÍTICAS - SETTINGS
-- ==========================================================

CREATE POLICY
"Permitir leitura publica de configuracoes"
ON public.settings
FOR SELECT
USING (true);


CREATE POLICY
"Permitir atualizacao publica de configuracoes"
ON public.settings
FOR UPDATE
USING (true)
WITH CHECK (true);


CREATE POLICY
"Permitir insercao publica de configuracoes"
ON public.settings
FOR INSERT
WITH CHECK (true);


-- ==========================================================
-- FIM DO SCRIPT
-- ==========================================================