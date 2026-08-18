/**
 * SERVIÇO DE BANCO DE DADOS (SUPABASE COM FALLBACK LOCAL)
 *
 * Todas as operações de leitura, escrita, edição e exclusão passam pelo Supabase
 * quando configurado (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).
 * Caso o Supabase não esteja configurado, utiliza persistência local com dados iniciais.
 */

import { DashboardStats, HistoryEntry, Song, SongInput, Word, WordInput } from '../types';
import { getCurrentDateBR, getCurrentFullDateFormattedBR, getDayOfWeekBR } from '../utils/dateUtils';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const LOCAL_SONGS_KEY = 'cfec_songs_store';
const LOCAL_WORDS_KEY = 'cfec_words_store';
const LOCAL_ADMIN_PW_KEY = 'cfec_admin_pw_store';
const DEFAULT_ADMIN_HASH = '9f2b38038b335a92a5b23d91cf0eb2a2979bb950798e4d3a2bd1a70ff3833df3'; // cfec@2026

type SongRow = {
  id: string;
  person_name?: string | null;
  singer?: string | null;
  song_name?: string | null;
  youtube_url?: string | null;
  date: string;
  time: string;
  created_at?: string;
  updated_at?: string;
};

type WordRow = {
  id: string;
  book?: string | null;
  chapter?: number | null;
  verse?: string | null;
  date: string;
  time: string;
  created_at?: string;
  updated_at?: string;
};

