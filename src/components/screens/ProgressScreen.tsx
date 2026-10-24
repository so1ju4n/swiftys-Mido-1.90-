import React from 'react';
import { UserProgressData } from '../../types.ts';
import { audioController } from '../../utils/audioController.ts';
import { Trophy, Star, Target, Trash2, ArrowRight, Disc, BookOpen, Coffee, Award } from 'lucide-react';

interface ProgressScreenProps {
  progress: UserProgressData;
  onClearProgress: () => void;
  onStartCollection: (category: 'taylor' | 'books' | 'matcha') => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  progress,
  onClearProgress,
  onStartCollection,
}) => {
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalStars = progress.records.reduce((acc, r) => acc + (r.stars || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      {/* Page Title */}
      <div>
        <span className="text-xs uppercase tracking-wider text-[#77717D] font-semibold">
          Tu Trayectoria
        </span>
        <h2 className="text-3xl sm:text-4xl font-normal text-[#38343B] font-serif-display tracking-tight mt-0.5">
          Mi Progreso & Récords
        </h2>
        <p className="text-sm text-[#77717D] mt-1">
          Estadísticas reales y registros guardados localmente en tu navegador.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#EAE3D6] shadow-2xs">
          <span className="text-xs text-[#77717D] uppercase tracking-wider font-semibold block mb-1">
            Partidas
          </span>
          <div className="text-3xl font-bold text-[#38343B] font-mono tabular-nums">
            {progress.totalGamesPlayed}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EAE3D6] shadow-2xs">
          <span className="text-xs text-[#77717D] uppercase tracking-wider font-semibold block mb-1">
            Mejor Puntuación
          </span>
          <div className="text-3xl font-bold text-[#B37D28] font-mono tabular-nums">
            {progress.bestScoreOverall.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EAE3D6] shadow-2xs">
          <span className="text-xs text-[#77717D] uppercase tracking-wider font-semibold block mb-1">
            Precisión Media
          </span>
          <div className="text-3xl font-bold text-[#476C55] font-mono tabular-nums flex items-center gap-1.5">
            <Target className="w-5 h-5 text-[#476C55]" />
            <span>{Math.round(progress.accuracyAverage)}%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EAE3D6] shadow-2xs">
          <span className="text-xs text-[#77717D] uppercase tracking-wider font-semibold block mb-1">
            Estrellas Ganadas
          </span>
          <div className="text-3xl font-bold text-[#D4932F] font-mono tabular-nums flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-[#E89E30] text-[#D4932F]" />
            <span>{totalStars}</span>
          </div>
        </div>
      </div>

      {/* Progress by Category */}
      <div className="bg-white rounded-3xl border border-[#EAE3D6] p-6 shadow-xs space-y-4">
        <h3 className="text-xl font-normal text-[#38343B] font-serif-display">
          Estado por Colección
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Taylor */}
          <div className="p-4 rounded-2xl bg-[#FAF6FD] border border-[#E8DAF2] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-[#987CB0]" />
                <span className="text-xs font-bold text-[#38343B]">Taylor's Version</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#5A387E]">
                {progress.completedCategories.taylor ? 'Completada' : 'En progreso'}
              </span>
            </div>
            <div className="text-sm font-semibold text-[#5A387E] font-mono">
              Récord: {progress.bestScoresByCategory.taylor.toLocaleString()} pts
            </div>
            <button
              onClick={() => {
                audioController.playUiTick();
                onStartCollection('taylor');
              }}
              className="text-xs text-[#5A387E] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Jugar esta colección</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Books */}
          <div className="p-4 rounded-2xl bg-[#FDF6F8] border border-[#F4D3DA] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#9A4358]" />
                <span className="text-xs font-bold text-[#38343B]">Entre páginas</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#9A4358]">
                {progress.completedCategories.books ? 'Completada' : 'En progreso'}
              </span>
            </div>
            <div className="text-sm font-semibold text-[#9A4358] font-mono">
              Récord: {progress.bestScoresByCategory.books.toLocaleString()} pts
            </div>
            <button
              onClick={() => {
                audioController.playUiTick();
                onStartCollection('books');
              }}
              className="text-xs text-[#9A4358] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Jugar esta colección</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Matcha */}
          <div className="p-4 rounded-2xl bg-[#F4FAF4] border border-[#CCE0CE] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#3E6548]" />
                <span className="text-xs font-bold text-[#38343B]">Matcha Moments</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#3E6548]">
                {progress.completedCategories.matcha ? 'Completada' : 'En progreso'}
              </span>
            </div>
            <div className="text-sm font-semibold text-[#3E6548] font-mono">
              Récord: {progress.bestScoresByCategory.matcha.toLocaleString()} pts
            </div>
            <button
              onClick={() => {
                audioController.playUiTick();
                onStartCollection('matcha');
              }}
              className="text-xs text-[#3E6548] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Jugar esta colección</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Match History Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D6] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-normal text-[#38343B] font-serif-display">
            Historial de Partidas
          </h3>
          {progress.records.length > 0 && (
            <button
              onClick={onClearProgress}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar historial</span>
            </button>
          )}
        </div>

        {progress.records.length > 0 ? (
          <div className="divide-y divide-[#F2ECE2] overflow-x-auto">
            {progress.records.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#38343B] truncate">{rec.collectionTitle}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EDE7DD] text-[#77717D]">
                      {rec.difficulty === 'easy' ? 'Fácil' : rec.difficulty === 'normal' ? 'Medio' : 'Difícil'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#77717D] font-mono mt-0.5">
                    <span>{rec.date}</span>
                    <span>·</span>
                    <span>{rec.moves} intentos</span>
                    <span>·</span>
                    <span>{formatTime(rec.timeSeconds)}</span>
                    <span>·</span>
                    <span>{rec.accuracy}% precisión</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-[#38343B] font-mono tabular-nums block">
                    {rec.score.toLocaleString()} pts
                  </span>
                  <div className="flex text-[#D4932F] text-xs justify-end">
                    {'★'.repeat(rec.stars)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#77717D] text-xs">
            <Award className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
            <p className="font-semibold text-slate-600">Aún no hay partidas registradas.</p>
            <p className="text-[11px] mt-0.5">Tus partidas y récords completados aparecerán aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};
