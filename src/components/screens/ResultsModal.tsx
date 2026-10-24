import React, { useState } from 'react';
import { CollectionCategory, GameDifficulty, GameStats, CardItem } from '../../types.ts';
import { audioController } from '../../utils/audioController.ts';
import { Star, RotateCcw, ArrowRight, Home, Disc, Play, Pause, Volume2, Sparkles, Trophy, BookOpen, Coffee } from 'lucide-react';

interface ResultsModalProps {
  isOpen: boolean;
  category: CollectionCategory;
  specificItem?: CardItem | null;
  difficulty: GameDifficulty;
  stats: GameStats;
  isNewRecord: boolean;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  onNextCollection: () => void;
  onGoHome: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  category,
  specificItem,
  difficulty,
  stats,
  isNewRecord,
  onPlayAgain,
  onChangeDifficulty,
  onNextCollection,
  onGoHome,
}) => {
  const [isPlayingSong, setIsPlayingSong] = useState(false);

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const collectionTitle = specificItem
    ? specificItem.title
    : category === 'taylor'
    ? "Taylor's Version"
    : category === 'books'
    ? 'Entre páginas'
    : 'Matcha Moments';

  const previewImage = specificItem?.image || (category === 'taylor' ? '/src/assets/images/card_ts_lover_vinyl_1792870281598.jpg' : category === 'books' ? '/src/assets/images/card_feminist_book_one_1792870280264.jpg' : '/src/assets/images/card_matcha_ceremony_1792870280763.jpg');

  const song = specificItem?.famousSong || (category === 'taylor' ? {
    title: 'Cruel Summer',
    description: 'El himno pop más aclamado de la era Lover.',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a',
    spotifySearchUrl: 'https://open.spotify.com/search/taylor%20swift%20cruel%20summer',
  } : null);

  const handleToggleSong = () => {
    if (!song) return;
    if (isPlayingSong) {
      audioController.stopMusicWithFadeOut(0.8);
      setIsPlayingSong(false);
    } else {
      audioController.playMusicWithFadeIn(song.audioUrl, song.title, 2.0);
      setIsPlayingSong(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-center max-h-[92vh] overflow-y-auto">
        {/* Ambient Pastel Glow Background */}
        <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-[#E8DDF3]/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-[#F4DDE5]/50 blur-3xl pointer-events-none" />

        {/* New Record Banner */}
        {isNewRecord && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DDF3] text-xs font-bold text-[#5A387E] border border-[#DDD4E6]">
            <Trophy className="w-3.5 h-3.5 text-[#B37D28]" />
            <span>¡Nuevo Récord Personal!</span>
          </div>
        )}

        {/* Header Title */}
        <h2 className="text-3xl font-normal text-[#38343B] font-serif-display tracking-tight">
          ¡Momento Completado!
        </h2>
        <p className="text-xs text-[#77717D] mt-1">
          Has encontrado todas las parejas de {collectionTitle}.
        </p>

        {/* Star Rating Display */}
        <div className="flex items-center justify-center gap-2.5 my-5">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= stats.stars;
            return (
              <div
                key={starIndex}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isEarned
                    ? 'bg-[#FFF9EE] border border-[#F8E1B5] text-[#D4932F] shadow-xs scale-105'
                    : 'bg-[#F2ECE2] text-slate-300'
                }`}
              >
                <Star
                  className={`w-6 h-6 ${isEarned ? 'fill-[#E89E30] text-[#D4932F]' : 'fill-transparent text-slate-300'}`}
                />
              </div>
            );
          })}
        </div>

        {/* Hero Score Box */}
        <div className="bg-white/90 border border-[#EAE3D6] rounded-2xl p-4 mb-4 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#77717D] font-medium">Puntuación Obtenida</span>
          <div className="text-3xl sm:text-4xl font-bold text-[#38343B] font-mono tabular-nums mt-0.5">
            {stats.score.toLocaleString()} <span className="text-sm font-normal text-[#77717D]">pts</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-left mb-5">
          <div className="p-3 bg-white/70 border border-[#EDE7DD] rounded-xl text-center">
            <span className="text-[10px] text-[#77717D] block mb-0.5">Tiempo</span>
            <div className="text-base font-bold text-[#38343B] font-mono tabular-nums">
              {formatTime(stats.timeSeconds)}
            </div>
          </div>

          <div className="p-3 bg-white/70 border border-[#EDE7DD] rounded-xl text-center">
            <span className="text-[10px] text-[#77717D] block mb-0.5">Intentos</span>
            <div className="text-base font-bold text-[#38343B] font-mono tabular-nums">
              {stats.moves}
            </div>
          </div>

          <div className="p-3 bg-white/70 border border-[#EDE7DD] rounded-xl text-center">
            <span className="text-[10px] text-[#77717D] block mb-0.5">Precisión</span>
            <div className="text-base font-bold text-[#476C55] font-mono tabular-nums">
              {Math.round(stats.accuracy)}%
            </div>
          </div>
        </div>

        {/* Category Special Reward Cards */}
        {category === 'taylor' && song && (
          <div className="p-3.5 bg-gradient-to-r from-[#FDF0F6] to-[#EEF5FB] border border-[#F3DBE8] rounded-2xl text-left mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-slate-300 relative bg-slate-900">
                <img
                  src={previewImage}
                  alt={song.title}
                  className={`w-full h-full object-cover ${isPlayingSong ? 'animate-[spin_4s_linear_infinite]' : ''}`}
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#A04374] block">
                  Canción Oficial con Voz
                </span>
                <span className="text-xs font-bold text-[#38343B] truncate block">
                  «{song.title}»
                </span>
                <span className="text-[10px] text-[#77717D] truncate block">
                  Taylor Swift
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleSong}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#F4D3DA] text-xs font-bold text-[#A04374] flex items-center gap-1.5 shadow-2xs hover:bg-[#FDF0F6] transition-colors cursor-pointer shrink-0"
            >
              {isPlayingSong ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingSong ? 'Pausar' : 'Escuchar'}</span>
            </button>
          </div>
        )}

        {category === 'books' && (
          <div className="p-3.5 bg-[#FAF3EE] border border-[#EAD5C7] rounded-2xl text-left mb-5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C5237] uppercase tracking-wider mb-1">
              <BookOpen className="w-3 h-3" />
              <span>Curiosidad Literaria</span>
            </div>
            <p className="text-xs text-[#38343B] font-serif-display leading-relaxed">
              Virginia Woolf escribió la mayor parte de <em>Una habitación propia</em> en un cobertizo de su jardín en Sussex, defendiendo que la independencia económica es la raíz indispensable de la genialidad literaria femenina.
            </p>
          </div>
        )}

        {category === 'matcha' && (
          <div className="p-3.5 bg-[#F3F7EF] border border-[#D4E4CB] rounded-2xl text-left mb-5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#3E6548] uppercase tracking-wider mb-1">
              <Coffee className="w-3 h-3" />
              <span>Curiosidad del Ritual</span>
            </div>
            <p className="text-xs text-[#38343B] leading-relaxed">
              El batidor de bambú (<em>chasen</em>) se talla a mano de una sola pieza de bambú maduro con hasta 100 finísimas varillas curvas para crear la emulsión perfecta de té sin romper las hojas micro-molidas.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                audioController.stopMusicWithFadeOut(0.5);
                onPlayAgain();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#38343B] hover:bg-[#252227] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Volver a jugar</span>
            </button>

            <button
              onClick={() => {
                audioController.stopMusicWithFadeOut(0.5);
                onChangeDifficulty();
              }}
              className="py-3 px-4 rounded-xl border border-[#DDD5C8] bg-white hover:bg-slate-50 text-[#38343B] font-medium text-xs transition-colors cursor-pointer"
            >
              Cambiar dificultad
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                audioController.stopMusicWithFadeOut(0.5);
                onNextCollection();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#E8DDF3] hover:bg-[#DBC9EB] text-[#5A387E] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Siguiente colección</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                audioController.stopMusicWithFadeOut(0.5);
                onGoHome();
              }}
              className="py-2.5 px-4 rounded-xl border border-[#DDD5C8] text-[#77717D] hover:text-[#38343B] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
