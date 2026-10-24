import React from 'react';
import { CollectionCategory, UserProgressData } from '../../types.ts';
import { audioController } from '../../utils/audioController.ts';
import { ArrowRight, Trophy, Sparkles, BookOpen, Coffee, Disc, Target } from 'lucide-react';

interface HomeScreenProps {
  progress: UserProgressData;
  onSelectCollection: (category: CollectionCategory) => void;
  onExploreCollections: () => void;
  onViewProgress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onSelectCollection,
  onExploreCollections,
  onViewProgress,
}) => {
  // Real stats calculation (no fake values)
  const completedCollectionsCount = [
    progress.completedCategories.taylor,
    progress.completedCategories.books,
    progress.completedCategories.matcha,
  ].filter(Boolean).length;

  const taylorProgress = progress.completedCategories.taylor ? 100 : progress.bestScoresByCategory.taylor > 0 ? 50 : 0;
  const booksProgress = progress.completedCategories.books ? 100 : progress.bestScoresByCategory.books > 0 ? 50 : 0;
  const matchaProgress = progress.completedCategories.matcha ? 100 : progress.bestScoresByCategory.matcha > 0 ? 50 : 0;

  return (
    <div className="w-full space-y-12 sm:space-y-16 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* HERO SECTION — DISEÑO EDITORIAL DE ESCRITORIO             */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-white/70 border border-[#EAE3D6] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DDF3] text-[#5A387E] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#987CB0]" />
              <span>Juego de Memoria Cozy & Visual</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#38343B] font-serif-display leading-[1.15]">
              Un pequeño momento para recordar
            </h1>

            <p className="text-base sm:text-lg text-[#77717D] max-w-xl font-normal leading-relaxed">
              Encuentra parejas, descubre tus colecciones favoritas y disfruta cada partida en una atmósfera de calma, música suave y diseño editorial.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => {
                  audioController.playUiTick();
                  onExploreCollections();
                }}
                className="px-6 py-3.5 rounded-2xl bg-[#38343B] hover:bg-[#252227] text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
              >
                <span>Explorar colecciones</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  audioController.playUiTick();
                  onViewProgress();
                }}
                className="px-5 py-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#DDD5C8] text-[#38343B] font-medium text-sm transition-colors cursor-pointer shadow-2xs"
              >
                Mi progreso
              </button>
            </div>
          </div>

          {/* Right Column: High Quality Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D7] shadow-md aspect-[16/10] bg-[#FAF8F5]">
              <img
                src="/src/assets/images/hero_little_moments_cozy_1792873139165.jpg"
                alt="Ambiente Little Moments con lectura, matcha y vinilo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 text-white text-left">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-white/90">
                  Atmósfera Little Moments
                </span>
                <p className="text-xs text-white/95 font-serif-display">
                  Música, literatura y el ritual del té
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN DE COLECCIONES (3 TARJETAS GRANDES)               */}
      {/* ========================================================= */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-normal text-[#38343B] font-serif-display tracking-tight">
            Colecciones Temáticas
          </h2>
          <p className="text-sm text-[#77717D] mt-1">
            Cada colección cuenta con identidad gráfica propia y sus propias cartas independientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Taylor's Version */}
          <div className="bg-white rounded-3xl border border-[#EAE3D6] overflow-hidden p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="space-y-3.5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF5FD] border border-[#E9E0F2]">
                <img
                  src="/src/assets/images/card_ts_lover_vinyl_1792870281598.jpg"
                  alt="Taylor's Version Colección"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[#644288] flex items-center gap-1 shadow-2xs">
                  <Disc className="w-3 h-3 text-[#987CB0]" />
                  <span>11 Eras Oficiales</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal text-[#38343B] font-serif-display">
                  Taylor's Version
                </h3>
                <p className="text-xs text-[#77717D] mt-1 leading-relaxed">
                  Portadas de vinilo icónicas con reproducción de la canción más famosa de cada era al completar el reto.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F2ECE2] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#77717D] block">Progreso</span>
                <span className="text-xs font-bold text-[#644288] font-mono">{taylorProgress}%</span>
              </div>
              <button
                onClick={() => {
                  audioController.playUiTick();
                  onSelectCollection('taylor');
                }}
                className="px-4 py-2 rounded-xl bg-[#E8DDF3] hover:bg-[#DBC9EB] text-[#5A387E] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Jugar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Entre páginas */}
          <div className="bg-white rounded-3xl border border-[#EAE3D6] overflow-hidden p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="space-y-3.5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF5F6] border border-[#F4D3DA]">
                <img
                  src="/src/assets/images/card_feminist_book_one_1792870280264.jpg"
                  alt="Entre páginas Colección"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[#9A4358] flex items-center gap-1 shadow-2xs">
                  <BookOpen className="w-3 h-3 text-[#9A4358]" />
                  <span>Biblioteca Literaria</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal text-[#38343B] font-serif-display">
                  Entre páginas
                </h3>
                <p className="text-xs text-[#77717D] mt-1 leading-relaxed">
                  Biblioteca visual de literatura feminista y obras de autoras ilustres como Virginia Woolf y Simone de Beauvoir.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F2ECE2] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#77717D] block">Progreso</span>
                <span className="text-xs font-bold text-[#9A4358] font-mono">{booksProgress}%</span>
              </div>
              <button
                onClick={() => {
                  audioController.playUiTick();
                  onSelectCollection('books');
                }}
                className="px-4 py-2 rounded-xl bg-[#F4DDE5] hover:bg-[#E9C8D4] text-[#87364A] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Jugar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Matcha Moments */}
          <div className="bg-white rounded-3xl border border-[#EAE3D6] overflow-hidden p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="space-y-3.5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F6FAF6] border border-[#CCE0CE]">
                <img
                  src="/src/assets/images/card_matcha_ceremony_1792870280763.jpg"
                  alt="Matcha Moments Colección"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[#3E6548] flex items-center gap-1 shadow-2xs">
                  <Coffee className="w-3 h-3 text-[#3E6548]" />
                  <span>Ritual & Degustación</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-normal text-[#38343B] font-serif-display">
                  Matcha Moments
                </h3>
                <p className="text-xs text-[#77717D] mt-1 leading-relaxed">
                  Elementos artesanales del ritual del té verde: chawan cerámico, batidor chasen de bambú y lattes botánicos.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F2ECE2] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#77717D] block">Progreso</span>
                <span className="text-xs font-bold text-[#3E6548] font-mono">{matchaProgress}%</span>
              </div>
              <button
                onClick={() => {
                  audioController.playUiTick();
                  onSelectCollection('matcha');
                }}
                className="px-4 py-2 rounded-xl bg-[#DCE8D5] hover:bg-[#C9DAC1] text-[#33563C] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Jugar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN INFERIOR — MÉTRICAS GLOBALES REALES (INICIO EN 0) */}
      {/* ========================================================= */}
      <section className="bg-white/80 border border-[#EAE3D6] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#ECE5DA]">
          <div className="text-center px-3 pt-3 md:pt-0">
            <span className="text-xs uppercase tracking-wider text-[#77717D] font-medium block">
              Mejor Puntuación
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#38343B] font-mono tabular-nums mt-1">
              {progress.bestScoreOverall.toLocaleString()} <span className="text-xs font-normal text-[#77717D]">pts</span>
            </div>
          </div>

          <div className="text-center px-3 pt-3 md:pt-0">
            <span className="text-xs uppercase tracking-wider text-[#77717D] font-medium block">
              Partidas Completadas
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#987CB0] font-mono tabular-nums mt-1">
              {progress.totalGamesPlayed}
            </div>
          </div>

          <div className="text-center px-3 pt-3 md:pt-0">
            <span className="text-xs uppercase tracking-wider text-[#77717D] font-medium block">
              Precisión Media
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#476C55] font-mono tabular-nums mt-1 flex items-center justify-center gap-1">
              <Target className="w-5 h-5 text-[#476C55]" />
              <span>{Math.round(progress.accuracyAverage)}%</span>
            </div>
          </div>

          <div className="text-center px-3 pt-3 md:pt-0">
            <span className="text-xs uppercase tracking-wider text-[#77717D] font-medium block">
              Colecciones Descubiertas
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#B37D28] font-mono tabular-nums mt-1 flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-[#B37D28]" />
              <span>{completedCollectionsCount} / 3</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
