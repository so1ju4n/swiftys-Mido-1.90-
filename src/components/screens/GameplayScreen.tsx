import React from 'react';
import { CollectionCategory, GameDifficulty, MemoryCard, GameStats, CardItem } from '../../types.ts';
import { PolaroidCard } from '../PolaroidCard.tsx';
import { audioController } from '../../utils/audioController.ts';
import { Play, Pause, RotateCcw, ArrowLeft, Clock, Target, Trophy, Sparkles, Volume2 } from 'lucide-react';

interface GameplayScreenProps {
  category: CollectionCategory;
  specificItem?: CardItem | null;
  difficulty: GameDifficulty;
  deck: MemoryCard[];
  flippedIndices: number[];
  stats: GameStats;
  isLocked: boolean;
  onCardClick: (index: number) => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onBackToCollections: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  category,
  specificItem,
  difficulty,
  deck,
  flippedIndices,
  stats,
  isLocked,
  onCardClick,
  onTogglePause,
  onRestart,
  onBackToCollections,
}) => {
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = stats.totalPairs > 0 ? Math.round((stats.matches / stats.totalPairs) * 100) : 0;

  // Grid columns layout based on difficulty / pairs
  // Fácil (6 parejas = 12 cartas): 4x3
  // Medio (8 parejas = 16 cartas): 4x4
  // Difícil (12 parejas = 24 cartas): 6x4 (en desktop) / 4x6 (en tablet/móvil)
  const gridClasses =
    stats.totalPairs === 6
      ? 'grid-cols-3 sm:grid-cols-4'
      : stats.totalPairs === 8
      ? 'grid-cols-4'
      : 'grid-cols-4 lg:grid-cols-6';

  const collectionTitle = specificItem
    ? specificItem.title
    : category === 'taylor'
    ? "Taylor's Version"
    : category === 'books'
    ? 'Entre páginas'
    : 'Matcha Moments';

  const collectionSubtitle = specificItem
    ? specificItem.subtitle
    : category === 'taylor'
    ? '11 Eras Oficiales & Canciones'
    : category === 'books'
    ? 'Literatura & Pensamiento Feminista'
    : 'Cultura del Té & Repostería';

  const previewImage = specificItem ? specificItem.image : deck[0]?.item.image;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-left">
      {/* ========================================================= */}
      {/* DESKTOP 3-COLUMN LAYOUT (PRIORITARIO)                      */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* PANEL IZQUIERDO (3 COLUMNAS): INFO & CONTEXTO             */}
        {/* ========================================================= */}
        <aside className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          <div className="bg-white rounded-3xl border border-[#EAE3D6] p-5 shadow-xs space-y-4">
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#987CB0] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#987CB0]">
                Colección en Juego
              </span>
            </div>

            {/* Thumbnail preview */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#EDE7DD] bg-[#FAF8F5]">
              <img
                src={previewImage}
                alt={collectionTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-xl font-normal text-[#38343B] font-serif-display leading-tight">
                {collectionTitle}
              </h3>
              <p className="text-xs text-[#77717D] mt-1">
                {collectionSubtitle}
              </p>
            </div>

            {/* Current Game Progress Bar */}
            <div className="pt-2 border-t border-[#F2ECE2] space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#77717D]">Progreso de la partida</span>
                <span className="font-bold text-[#38343B] font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#EFEBE4] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#E8DDF3] via-[#F4DDE5] to-[#987CB0] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Note or Active Quote */}
            {specificItem?.quoteOrNote && (
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE5DA] text-[11px] text-[#77717D] italic font-serif-display leading-relaxed">
                {specificItem.quoteOrNote}
              </div>
            )}
          </div>
        </aside>

        {/* ========================================================= */}
        {/* ZONA CENTRAL (6-7 COLUMNAS): TABLERO DOMINANTE            */}
        {/* ========================================================= */}
        <section className="lg:col-span-6 space-y-4 order-1 lg:order-2">
          {/* Board Container */}
          <div className="relative bg-white/60 backdrop-blur-xs border border-[#EAE3D6] rounded-3xl p-4 sm:p-6 shadow-xs min-h-[460px] flex items-center justify-center">
            {/* PAUSE OVERLAY (Oculta las cartas para evitar trampa) */}
            {stats.isPaused && (
              <div className="absolute inset-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-[#E8DDF3] text-[#5A387E] flex items-center justify-center shadow-xs">
                  <Pause className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-normal text-[#38343B] font-serif-display">
                  Partida Pausada
                </h3>
                <p className="text-xs text-[#77717D] max-w-xs">
                  Las cartas permanecen ocultas durante la pausa para proteger tu récord.
                </p>
                <button
                  onClick={onTogglePause}
                  className="mt-2 px-6 py-3 rounded-2xl bg-[#38343B] hover:bg-[#252227] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reanudar partida</span>
                </button>
              </div>
            )}

            {/* Active Cards Grid */}
            <div className={`w-full grid ${gridClasses} gap-3 sm:gap-4`}>
              {deck.map((card, idx) => {
                const isFlipped = flippedIndices.includes(idx);
                return (
                  <PolaroidCard
                    key={card.uid}
                    card={{ ...card, isFlipped }}
                    disabled={isLocked || stats.isPaused}
                    onClick={() => onCardClick(idx)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PANEL DERECHO (3 COLUMNAS): HUD METRICAS & ACCIONES       */}
        {/* ========================================================= */}
        <aside className="lg:col-span-3 space-y-4 order-3">
          <div className="bg-white rounded-3xl border border-[#EAE3D6] p-5 shadow-xs space-y-5">
            {/* HUD Metricas Principales (Tabular Numerals) */}
            <div className="space-y-4">
              {/* Tiempo */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DA]">
                <div className="flex items-center justify-between text-xs text-[#77717D] mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#5A387E]" />
                    <span>Tiempo</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">mm:ss</span>
                </div>
                <div className="text-3xl font-bold text-[#38343B] font-mono tabular-nums">
                  {formatTime(stats.timeSeconds)}
                </div>
              </div>

              {/* Intentos & Parejas */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DA]">
                  <span className="text-[11px] text-[#77717D] block mb-0.5">Intentos</span>
                  <div className="text-2xl font-bold text-[#38343B] font-mono tabular-nums">
                    {stats.moves}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DA]">
                  <span className="text-[11px] text-[#77717D] block mb-0.5">Parejas</span>
                  <div className="text-2xl font-bold text-[#476C55] font-mono tabular-nums">
                    {stats.matches}<span className="text-sm font-normal text-slate-400">/{stats.totalPairs}</span>
                  </div>
                </div>
              </div>

              {/* Puntuación */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DA]">
                <div className="flex items-center justify-between text-xs text-[#77717D] mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Trophy className="w-3.5 h-3.5 text-[#B37D28]" />
                    <span>Puntuación</span>
                  </span>
                  <span className="text-[10px] text-[#476C55] font-semibold">Precisión: {Math.round(stats.accuracy)}%</span>
                </div>
                <div className="text-3xl font-bold text-[#B37D28] font-mono tabular-nums">
                  {stats.score.toLocaleString()} <span className="text-xs font-normal text-[#77717D]">pts</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-[#F2ECE2] space-y-2">
              <button
                onClick={onTogglePause}
                className="w-full py-2.5 px-4 rounded-xl border border-[#DDD5C8] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#38343B] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                {stats.isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Reanudar</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar partida</span>
                  </>
                )}
              </button>

              <button
                onClick={onRestart}
                className="w-full py-2.5 px-4 rounded-xl border border-[#DDD5C8] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#38343B] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reiniciar tablero</span>
              </button>

              <button
                onClick={onBackToCollections}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#77717D] hover:text-[#38343B] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a colecciones</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
