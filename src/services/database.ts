/**
 * SERVIÇO DE BANCO DE DADOS (SUPABASE READY)
 * 
 * ATENÇÃO: Nenhuma chamada ao Firebase, LocalStorage ou Backend está implementada aqui.
 * Este arquivo foi estruturado com todas as rotinas e assinaturas de funções
 * necessárias para serem conectadas diretamente ao Supabase futuramente.
 * 
 * Exemplo de conexão futura com Supabase:
 * import { createClient } from '@supabase/supabase-js';
 * export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 */

import { DashboardStats, HistoryEntry, Song, SongInput, Word, WordInput } from '../types';
import { getCurrentDateBR, getCurrentFullDateFormattedBR, getCurrentTimeBR, getDayOfWeekBR } from '../utils/dateUtils';

// Repositório em memória temporário para simulação do frontend enquanto o Supabase não é conectado
const todayDate = getCurrentDateBR();

let songsList: Song[] = [
  {
    id: 's-1',
    personName: 'Irmã Maria Silva',
    songName: 'Grandes Coisas Fez o Senhor',
    date: todayDate,
    time: '19:15',
    createdAt: new Date().toISOString()
  },
  {
    id: 's-2',
    personName: 'Grupo de Louvor',
    songName: 'Porque Ele Vive',
    date: todayDate,
    time: '19:30',
    createdAt: new Date().toISOString()
  },
  {
    id: 's-3',
    personName: 'Irmão João Santos',
    songName: 'Quão Grande És Tu',
    date: '2026-07-26',
    time: '19:10',
    createdAt: new Date('2026-07-26T19:10:00').toISOString()
  },
  {
    id: 's-4',
    personName: 'Coral da Igreja',
    songName: 'Aclame ao Senhor',
    date: '2026-07-26',
    time: '19:40',
    createdAt: new Date('2026-07-26T19:40:00').toISOString()
  },
  {
    id: 's-5',
    personName: 'Jovens e Adolescentes',
    songName: 'Agindo Deus Quem Impedirá',
    date: '2026-07-23',
    time: '19:25',
    createdAt: new Date('2026-07-23T19:25:00').toISOString()
  }
];

let wordsList: Word[] = [
  {
    id: 'w-1',
    book: 'Salmos',
    chapter: 23,
    verse: '1-6',
    date: todayDate,
    time: '19:50',
    createdAt: new Date().toISOString()
  },
  {
    id: 'w-2',
    book: 'Isaías',
    chapter: 40,
    verse: '28-31',
    date: '2026-07-26',
    time: '20:00',
    createdAt: new Date('2026-07-26T20:00:00').toISOString()
  },
  {
    id: 'w-3',
    book: 'João',
    chapter: 3,
    verse: '16-17',
    date: '2026-07-23',
    time: '20:05',
    createdAt: new Date('2026-07-23T20:05:00').toISOString()
  }
];

/**
 * Registra um novo hino cantado durante o culto.
 * Futura integração Supabase:
 * const { data, error } = await supabase.from('songs').insert([data]).select().single();
 */
export async function submitSong(data: SongInput): Promise<Song> {
  // Simulação de latência de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newSong: Song = {
    id: `s-${Date.now()}`,
    personName: data.personName.trim(),
    songName: data.songName.trim(),
    date: getCurrentDateBR(),
    time: getCurrentTimeBR(),
    createdAt: new Date().toISOString()
  };

  songsList = [newSong, ...songsList];
  return newSong;
}

/**
 * Registra uma nova referência da Palavra lida no culto.
 * Futura integração Supabase:
 * const { data, error } = await supabase.from('words').insert([data]).select().single();
 */
export async function submitWord(data: WordInput): Promise<Word> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newWord: Word = {
    id: `w-${Date.now()}`,
    book: data.book.trim(),
    chapter: Number(data.chapter),
    verse: data.verse.trim(),
    date: getCurrentDateBR(),
    time: getCurrentTimeBR(),
    createdAt: new Date().toISOString()
  };

  wordsList = [newWord, ...wordsList];
  return newWord;
}

