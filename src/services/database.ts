/**
 * SERVIÇO DE BANCO DE DADOS (SUPABASE)
 *
 * Todas as operações de leitura, escrita, edição e exclusão passam exclusivamente
 * pelo Supabase. Sem fallbacks para localStorage ou dados simulados.
 */

import { DashboardStats, HistoryEntry, Song, SongInput, Word, WordInput } from '../types';
import { getCurrentDateBR, getCurrentFullDateFormattedBR, getDayOfWeekBR } from '../utils/dateUtils';
import { supabase } from './supabaseClient';

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
 * Registra um novo hino no Supabase.
 */
export async function submitSong(data: SongInput): Promise<Song> {
  const { data: row, error } = await supabase
    .from('songs')
    .insert({
      person_name: data.personName.trim(),
      song_name: data.songName.trim(),
      date: getCurrentDateBR(),
      time: new Date().toTimeString().slice(0, 5),
    })
    .select()
    .single();

  if (error || !row) {
    throw new Error(error?.message || 'Erro ao registrar hino no Supabase.');
  }

  return mapSongRow(row as SongRow);
}

/**
 * Registra uma nova referência da Palavra no Supabase.
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
    throw new Error(error?.message || 'Erro ao registrar palavra no Supabase.');
  }

  return mapWordRow(row as WordRow);
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
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('admin_password')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar senha no Supabase:', error);
      return false;
    }

    if (!data || !data.admin_password) {
      return false;
    }

    const hashedInput = await hashPassword(password);

    // Comparação do Hash SHA-256
    if (data.admin_password === hashedInput) {
      return true;
    }

    // Suporte e migração automática caso esteja gravada como texto puro legacy
    if (data.admin_password === password.trim()) {
      await updateAdminPassword(password);
      return true;
    }

    return false;
  } catch (err) {
    console.error('Falha na autenticação:', err);
    return false;
  }
}

/**
 * Atualiza a senha do administrador na tabela settings armazenando o HASH SHA-256.
 */
export async function updateAdminPassword(newPassword: string): Promise<boolean> {
  const hashedPassword = await hashPassword(newPassword);

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
}

/**
 * Edita um hino cadastrado no Supabase.
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
    throw new Error(error?.message || 'Erro ao editar hino no Supabase.');
  }

  return mapSongRow(row as SongRow);
}

/**
 * Remove um hino do Supabase.
 */
export async function deleteSong(id: string): Promise<boolean> {
  const { error } = await supabase.from('songs').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

/**
 * Edita uma referência da Palavra no Supabase.
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
    throw new Error(error?.message || 'Erro ao editar palavra no Supabase.');
  }

  return mapWordRow(row as WordRow);
}

/**
 * Remove uma referência da Palavra no Supabase.
 */
export async function deleteWord(id: string): Promise<boolean> {
  const { error } = await supabase.from('words').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

/**
 * Carrega todos os hinos do Supabase.
 */
export async function loadSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar hinos:', error);
    return [];
  }

  return (data as SongRow[] || []).map(mapSongRow);
}

/**
 * Carrega os hinos de hoje do Supabase.
 */
export async function loadSongsToday(): Promise<Song[]> {
  const today = getCurrentDateBR();
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('date', today)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar hinos de hoje:', error);
    return [];
  }

  return (data as SongRow[] || []).map(mapSongRow);
}

/**
 * Carrega todas as palavras do Supabase.
 */
export async function loadWords(): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar palavras:', error);
    return [];
  }

  return (data as WordRow[] || []).map(mapWordRow);
}

/**
 * Carrega as palavras de hoje do Supabase.
 */
export async function loadWordsToday(): Promise<Word[]> {
  const today = getCurrentDateBR();
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .eq('date', today)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao carregar palavras de hoje:', error);
    return [];
  }

  return (data as WordRow[] || []).map(mapWordRow);
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
