import React, { useState } from 'react';
import { CollectionCategory, CardItem } from '../../types.ts';
import { ALL_CARD_ITEMS } from '../../data/cardsData.ts';
import { audioController } from '../../utils/audioController.ts';
import { Disc, BookOpen, Coffee, Play, Volume2, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface CollectionsScreenProps {
  initialCategory?: CollectionCategory;
  onStartSetup: (category: CollectionCategory, specificItemId?: string) => void;
}

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  initialCategory = 'taylor',
  onStartSetup,
}) => {
  const [activeTab, setActiveTab] = useState<CollectionCategory>(initialCategory);
  const [playingPreviewId, setPlayingPreviewId] = useState<string | null>(null);

  const taylorItems = ALL_CARD_ITEMS.filter((i) => i.category === 'taylor');
  const bookItems = ALL_CARD_ITEMS.filter((i) => i.category === 'books');
  const matchaItems = ALL_CARD_ITEMS.filter((i) => i.category === 'matcha');

  const handlePlaySongPreview = (item: CardItem) => {
    if (!item.famousSong?.audioUrl) return;

    if (playingPreviewId === item.id) {
      audioController.stopMusicWithFadeOut(0.8);
      setPlayingPreviewId(null);
    } else {
      audioController.playMusicWithFadeIn(item.famousSong.audioUrl, `${item.famousSong.title} — ${item.title}`, 1.5);
      setPlayingPreviewId(item.id);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300 text-left">
      {/* ========================================================= */}
      {/* CABECERA & PESTAÑAS GRANDES SEPARADAS                     */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#77717D] font-semibold">
            Galería de Colecciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#38343B] font-serif-display tracking-tight mt-0.5">
            Explora tus Pequeños Momentos
          </h2>
          <p className="text-sm text-[#77717D] max-w-2xl mt-1">
            Cada sección cuenta con su propio universo visual y sonoro independiente. Elige la categoría que deseas descubrir.
          </p>
        </div>

        {/* Large Prominent Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-[#F2ECE2] rounded-3xl">
          {/* Tab 1: Taylor's Version */}
          <button
            onClick={() => {
              audioController.playUiTick();
              setActiveTab('taylor');
            }}
            className={`p-4 rounded-2xl flex items-center gap-3.5 transition-all text-left cursor-pointer ${
              activeTab === 'taylor'
                ? 'bg-white text-[#38343B] shadow-sm ring-2 ring-[#987CB0]/30'
                : 'text-[#77717D] hover:text-[#38343B] hover:bg-white/50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                activeTab === 'taylor' ? 'bg-[#E8DDF3] text-[#5A387E]' : 'bg-[#FAF8F5] text-slate-400'
              }`}
            >
              <Disc className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold block leading-tight">Taylor's Version</span>
              <span className="text-xs text-[#77717D] block mt-0.5">11 Eras & Canciones Oficiales</span>
            </div>
          </button>

          {/* Tab 2: Entre páginas */}
          <button
            onClick={() => {
              audioController.playUiTick();
              setActiveTab('books');
            }}
            className={`p-4 rounded-2xl flex items-center gap-3.5 transition-all text-left cursor-pointer ${
              activeTab === 'books'
                ? 'bg-white text-[#38343B] shadow-sm ring-2 ring-[#9A4358]/30'
                : 'text-[#77717D] hover:text-[#38343B] hover:bg-white/50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                activeTab === 'books' ? 'bg-[#F4DDE5] text-[#87364A]' : 'bg-[#FAF8F5] text-slate-400'
              }`}
            >
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold block leading-tight">Entre páginas</span>
              <span className="text-xs text-[#77717D] block mt-0.5">Literatura Feminista</span>
            </div>
          </button>

          {/* Tab 3: Matcha Moments */}
          <button
            onClick={() => {
              audioController.playUiTick();
              setActiveTab('matcha');
            }}
            className={`p-4 rounded-2xl flex items-center gap-3.5 transition-all text-left cursor-pointer ${
              activeTab === 'matcha'
                ? 'bg-white text-[#38343B] shadow-sm ring-2 ring-[#3E6548]/30'
                : 'text-[#77717D] hover:text-[#38343B] hover:bg-white/50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                activeTab === 'matcha' ? 'bg-[#DCE8D5] text-[#33563C]' : 'bg-[#FAF8F5] text-slate-400'
              }`}
            >
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold block leading-tight">Matcha Moments</span>
              <span className="text-xs text-[#77717D] block mt-0.5">Rituales, Chawan & Lattes</span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CONTENIDO DE COLECCIÓN: TAYLOR'S VERSION                  */}
      {/* ========================================================= */}
      {activeTab === 'taylor' && (
        <div className="space-y-6">
          {/* Main Action Banner for All-Eras Challenge */}
          <div className="bg-gradient-to-r from-[#F9F4FC] via-[#FAF6FB] to-[#EEF5FB] border border-[#E8DAF2] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A387E] bg-white px-3 py-1 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#987CB0]" />
                <span>Modo Especial Integral</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#38343B] font-serif-display">
                El Gran Reto de las Eras
              </h3>
              <p className="text-xs sm:text-sm text-[#77717D] max-w-xl">
                Juega con cartas de todos los 11 álbumes en parejas mezcladas. Al completar cada intento o ganar, se reproducirá el audio oficial.
              </p>
            </div>

            <button
              onClick={() => {
                audioController.playUiTick();
                onStartSetup('taylor');
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#38343B] hover:bg-[#252227] text-white text-sm font-medium flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>Jugar Colección Completa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grid of Individual Albums */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {taylorItems.map((album) => {
              const isPlaying = playingPreviewId === album.id;

              return (
                <div
                  key={album.id}
                  className="bg-white rounded-3xl border border-[#EAE3D6] p-4 flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F7F4FA] border border-[#ECE5F2]">
                      <img
                        src={album.image}
                        alt={album.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white">
                        {album.year}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#38343B] truncate">{album.title}</h4>
                      <p className="text-xs text-[#77717D] truncate mt-0.5">{album.subtitle}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-2 italic font-serif-display mt-1.5">
                        {album.quoteOrNote}
                      </p>
                    </div>
                  </div>

                  {/* Song track badge + Play button */}
                  {album.famousSong && (
                    <div className="mt-4 pt-3 border-t border-[#F2ECE2] flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-[#987CB0] font-semibold block">
                          Canción Insignia
                        </span>
                        <span className="text-xs font-bold text-[#38343B] truncate block">
                          «{album.famousSong.title}»
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handlePlaySongPreview(album)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                            isPlaying
                              ? 'bg-[#E8DDF3] text-[#5A387E] ring-2 ring-[#987CB0]'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                          title={isPlaying ? 'Pausar canción' : 'Escuchar audio oficial'}
                        >
                          {isPlaying ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>

                        <button
                          onClick={() => {
                            audioController.playUiTick();
                            onStartSetup('taylor', album.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#E8DDF3] text-[#5A387E] text-xs font-semibold border border-[#E2DBD0] transition-colors cursor-pointer"
                        >
                          Jugar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONTENIDO DE COLECCIÓN: ENTRE PÁGINAS                     */}
      {/* ========================================================= */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#FDF6F8] to-[#FFF3E6] border border-[#F4D3DA] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#87364A] bg-white px-3 py-1 rounded-full shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#9A4358]" />
                <span>Biblioteca de Literatura Femenina</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#38343B] font-serif-display">
                Entre páginas & Pensamiento
              </h3>
              <p className="text-xs sm:text-sm text-[#77717D] max-w-xl">
                Obras fundamentales del feminismo, ensayos filosóficos y poesía de autoras influyentes. Descubre sus citas y biografías en cada pareja.
              </p>
            </div>

            <button
              onClick={() => {
                audioController.playUiTick();
                onStartSetup('books');
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#87364A] hover:bg-[#702939] text-white text-sm font-medium flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>Jugar Reto Literario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookItems.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-3xl border border-[#EAE3D6] p-4 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF5F6] border border-[#F4D3DA]">
                    <img
                      src={book.image}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#9A4358] font-bold">
                      {book.author}
                    </span>
                    <h4 className="text-base font-bold text-[#38343B] truncate">{book.title}</h4>
                    <p className="text-xs text-[#77717D] mt-0.5">{book.subtitle}</p>
                    <p className="text-xs text-slate-600 italic font-serif-display mt-2 line-clamp-3">
                      {book.quoteOrNote}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2ECE2] flex items-center justify-between">
                  <span className="text-[11px] text-[#77717D]">Ensayos & Obras</span>
                  <button
                    onClick={() => {
                      audioController.playUiTick();
                      onStartSetup('books', book.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F4DDE5] hover:bg-[#E9C8D4] text-[#87364A] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Jugar libro
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONTENIDO DE COLECCIÓN: MATCHA MOMENTS                    */}
      {/* ========================================================= */}
      {activeTab === 'matcha' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#F4FAF4] to-[#FAF8F5] border border-[#CCE0CE] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#33563C] bg-white px-3 py-1 rounded-full shadow-2xs">
                <Coffee className="w-3.5 h-3.5 text-[#3E6548]" />
                <span>Cultura Zen & Repostería Botánica</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal text-[#38343B] font-serif-display">
                Matcha Moments & Ritual
              </h3>
              <p className="text-xs sm:text-sm text-[#77717D] max-w-xl">
                Desde la molienda de té verde ceremonial en Kioto hasta deliciosos lattes de avena y repostería artesanal.
              </p>
            </div>

            <button
              onClick={() => {
                audioController.playUiTick();
                onStartSetup('matcha');
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#3E6548] hover:bg-[#2D4D36] text-white text-sm font-medium flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>Jugar Reto Matcha</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchaItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#EAE3D6] p-4 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F6FAF6] border border-[#CCE0CE]">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.recipeType && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[#3E6548]">
                        {item.recipeType}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-[#38343B] truncate">{item.title}</h4>
                    <p className="text-xs text-[#77717D] mt-0.5">{item.subtitle}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {item.quoteOrNote}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2ECE2] flex items-center justify-between">
                  <span className="text-[11px] text-[#77717D]">Té & Delicias</span>
                  <button
                    onClick={() => {
                      audioController.playUiTick();
                      onStartSetup('matcha', item.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#DCE8D5] hover:bg-[#C9DAC1] text-[#33563C] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Jugar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
