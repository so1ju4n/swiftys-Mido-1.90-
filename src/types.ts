export type AppScreen = 'home' | 'collections' | 'setup' | 'game' | 'progress' | 'settings';

export type CollectionCategory = 'taylor' | 'books' | 'matcha';

export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface CardItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: CollectionCategory;
  categoryLabel: string;
  image: string;
  quoteOrNote: string;
  // Specific metadata
  year?: number | string;
  author?: string;
  recipeType?: string;
  famousSong?: {
    title: string;
    description: string;
    audioUrl: string;
    spotifySearchUrl: string;
  };
  pastelTheme: {
    bg: string;
    border: string;
    accent: string;
    text: string;
  };
}

export interface MemoryCard {
  uid: string;
  item: CardItem;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameStats {
  moves: number;
  timeSeconds: number;
  matches: number;
  totalPairs: number;
  score: number;
  stars: 1 | 2 | 3;
  accuracy: number;
  isPaused: boolean;
  isCompleted: boolean;
}

export interface GameRecord {
  id: string;
  date: string;
  category: CollectionCategory;
  collectionTitle: string;
  difficulty: GameDifficulty;
  moves: number;
  timeSeconds: number;
  accuracy: number;
  score: number;
  stars: number;
}

export interface UserProgressData {
  totalGamesPlayed: number;
  totalMovesCount: number;
  bestScoreOverall: number;
  accuracyAverage: number;
  completedCategories: {
    taylor: boolean;
    books: boolean;
    matcha: boolean;
  };
  bestScoresByCategory: {
    taylor: number;
    books: number;
    matcha: number;
  };
  records: GameRecord[];
}

export interface AudioPreferences {
  bgmVolume: number; // 0.0 to 1.0 (default 0.20)
  sfxVolume: number; // 0.0 to 1.0 (default 0.70)
  isBgmMuted: boolean;
  isSfxMuted: boolean;
  isMasterMuted: boolean;
}
