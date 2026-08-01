/**
 * SERVIÇO DE BANCO DE DADOS (SUPABASE)
 *
 * Conectado ao Supabase. Os dados ficam salvos de verdade e são os mesmos
 * para qualquer pessoa/dispositivo que acessar o site.
 *
 * Configuração necessária: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
 * (veja .env.example e supabase_schema.sql).
 */

import { DashboardStats, HistoryEntry, Song, SongInput, Word, WordInput } from '../types';
import { getCurrentDateBR, getCurrentFullDateFormattedBR, getDayOfWeekBR } from '../utils/dateUtils';
import { supabase } from './supabaseClient';

// --- Mapeamento entre colunas do banco (snake_case) e os tipos do app (camelCase) ---

type SongRow = {
  id: string;
  person_name: string;
  song_name: string;
  date: string;
  time: string;
  created_at: string;
};

type WordRow = {
  id: string;
  book: string;
  chapter: number;
  verse: string;
  date: string;
  time: string;
  created_at: string;
};

function mapSongRow(row: SongRow): Song {
  return {
    id: row.id,
    personName: row.person_name,
    songName: row.song_name,
    date: row.date,
    time: row.time,
    createdAt: row.created_at
  };
}

function mapWordRow(row: WordRow): Word {
  return {
    id: row.id,
    book: row.book,
    chapter: row.chapter,
    verse: row.verse,
    date: row.date,
    time: row.time,
    createdAt: row.created_at
  };
}

/**
 * Registra um novo hino cantado durante o culto.
 */
export async function submitSong(data: SongInput): Promise<Song> {
  const { data: row, error } = await supabase
    .from('songs')
    .insert({
      person_name: data.personName.trim(),
      song_name: data.songName.trim(),
      date: getCurrentDateBR(),
      time: new Date().toTimeString().slice(0, 5)
    })
    .select()
    .single();

  console.log("ROW:", row);
  console.log("ERROR:", error);

  if (error || !row) {
    throw new Error(error?.message ?? 'Erro ao salvar o hino.');
  }

  return mapSongRow(row as SongRow);
}

/**
 * Registra uma nova referência da Palavra lida no culto.
 */
export async function submitWord(data: WordInput): Promise<Word> {
  const { data: row, error } = await supabase
    .from('words')
    .insert({
      book: data.book.trim(),
      chapter: Number(data.chapter),
      verse: data.verse.trim(),
      date: getCurrentDateBR(),
      time: new Date().toTimeString().slice(0, 5)
    })
    .select()
    .single();

  if (error || !row) {
    throw new Error(error?.message ?? 'Erro ao salvar a referência.');
  }

  return mapWordRow(row as WordRow);
}

/**
 * Autenticação do Administrador.
 * Senha temporária: cfec@2026
 * (login simples por senha no app; não usa o Auth do Supabase)
 */
export async function loginAdmin(password: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const TEMP_PASS = 'cfec@2026';
  return password === TEMP_PASS;
}

/**
 * Edita um hino cadastrado.
 */
export async function editSong(id: string, data: Partial<SongInput>): Promise<Song> {
  const updates: Record<string, unknown> = {};
  if (data.personName) updates.person_name = data.personName.trim();
  if (data.songName) updates.song_name = data.songName.trim();

  const { data: row, error } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !row) {
    throw new Error(error?.message ?? 'Hino não encontrado.');
  }

  return mapSongRow(row as SongRow);
}

/**
 * Remove um hino cadastrado.
 */
export async function deleteSong(id: string): Promise<boolean> {
  const { error } = await supabase.from('songs').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

/**
 * Edita uma referência da Palavra cadastrada.
 */
export async function editWord(id: string, data: Partial<WordInput>): Promise<Word> {
  const updates: Record<string, unknown> = {};
  if (data.book) updates.book = data.book.trim();
  if (data.chapter !== undefined) updates.chapter = Number(data.chapter);
  if (data.verse) updates.verse = data.verse.trim();

  const { data: row, error } = await supabase
    .from('words')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !row) {
    throw new Error(error?.message ?? 'Palavra não encontrada.');
  }

  return mapWordRow(row as WordRow);
}

/**
 * Remove uma referência da Palavra.
 */
export async function deleteWord(id: string): Promise<boolean> {
  const { error } = await supabase.from('words').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

/**
 * Carrega a lista de todos os hinos cadastrados.
 */
export async function loadSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SongRow[]).map(mapSongRow);
}

/**
 * Carrega apenas os hinos da programação do dia atual do aparelho.
 */
export async function loadSongsToday(): Promise<Song[]> {
  const today = getCurrentDateBR();
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('date', today)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SongRow[]).map(mapSongRow);
}

/**
 * Carrega a lista de todas as referências da Palavra cadastradas.
 */
export async function loadWords(): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as WordRow[]).map(mapWordRow);
}

/**
 * Carrega apenas as palavras da programação do dia atual do aparelho.
 */
export async function loadWordsToday(): Promise<Word[]> {
  const today = getCurrentDateBR();
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .eq('date', today)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as WordRow[]).map(mapWordRow);
}

/**
 * Carrega o histórico completo agrupado por datas cadastradas.
 */
export async function loadHistory(): Promise<HistoryEntry[]> {
  const [songsList, wordsList] = await Promise.all([loadSongs(), loadWords()]);

  const allDates = Array.from(
    new Set([...songsList.map((s) => s.date), ...wordsList.map((w) => w.date)])
  ).sort((a, b) => b.localeCompare(a)); // Ordenação decrescente por data

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
 * Retorna dados resumidos para o Dashboard.
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