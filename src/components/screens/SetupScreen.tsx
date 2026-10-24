import React from 'react';
import { CollectionCategory, GameDifficulty, CardItem } from '../../types.ts';
import { ALL_CARD_ITEMS } from '../../data/cardsData.ts';
import { audioController } from '../../utils/audioController.ts';
import { ArrowLeft, Play, ShieldAlert, Sparkles, Layers, Clock, Award } from 'lucide-react';

interface SetupScreenProps {
  category: CollectionCategory;
  specificItemId?: string;
  difficulty: GameDifficulty;
  onSelectDifficulty: (d: GameDifficulty) => void;
  onStartGame: () => void;
  onBack: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  category,
  specificItemId,
  difficulty,
  onSelectDifficulty,
  onStartGame,
  onBack,
}) => {
  const categoryItems = ALL_CARD_ITEMS.filter((i) => i.category === category);
  const specificItem = specificItemId ? ALL_CARD_ITEMS.find((i) => i.id === specificItemId) : null;

  // Count available unique images
  const availableCount = categoryItems.length;

  const collectionTitle = specificItem
    ? specificItem.title
    : category === 'taylor'
    ? "Taylor's Version — Todas las Eras"
    : category === 'books'
    ? 'Entre páginas — Biblioteca Feminista'
    : 'Matcha Moments — Ritual & Bar';

  const previewImage = specificItem ? specificItem.image : categoryItems[0]?.image;

  // Dificultades y validación
  // Fácil = 6 parejas (requiere al menos 6 cartas)
  // Medio = 8 parejas (requiere al menos 8 cartas)
  // Difícil = 12 parejas (requiere 12 cartas)
  const isHardAvailable = availableCount >= 11; // Taylor has 11-12
  const isMediumAvailable = availableCount >= 6; // All have at least 6

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      {/* Back Button */}
      <button
        onClick={() => {
          audioController.playUiTick();
          onBack();
        }}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#77717D] hover:text-[#38343B] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a colecciones</span>
      </button>

      {/* Main Configuration Card */}
      <div className="bg-white rounded-3xl border border-[#EAE3D6] p-6 sm:p-10 shadow-sm space-y-8">
        {/* Collection Summary Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DA]">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
            <img
              src={previewImage}
              alt={collectionTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#987CB0] border border-[#EADDF3]">
              <Sparkles className="w-3 h-3" />
              <span>Colección Seleccionada</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-normal text-[#38343B] font-serif-display">
              {collectionTitle}
            </h3>
            <p className="text-xs text-[#77717D]">
              {availableCount} imágenes exclusivas disponibles en esta colección
            </p>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-bold text-[#38343B]">Selecciona la Dificultad</h4>
            <p className="text-xs text-[#77717D]">
              Elige el tamaño del tablero y la cantidad de parejas a encontrar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Fácil: 6 Parejas (4x3) */}
            <button
              onClick={() => {
                audioController.playUiTick();
                onSelectDifficulty('easy');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                difficulty === 'easy'
                  ? 'border-[#987CB0] bg-[#FAF6FD] ring-2 ring-[#987CB0]/30 shadow-xs'
                  : 'border-[#EDE7DD] bg-white hover:border-[#D5CDC1]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-[#38343B]">Fácil</span>
                <span className="text-[10px] font-mono text-[#987CB0] bg-white px-2 py-0.5 rounded-full border border-[#EADDF3]">
                  4 × 3
                </span>
              </div>
              <p className="text-xs text-[#77717D]">6 Parejas (12 cartas)</p>
              <span className="text-[10px] text-slate-500 mt-2 block font-mono">Tiempo par: 75 seg</span>
            </button>

            {/* Medio: 8 Parejas (4x4) */}
            <button
              disabled={!isMediumAvailable}
              onClick={() => {
                audioController.playUiTick();
                onSelectDifficulty('normal');
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                !isMediumAvailable
                  ? 'opacity-50 cursor-not-allowed bg-slate-50'
                  : difficulty === 'normal'
                  ? 'border-[#987CB0] bg-[#FAF6FD] ring-2 ring-[#987CB0]/30 shadow-xs cursor-pointer'
                  : 'border-[#EDE7DD] bg-white hover:border-[#D5CDC1] cursor-pointer'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-[#38343B]">Medio</span>
                <span className="text-[10px] font-mono text-[#987CB0] bg-white px-2 py-0.5 rounded-full border border-[#EADDF3]">
                  4 × 4
                </span>
              </div>
              <p className="text-xs text-[#77717D]">8 Parejas (16 cartas)</p>
              <span className="text-[10px] text-slate-500 mt-2 block font-mono">Tiempo par: 96 seg</span>
            </button>

            {/* Difícil: 12 Parejas (6x4) */}
            <button
              disabled={!isHardAvailable}
              onClick={() => {
                if (isHardAvailable) {
                  audioController.playUiTick();
                  onSelectDifficulty('hard');
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                !isHardAvailable
                  ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                  : difficulty === 'hard'
                  ? 'border-[#987CB0] bg-[#FAF6FD] ring-2 ring-[#987CB0]/30 shadow-xs cursor-pointer'
                  : 'border-[#EDE7DD] bg-white hover:border-[#D5CDC1] cursor-pointer'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-[#38343B]">Difícil</span>
                <span className="text-[10px] font-mono text-[#987CB0] bg-white px-2 py-0.5 rounded-full border border-[#EADDF3]">
                  6 × 4
                </span>
              </div>
              <p className="text-xs text-[#77717D]">12 Parejas (24 cartas)</p>
              <span className="text-[10px] text-slate-500 mt-2 block font-mono">Tiempo par: 144 seg</span>
            </button>
          </div>

          {!isHardAvailable && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-[#77717D]">
              <ShieldAlert className="w-4 h-4 text-[#B37D28] shrink-0" />
              <span>
                El modo Difícil (12 parejas) está habilitado exclusivamente para el Gran Reto de Taylor's Version por requerir 12 imágenes únicas.
              </span>
            </div>
          )}
        </div>

        {/* Game Rules & Scoring Overview */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE5DA] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#77717D]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#987CB0]" />
            <span>+100 pts por acierto</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B37D28]" />
            <span>Hasta +300 pts bono rapidez</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#476C55]" />
            <span>-10 pts por fallo</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => {
              audioController.playUiTick();
              onBack();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#DDD5C8] text-xs font-semibold text-[#77717D] hover:text-[#38343B] transition-colors cursor-pointer"
          >
            Volver
          </button>

          <button
            onClick={() => {
              audioController.playUiTick();
              onStartGame();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#38343B] hover:bg-[#252227] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Comenzar partida</span>
          </button>
        </div>
      </div>
    </div>
  );
};