/**
 * Autenticação do Administrador.
 * Senha temporária: cfec@2026
 * Futura integração Supabase:
 * const { data, error } = await supabase.auth.signInWithPassword({ email, password });
 */
export async function loginAdmin(password: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const TEMP_PASS = 'cfec@2026';
  return password === TEMP_PASS;
}

/**
 * Edita um hino cadastrado.
 * Futura integração Supabase:
 * const { data, error } = await supabase.from('songs').update(data).eq('id', id);
 */
export async function editSong(id: string, data: Partial<SongInput>): Promise<Song> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  
  const index = songsList.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error('Hino não encontrado.');
  }

  const updatedSong = {
    ...songsList[index],
    ...(data.personName && { personName: data.personName.trim() }),
    ...(data.songName && { songName: data.songName.trim() })
  };

  songsList[index] = updatedSong;
  return updatedSong;
}

/**
 * Remove um hino cadastrado.
 * Futura integração Supabase:
 * const { error } = await supabase.from('songs').delete().eq('id', id);
 */
export async function deleteSong(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  songsList = songsList.filter((item) => item.id !== id);
  return true;
}

/**
 * Edita uma referência da Palavra cadastrada.
 * Futura integração Supabase:
 * const { data, error } = await supabase.from('words').update(data).eq('id', id);
 */
export async function editWord(id: string, data: Partial<WordInput>): Promise<Word> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const index = wordsList.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error('Palavra não encontrada.');
  }

  const updatedWord = {
    ...wordsList[index],
    ...(data.book && { book: data.book.trim() }),
    ...(data.chapter !== undefined && { chapter: Number(data.chapter) }),
    ...(data.verse && { verse: data.verse.trim() })
  };

  wordsList[index] = updatedWord;
  return updatedWord;
}

/**
 * Remove uma referência da Palavra.
 * Futura integração Supabase:
 * const { error } = await supabase.from('words').delete().eq('id', id);
 */
export async function deleteWord(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  wordsList = wordsList.filter((item) => item.id !== id);
  return true;
}

/**
 * Carrega a lista de todos os hinos cadastrados.
 * Futura integração Supabase:
 * const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
 */
export async function loadSongs(): Promise<Song[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...songsList];
}

/**
 * Carrega apenas os hinos da programação do dia atual do aparelho.
 * Futura integração Supabase:
 * const { data, error } = await supabase.from('songs').select('*').eq('date', currentDate);
 */
export async function loadSongsToday(): Promise<Song[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const today = getCurrentDateBR();
  return songsList.filter((s) => s.date === today);
}

/**
 * Carrega a lista de todas as referências da Palavra cadastradas.
 * Futura integração Supabase:
 * const { data, error } = await supabase.from('words').select('*').order('created_at', { ascending: false });
 */
export async function loadWords(): Promise<Word[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...wordsList];
}

/**
 * Carrega apenas as palavras da programação do dia atual do aparelho.
 * Futura integração Supabase:
 * const { data, error } = await supabase.from('words').select('*').eq('date', currentDate);
 */
export async function loadWordsToday(): Promise<Word[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const today = getCurrentDateBR();
  return wordsList.filter((w) => w.date === today);
}

/**
 * Carrega o histórico completo agrupado por datas cadastradas.
 * Futura integração Supabase:
 * Buscaria registros das tabelas 'songs' e 'words' agrupando-os por 'date'.
 */
export async function loadHistory(): Promise<HistoryEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

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
  await new Promise((resolve) => setTimeout(resolve, 100));

  const today = getCurrentDateBR();
  const todaySongs = songsList.filter((s) => s.date === today);
  const todayWords = wordsList.filter((w) => w.date === today);

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
