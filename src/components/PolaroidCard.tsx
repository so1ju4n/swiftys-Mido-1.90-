import React, { useState } from 'react';
import { MemoryCard } from '../types.ts';
import { Check, Sparkles, BookOpen, Coffee, Disc } from 'lucide-react';

interface PolaroidCardProps {
  card: MemoryCard;
  onClick: () => void;
  disabled: boolean;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({ card, onClick, disabled }) => {
  const [hasImgError, setHasImgError] = useState(false);
  const isRevealed = card.isFlipped || card.isMatched;

  const CategoryIcon =
    card.item.category === 'books'
      ? BookOpen
      : card.item.category === 'matcha'
      ? Coffee
      : Disc;

  return (
    <div
      className="perspective-1000 relative w-full aspect-[4/5] cursor-pointer select-none"
      onClick={() => {
        if (!disabled && !isRevealed) {
          onClick();
        }
      }}
      role="button"
      tabIndex={isRevealed || disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isRevealed) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={isRevealed ? `${card.item.title}, ${card.item.categoryLabel}` : 'Carta de memoria polaroid'}
      aria-disabled={disabled || isRevealed}
    >
      <div
        className={`w-full h-full duration-400 transform-style-preserve-3d transition-transform ease-out rounded-2xl ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* ========================================================= */}
        {/* CARA TRASERA (Oculta, mirando al jugador)                 */}
        {/* ========================================================= */}
        <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl border border-[#ECE5DA] bg-[#FFFFFF] p-2.5 flex flex-col items-center justify-between polaroid-card group transition-all hover:scale-[1.02] active:scale-[0.98]">
          {/* Inner frame */}
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#FBF9F6] via-[#F7F3EB] to-[#F1EAE0] border border-[#ECE4D8] p-3 flex flex-col items-center justify-between">
            {/* Top tiny corner marks */}
            <div className="w-full flex justify-between items-center text-[10px] text-[#A69C8E] opacity-60">
              <span>✦</span>
              <span className="font-mono text-[9px] tracking-wider">L·M</span>
              <span>✦</span>
            </div>

            {/* Center cozy emblem */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/80 border border-[#E4DDD2] flex items-center justify-center shadow-2xs group-hover:rotate-6 transition-transform">
              <Sparkles className="w-5 h-5 text-[#987CB0]" />
            </div>

            {/* Bottom logo */}
            <span className="text-[10px] tracking-widest uppercase text-[#9A8F80] font-medium font-serif-display">
              Moments
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARA FRONTAL (Revelada / Polaroid)                        */}
        {/* ========================================================= */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-2xl p-2 sm:p-2.5 pb-4 sm:pb-5 bg-white border polaroid-card transition-all duration-300 flex flex-col justify-between ${
            card.isMatched
              ? 'border-[#987CB0] ring-2 ring-[#987CB0]/30 shadow-md'
              : 'border-[#EAE3D6] shadow-sm'
          }`}
        >
          {/* Photo Frame (Square Aspect) */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F7F5F0] border border-slate-100 flex items-center justify-center">
            {!hasImgError ? (
              <img
                src={card.item.image}
                alt={card.item.title}
                referrerPolicy="no-referrer"
                onError={() => setHasImgError(true)}
                className="w-full h-full object-cover select-none"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[#FAF8F5]">
                <CategoryIcon className="w-6 h-6 text-[#987CB0] mb-1" />
                <span className="text-[10px] font-semibold text-[#38343B] line-clamp-1">{card.item.title}</span>
              </div>
            )}

            {/* Matched Success Pin Badge */}
            {card.isMatched && (
              <div
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#987CB0] text-white flex items-center justify-center shadow-md animate-in zoom-in duration-300"
                title="Pareja encontrada"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Polaroid Bottom Caption Area */}
          <div className="mt-1.5 px-1 text-center">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#38343B] truncate leading-tight">
              {card.item.title}
            </h4>
            <p className="text-[9px] sm:text-[10px] text-[#77717D] truncate mt-0.5">
              {card.item.subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
