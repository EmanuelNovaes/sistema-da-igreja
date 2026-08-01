export interface Song {
  id: string;
  personName: string;
  songName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: string; // ISO string
}

export interface SongInput {
  personName: string;
  songName: string;
}

export interface Word {
  id: string;
  book: string;
  chapter: number;
  verse: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: string; // ISO string
}

export interface WordInput {
  book: string;
  chapter: number;
  verse: string;
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
