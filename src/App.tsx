/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppScreen,
  CollectionCategory,
  GameDifficulty,
  MemoryCard,
  GameStats,
  GameRecord,
  UserProgressData,
  CardItem,
} from './types.ts';
import { ALL_CARD_ITEMS } from './data/cardsData.ts';
import { audioController } from './utils/audioController.ts';
import { Navbar } from './components/Navbar.tsx';
import { HomeScreen } from './components/screens/HomeScreen.tsx';
import { CollectionsScreen } from './components/screens/CollectionsScreen.tsx';
import { SetupScreen } from './components/screens/SetupScreen.tsx';
import { GameplayScreen } from './components/screens/GameplayScreen.tsx';
import { ResultsModal } from './components/screens/ResultsModal.tsx';
import { ProgressScreen } from './components/screens/ProgressScreen.tsx';
import { SettingsModal } from './components/screens/SettingsModal.tsx';

const DEFAULT_PROGRESS: UserProgressData = {
  totalGamesPlayed: 0,
  totalMovesCount: 0,
  bestScoreOverall: 0,
  accuracyAverage: 0,
  completedCategories: {
    taylor: false,
    books: false,
    matcha: false,
  },
  bestScoresByCategory: {
    taylor: 0,
    books: 0,
    matcha: 0,
  },
  records: [],
};