function mapSongRow(row: SongRow): Song {
  return {
    id: row.id,
    personName: row.person_name ?? null,
    singer: row.singer ?? null,
    songName: row.song_name ?? null,
    youtubeUrl: row.youtube_url ?? null,
    date: row.date,
    time: row.time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWordRow(row: WordRow): Word {
  return {
    id: row.id,
    book: row.book ?? null,
    chapter: row.chapter ?? null,
    verse: row.verse ?? null,
    date: row.date,
    time: row.time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helpers para Local Storage
function getLocalSongs(): Song[] {
  try {
    const raw = localStorage.getItem(LOCAL_SONGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalSongs(songs: Song[]) {
  try {
    localStorage.setItem(LOCAL_SONGS_KEY, JSON.stringify(songs));
  } catch (e) {
    console.error('Erro ao salvar no storage local:', e);
  }
}

function getLocalWords(): Word[] {
  try {
    const raw = localStorage.getItem(LOCAL_WORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalWords(words: Word[]) {
  try {
    localStorage.setItem(LOCAL_WORDS_KEY, JSON.stringify(words));
  } catch (e) {
    console.error('Erro ao salvar no storage local:', e);
  }
}

/**
 * Registra um novo hino no Supabase (ou local).
 */
export async function submitSong(data: SongInput): Promise<Song> {
  const currentDate = getCurrentDateBR();
  const currentTime = new Date().toTimeString().slice(0, 5);

  const payload = {
    person_name: data.personName?.trim() || null,
    singer: data.singer?.trim() || null,
    song_name: data.songName?.trim() || null,
    youtube_url: data.youtubeUrl?.trim() || null,
    date: currentDate,
    time: currentTime,
  };

  if (isSupabaseConfigured) {
    try {
      const { data: row, error } = await supabase
        .from('songs')
        .insert(payload)
        .select()
        .single();

      if (!error && row) {
        return mapSongRow(row as SongRow);
      }
      console.warn('Falha no Supabase ao inserir hino, usando fallback local:', error?.message);
    } catch (err) {
      console.warn('Erro ao conectar ao Supabase:', err);
    }
  }

  // Fallback Local
  const newSong: Song = {
    id: 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    personName: data.personName?.trim() || null,
    singer: data.singer?.trim() || null,
    songName: data.songName?.trim() || null,
    youtubeUrl: data.youtubeUrl?.trim() || null,
    date: currentDate,
    time: currentTime,
    createdAt: new Date().toISOString(),
  };

  const list = getLocalSongs();
  list.unshift(newSong);
  saveLocalSongs(list);
  return newSong;
}

/**
 * Registra uma nova referência da Palavra no Supabase (ou local).
 */
export async function submitWord(data: WordInput): Promise<Word> {
  const currentDate = getCurrentDateBR();
  const currentTime = new Date().toTimeString().slice(0, 5);

  const payload = {
    book: data.book?.trim() || null,
    chapter: data.chapter !== undefined && data.chapter !== '' ? Number(data.chapter) : null,
    verse: data.verse?.trim() || null,
    date: currentDate,
    time: currentTime,
  };

  if (isSupabaseConfigured) {
    try {
      const { data: row, error } = await supabase
        .from('words')
        .insert(payload)
        .select()
        .single();

      if (!error && row) {
        return mapWordRow(row as WordRow);
      }
      console.warn('Falha no Supabase ao inserir palavra, usando fallback local:', error?.message);
    } catch (err) {
      console.warn('Erro ao conectar ao Supabase:', err);
    }
  }

  // Fallback Local
  const newWord: Word = {
    id: 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    book: data.book?.trim() || null,
    chapter: data.chapter !== undefined && data.chapter !== '' ? Number(data.chapter) : null,
    verse: data.verse?.trim() || null,
    date: currentDate,
    time: currentTime,
    createdAt: new Date().toISOString(),
  };

  const list = getLocalWords();
  list.unshift(newWord);
  saveLocalWords(list);
  return newWord;
}

/**
 * Função utilitária para gerar HASH SHA-256 seguro da senha no navegador.
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Autenticação do Administrador via tabela settings do Supabase comparando HASH SHA-256.
 */
export async function loginAdmin(password: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('admin_password')
        .limit(1)
        .maybeSingle();

      if (!error && data && data.admin_password) {
        if (data.admin_password === hashedInput) {
          return true;
        }
        if (data.admin_password === password.trim()) {
          await updateAdminPassword(password);
          return true;
        }
        return false;
      }
    } catch (err) {
      console.warn('Erro ao autenticar no Supabase, verificando credenciais locais:', err);
    }
  }

  // Fallback de Autenticação Local (senha padrão cfec@2026 ou customizada)
  const storedHash = localStorage.getItem(LOCAL_ADMIN_PW_KEY) || DEFAULT_ADMIN_HASH;
  return hashedInput === storedHash || password.trim() === 'cfec@2026';
}

/**
 * Atualiza a senha do administrador na tabela settings armazenando o HASH SHA-256.
 */
export async function updateAdminPassword(newPassword: string): Promise<boolean> {
  const hashedPassword = await hashPassword(newPassword);

  if (isSupabaseConfigured) {
    try {
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from('settings')
          .update({
            admin_password: hashedPassword,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('settings')
          .insert({
            admin_password: hashedPassword
          });

        if (error) throw new Error(error.message);
      }
      return true;
    } catch (err) {
      console.warn('Erro ao atualizar senha no Supabase:', err);
    }
  }

  // Atualização local
  localStorage.setItem(LOCAL_ADMIN_PW_KEY, hashedPassword);
  return true;
}

/**
 * Edita um hino cadastrado no Supabase.
 */
export async function editSong(id: string, data: Partial<SongInput>): Promise<Song> {
  const updates: Record<string, unknown> = {};
  if (data.personName !== undefined) updates.person_name = data.personName?.trim() || null;
  if (data.singer !== undefined) updates.singer = data.singer?.trim() || null;
  if (data.songName !== undefined) updates.song_name = data.songName?.trim() || null;
  if (data.youtubeUrl !== undefined) updates.youtube_url = data.youtubeUrl?.trim() || null;

  if (isSupabaseConfigured && !id.startsWith('local_')) {
    try {
      const { data: row, error } = await supabase
        .from('songs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && row) {
        return mapSongRow(row as SongRow);
      }
    } catch (err) {
      console.warn('Erro ao editar hino no Supabase:', err);
    }
  }

  const list = getLocalSongs();
  const index = list.findIndex((s) => s.id === id);
  if (index !== -1) {
    if (data.personName !== undefined) list[index].personName = data.personName?.trim() || null;
    if (data.singer !== undefined) list[index].singer = data.singer?.trim() || null;
    if (data.songName !== undefined) list[index].songName = data.songName?.trim() || null;
    if (data.youtubeUrl !== undefined) list[index].youtubeUrl = data.youtubeUrl?.trim() || null;
    saveLocalSongs(list);
    return list[index];
  }

  throw new Error('Hino não encontrado para edição.');
}

/**
 * Remove um hino do Supabase.
 */
export async function deleteSong(id: string): Promise<boolean> {
  if (isSupabaseConfigured && !id.startsWith('local_')) {
    try {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Erro ao deletar no Supabase:', err);
    }
  }

  const list = getLocalSongs();
  const updated = list.filter((s) => s.id !== id);
  saveLocalSongs(updated);
  return true;
}

/**
 * Edita uma referência da Palavra no Supabase.
 */
export async function editWord(id: string, data: Partial<WordInput>): Promise<Word> {
  const updates: Record<string, unknown> = {};
  if (data.book !== undefined) updates.book = data.book?.trim() || null;
  if (data.chapter !== undefined) updates.chapter = data.chapter !== '' && data.chapter !== null ? Number(data.chapter) : null;
  if (data.verse !== undefined) updates.verse = data.verse?.trim() || null;

  if (isSupabaseConfigured && !id.startsWith('local_')) {
    try {
      const { data: row, error } = await supabase
        .from('words')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && row) {
        return mapWordRow(row as WordRow);
      }
    } catch (err) {
      console.warn('Erro ao editar palavra no Supabase:', err);
    }
  }

  const list = getLocalWords();
  const index = list.findIndex((w) => w.id === id);
  if (index !== -1) {
    if (data.book !== undefined) list[index].book = data.book?.trim() || null;
    if (data.chapter !== undefined) list[index].chapter = data.chapter !== '' && data.chapter !== null ? Number(data.chapter) : null;
    if (data.verse !== undefined) list[index].verse = data.verse?.trim() || null;
    saveLocalWords(list);
    return list[index];
  }

  throw new Error('Palavra não encontrada para edição.');
}

/**
 * Remove uma referência da Palavra no Supabase.
 */
export async function deleteWord(id: string): Promise<boolean> {
  if (isSupabaseConfigured && !id.startsWith('local_')) {
    try {
      const { error } = await supabase.from('words').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Erro ao deletar palavra no Supabase:', err);
    }
  }

  const list = getLocalWords();
  const updated = list.filter((w) => w.id !== id);
  saveLocalWords(updated);
  return true;
}

/**
 * Carrega todos os hinos do Supabase (ou local).
 */
export async function loadSongs(): Promise<Song[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return (data as SongRow[]).map(mapSongRow);
      }
      console.warn('Erro ao carregar hinos do Supabase, usando local:', error?.message);
    } catch (err) {
      console.warn('Erro na consulta de hinos ao Supabase:', err);
    }
  }

  return getLocalSongs();
}

/**
 * Carrega os hinos de hoje do Supabase (ou local).
 */
export async function loadSongsToday(): Promise<Song[]> {
  const today = getCurrentDateBR();
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return (data as SongRow[]).map(mapSongRow);
      }
    } catch (err) {
      console.warn('Erro ao carregar hinos de hoje do Supabase:', err);
    }
  }

  return getLocalSongs().filter((s) => s.date === today);
}

/**
 * Carrega todas as palavras do Supabase (ou local).
 */
export async function loadWords(): Promise<Word[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return (data as WordRow[]).map(mapWordRow);
      }
      console.warn('Erro ao carregar palavras do Supabase, usando local:', error?.message);
    } catch (err) {
      console.warn('Erro na consulta de palavras ao Supabase:', err);
    }
  }

  return getLocalWords();
}

