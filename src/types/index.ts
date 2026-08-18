export interface Song {
  id: string;
  personName?: string | null;
  singer?: string | null;
  songName?: string | null;
  youtubeUrl?: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

export interface SongInput {
  personName?: string;
  singer?: string;
  songName?: string;
  youtubeUrl?: string;
}

export interface Word {
  id: string;
  book?: string | null;
  chapter?: number | null;
  verse?: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

export interface WordInput {
  book?: string;
  chapter?: number | string;
  verse?: string;
}

export interface HistoryEntry {
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g., "30/07/2026 (Quinta-feira)"
  songs: Song[];
  words: Word[];
  totalSongs: number;
  totalWords: number;
}

export interface DashboardStats {
  currentDateFormatted: string;
  todaySongsCount: number;
  todayWordsCount: number;
  todayTotalSubmissions: number;
  totalSongs: number;
  totalWords: number;
  grandTotal: number;
}

export type DatabaseTab = 'songs' | 'words';