export default function App() {
  // Navigation & Screen routing
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeCategory, setActiveCategory] = useState<CollectionCategory>('taylor');
  const [specificItemId, setSpecificItemId] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // User Progress & Persistent Storage
  const [progress, setProgress] = useState<UserProgressData>(() => {
    try {
      const saved = localStorage.getItem('little_moments_user_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          completedCategories: { ...DEFAULT_PROGRESS.completedCategories, ...parsed.completedCategories },
          bestScoresByCategory: { ...DEFAULT_PROGRESS.bestScoresByCategory, ...parsed.bestScoresByCategory },
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });

  // Gameplay State
  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const timerRef = useRef<number | null>(null);

  // Par time targets by pairs count
  const getParTime = (pairsCount: number): number => {
    return pairsCount * 12; // 6 pairs -> 72s, 8 pairs -> 96s, 12 pairs -> 144s
  };

  // Pairs required per difficulty
  const getPairsCount = useCallback((diff: GameDifficulty, cat: CollectionCategory): number => {
    const totalAvailable = ALL_CARD_ITEMS.filter((i) => i.category === cat).length;
    if (diff === 'easy') return Math.min(6, totalAvailable);
    if (diff === 'normal') return Math.min(8, totalAvailable);
    return Math.min(12, totalAvailable);
  }, []);

  const currentPairsCount = getPairsCount(difficulty, activeCategory);

  // Accuracy calculation: (matches / moves) * 100
  const currentAccuracy = moves > 0 ? Math.min(100, Math.round((matchedIds.size / moves) * 100)) : 100;

  // Star calculation
  const calculateStars = (accuracy: number, timeSec: number, pairsCount: number): 1 | 2 | 3 => {
    const par = getParTime(pairsCount);
    if (accuracy >= 65 && timeSec <= par * 1.2) return 3;
    if (accuracy >= 45) return 2;
    return 1;
  };

  // Deck generation
  const buildDeck = useCallback(() => {
    let pool = ALL_CARD_ITEMS.filter((i) => i.category === activeCategory);

    // If specific item selected, ensure that item is in the deck
    if (specificItemId) {
      const target = pool.find((i) => i.id === specificItemId);
      if (target) {
        const others = pool.filter((i) => i.id !== specificItemId).sort(() => Math.random() - 0.5);
        pool = [target, ...others];
      }
    } else {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }

    const selected = pool.slice(0, currentPairsCount);

    const cards: MemoryCard[] = [];
    selected.forEach((item) => {
      cards.push({ uid: `${item.id}-a`, item, isFlipped: false, isMatched: false });
      cards.push({ uid: `${item.id}-b`, item, isFlipped: false, isMatched: false });
    });

    const shuffled = cards.sort(() => Math.random() - 0.5);

    setDeck(shuffled);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setMoves(0);
    setTimeSeconds(0);
    setTimerActive(false);
    setIsPaused(false);
    setScore(0);
    setIsLocked(false);
    setIsResultsOpen(false);
    setIsNewRecord(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [activeCategory, specificItemId, currentPairsCount]);

  // Timer loop
  useEffect(() => {
    if (timerActive && !isPaused && !isResultsOpen) {
      timerRef.current = window.setInterval(() => {
        setTimeSeconds((s) => s + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, isPaused, isResultsOpen]);

  // Handle card click
  const handleCardClick = (idx: number) => {
    if (isLocked || isPaused) return;
    if (flippedIndices.includes(idx)) return;
    if (deck[idx].isMatched) return;

    if (!timerActive) {
      setTimerActive(true);
    }

    audioController.playCardFlip();
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = deck[firstIdx];
      const secondCard = deck[secondIdx];

      if (firstCard.item.id === secondCard.item.id) {
        // MATCH!
        audioController.playMatchChime();

        // Formula: +100 per matched pair
        setScore((prev) => prev + 100);

        const newMatched = new Set(matchedIds);
        newMatched.add(firstCard.item.id);
        setMatchedIds(newMatched);

        setDeck((prev) =>
          prev.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c))
        );

        setFlippedIndices([]);
        setIsLocked(false);

        // Check Victory
        if (newMatched.size === currentPairsCount) {
          setTimerActive(false);

          // Calculate time bonus
          const parTime = getParTime(currentPairsCount);
          const timeBonus = Math.max(0, Math.min(300, Math.round((parTime - timeSeconds) * 5)));
          const finalScore = Math.max(0, score + 100 + timeBonus);
          setScore(finalScore);

          const finalAccuracy = Math.round((currentPairsCount / nextMoves) * 100);
          const stars = calculateStars(finalAccuracy, timeSeconds, currentPairsCount);

          // Save game record and update progress
          const recordTitle = specificItemId
            ? (firstCard.item.title)
            : activeCategory === 'taylor'
            ? "Taylor's Version"
            : activeCategory === 'books'
            ? 'Entre páginas'
            : 'Matcha Moments';

          const newRecord: GameRecord = {
            id: String(Date.now()),
            date: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
            category: activeCategory,
            collectionTitle: recordTitle,
            difficulty,
            moves: nextMoves,
            timeSeconds,
            accuracy: finalAccuracy,
            score: finalScore,
            stars,
          };

          const isTop = finalScore > progress.bestScoreOverall;
          setIsNewRecord(isTop);

          const updatedRecords = [newRecord, ...progress.records].slice(0, 20);
          const totalPlayed = progress.totalGamesPlayed + 1;
          const totalMoves = progress.totalMovesCount + nextMoves;
          const newAccuracyAvg =
            Math.round(
              updatedRecords.reduce((acc, r) => acc + r.accuracy, 0) / updatedRecords.length
            ) || finalAccuracy;

          const updatedCategoryBest = Math.max(
            progress.bestScoresByCategory[activeCategory] || 0,
            finalScore
          );

          const newProgress: UserProgressData = {
            totalGamesPlayed: totalPlayed,
            totalMovesCount: totalMoves,
            bestScoreOverall: Math.max(progress.bestScoreOverall, finalScore),
            accuracyAverage: newAccuracyAvg,
            completedCategories: {
              ...progress.completedCategories,
              [activeCategory]: true,
            },
            bestScoresByCategory: {
              ...progress.bestScoresByCategory,
              [activeCategory]: updatedCategoryBest,
            },
            records: updatedRecords,
          };

          setProgress(newProgress);
          try {
            localStorage.setItem('little_moments_user_progress', JSON.stringify(newProgress));
          } catch {
            // ignore
          }

          // If Taylor's Version, start the official song with fade-in
          if (activeCategory === 'taylor' && firstCard.item.famousSong?.audioUrl) {
            audioController.playMusicWithFadeIn(
              firstCard.item.famousSong.audioUrl,
              firstCard.item.famousSong.title,
              2.0
            );
          } else {
            audioController.playVictory();
          }

          setIsResultsOpen(true);
        }
      } else {
        // MISMATCH!
        audioController.playMismatch();

        // Formula: -10 penalty for incorrect move (never below 0)
        setScore((prev) => Math.max(0, prev - 10));

        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  const handleTogglePause = () => {
    audioController.playPause();
    setIsPaused((p) => !p);
  };

  const handleRestart = () => {
    audioController.playUiTick();
    buildDeck();
  };

  const handleStartSetup = (cat: CollectionCategory, specificId?: string) => {
    setActiveCategory(cat);
    setSpecificItemId(specificId);
    setScreen('setup');
  };

  const handleStartGame = () => {
    buildDeck();
    setScreen('game');
  };

  const handleClearProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem('little_moments_user_progress');
  };

  const specificCardItem = specificItemId
    ? ALL_CARD_ITEMS.find((i) => i.id === specificItemId)
    : null;

  const currentStats: GameStats = {
    moves,
    timeSeconds,
    matches: matchedIds.size,
    totalPairs: currentPairsCount,
    score,
    stars: calculateStars(currentAccuracy, timeSeconds, currentPairsCount),
    accuracy: currentAccuracy,
    isPaused,
    isCompleted: isResultsOpen,
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#38343B] flex flex-col font-sans selection:bg-[#F4DDE5]">
      {/* Global Top Navbar */}
      <Navbar
        currentScreen={screen}
        onNavigate={(newScreen) => {
          if (screen === 'game' && !isResultsOpen) {
            audioController.stopMusicWithFadeOut(0.5);
          }
          setScreen(newScreen);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Area (Responsive Container) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {screen === 'home' && (
          <HomeScreen
            progress={progress}
            onSelectCollection={(cat) => handleStartSetup(cat)}
            onExploreCollections={() => setScreen('collections')}
            onViewProgress={() => setScreen('progress')}
          />
        )}

        {screen === 'collections' && (
          <CollectionsScreen
            initialCategory={activeCategory}
            onStartSetup={(cat, specificId) => handleStartSetup(cat, specificId)}
          />
        )}

        {screen === 'setup' && (
          <SetupScreen
            category={activeCategory}
            specificItemId={specificItemId}
            difficulty={difficulty}
            onSelectDifficulty={(d) => setDifficulty(d)}
            onStartGame={handleStartGame}
            onBack={() => setScreen('collections')}
          />
        )}

        {screen === 'game' && (
          <GameplayScreen
            category={activeCategory}
            specificItem={specificCardItem}
            difficulty={difficulty}
            deck={deck}
            flippedIndices={flippedIndices}
            stats={currentStats}
            isLocked={isLocked}
            onCardClick={handleCardClick}
            onTogglePause={handleTogglePause}
            onRestart={handleRestart}
            onBackToCollections={() => {
              audioController.stopMusicWithFadeOut(0.5);
              setScreen('collections');
            }}
          />
        )}

        {screen === 'progress' && (
          <ProgressScreen
            progress={progress}
            onClearProgress={handleClearProgress}
            onStartCollection={(cat) => handleStartSetup(cat)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE3D6] py-6 px-4 text-center text-xs text-[#77717D] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif-display font-semibold text-[#38343B]">Little Moments</span>
            <span>·</span>
            <span>Juego de memoria visual & auditivo</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[#38343B] transition-colors cursor-pointer"
            >
              Configuración de Sonido
            </button>
            <span>·</span>
            <button
              onClick={() => setScreen('progress')}
              className="hover:text-[#38343B] transition-colors cursor-pointer"
            >
              Mi Progreso
            </button>
          </div>
        </div>
      </footer>

      {/* Results / Victory Modal */}
      <ResultsModal
        isOpen={isResultsOpen}
        category={activeCategory}
        specificItem={specificCardItem}
        difficulty={difficulty}
        stats={currentStats}
        isNewRecord={isNewRecord}
        onPlayAgain={handleRestart}
        onChangeDifficulty={() => {
          setIsResultsOpen(false);
          setScreen('setup');
        }}
        onNextCollection={() => {
          setIsResultsOpen(false);
          const nextCat: CollectionCategory =
            activeCategory === 'taylor' ? 'books' : activeCategory === 'books' ? 'matcha' : 'taylor';
          handleStartSetup(nextCat);
        }}
        onGoHome={() => {
          setIsResultsOpen(false);
          setScreen('home');
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