/**
 * Carrega as palavras de hoje do Supabase (ou local).
 */
export async function loadWordsToday(): Promise<Word[]> {
  const today = getCurrentDateBR();
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return (data as WordRow[]).map(mapWordRow);
      }
    } catch (err) {
      console.warn('Erro ao carregar palavras de hoje do Supabase:', err);
    }
  }

  return getLocalWords().filter((w) => w.date === today);
}

/**
 * Carrega o histórico completo agrupado por data do Supabase.
 */
export async function loadHistory(): Promise<HistoryEntry[]> {
  const [songsList, wordsList] = await Promise.all([loadSongs(), loadWords()]);

  const allDates = Array.from(
    new Set([...songsList.map((s) => s.date), ...wordsList.map((w) => w.date)])
  ).sort((a, b) => b.localeCompare(a));

  const historyEntries: HistoryEntry[] = allDates.map((dateStr) => {
    const daySongs = songsList.filter((s) => s.date === dateStr);
    const dayWords = wordsList.filter((w) => w.date === dateStr);

    const [year, month, day] = dateStr.split('-');
    const formattedBR = `${day}/${month}/${year}`;
    const dayOfWeek = getDayOfWeekBR(dateStr);
    const formattedDate = dayOfWeek ? `${formattedBR} (${dayOfWeek})` : formattedBR;

    return {
      date: dateStr,
      formattedDate,
      songs: daySongs,
      words: dayWords,
      totalSongs: daySongs.length,
      totalWords: dayWords.length
    };
  });

  return historyEntries;
}

/**
 * Retorna estatísticas do Dashboard consultando o Supabase.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [songsList, wordsList, todaySongs, todayWords] = await Promise.all([
    loadSongs(),
    loadWords(),
    loadSongsToday(),
    loadWordsToday()
  ]);

  return {
    currentDateFormatted: getCurrentFullDateFormattedBR(),
    todaySongsCount: todaySongs.length,
    todayWordsCount: todayWords.length,
    todayTotalSubmissions: todaySongs.length + todayWords.length,
    totalSongs: songsList.length,
    totalWords: wordsList.length,
    grandTotal: songsList.length + wordsList.length
  };
}
