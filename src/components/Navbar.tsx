import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types.ts';
import { audioController } from '../utils/audioController.ts';
import { cozyAmbientMusic } from '../utils/cozyAmbientMusic.ts';
import { Sparkles, Music, Volume2, VolumeX, Settings, Award, Layers, Home } from 'lucide-react';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate, onOpenSettings }) => {
  const [prefs, setPrefs] = useState(audioController.getPreferences());
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(cozyAmbientMusic.getIsRunning());

  useEffect(() => {
    const unsub = audioController.subscribe(() => {
      setPrefs(audioController.getPreferences());
    });
    return unsub;
  }, []);

  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      cozyAmbientMusic.stop();
      setIsAmbientPlaying(false);
    } else {
      cozyAmbientMusic.start();
      setIsAmbientPlaying(true);
    }
    audioController.playUiTick();
  };

  const handleToggleMasterMute = () => {
    const nextMuted = !prefs.isMasterMuted;
    audioController.setPreferences({ isMasterMuted: nextMuted });
    if (nextMuted && isAmbientPlaying) {
      cozyAmbientMusic.stop();
      setIsAmbientPlaying(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE3D6] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <button
          onClick={() => {
            audioController.playUiTick();
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E8DDF3] via-[#FAF8F5] to-[#F4DDE5] border border-[#DDD4E6] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-[#987CB0]" />
          </div>
          <div>
            <span className="text-xl font-normal tracking-tight text-[#38343B] font-serif-display block leading-none">
              Little Moments
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#77717D] font-medium block mt-0.5">
              Memory Game
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#77717D]">
          <button
            onClick={() => {
              audioController.playUiTick();
              onNavigate('home');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentScreen === 'home' ? 'text-[#38343B] font-semibold' : 'hover:text-[#38343B]'
            }`}
          >
            <Home className="w-4 h-4 text-[#987CB0]" />
            <span>Inicio</span>
          </button>

          <button
            onClick={() => {
              audioController.playUiTick();
              onNavigate('collections');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentScreen === 'collections' ? 'text-[#38343B] font-semibold' : 'hover:text-[#38343B]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#987CB0]" />
            <span>Colecciones</span>
          </button>

          <button
            onClick={() => {
              audioController.playUiTick();
              onNavigate('progress');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentScreen === 'progress' ? 'text-[#38343B] font-semibold' : 'hover:text-[#38343B]'
            }`}
          >
            <Award className="w-4 h-4 text-[#B37D28]" />
            <span>Mi Progreso</span>
          </button>
        </nav>

        {/* Right Utility: Audio & Settings */}
        <div className="flex items-center gap-2">
          {/* Ambient Music Toggle Button */}
          <button
            onClick={handleToggleAmbient}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-2xs cursor-pointer ${
              isAmbientPlaying
                ? 'bg-[#E8DDF3] border-[#D7C4EB] text-[#5A387E]'
                : 'bg-white border-[#E2DBD0] text-[#77717D] hover:text-[#38343B]'
            }`}
            title={isAmbientPlaying ? 'Pausar música ambiental lo-fi' : 'Activar música ambiental lo-fi'}
          >
            <Music className={`w-3.5 h-3.5 ${isAmbientPlaying ? 'animate-pulse text-[#987CB0]' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isAmbientPlaying ? 'Lo-Fi Activo' : 'Música Lo-Fi'}</span>
          </button>

          {/* Master Mute / Unmute */}
          <button
            onClick={handleToggleMasterMute}
            className="w-9 h-9 rounded-xl border border-[#E2DBD0] bg-white hover:bg-slate-50 flex items-center justify-center text-[#77717D] hover:text-[#38343B] transition-colors shadow-2xs cursor-pointer"
            title={prefs.isMasterMuted ? 'Activar sonido' : 'Silenciar todos los sonidos'}
            aria-label={prefs.isMasterMuted ? 'Activar sonido' : 'Silenciar todos los sonidos'}
          >
            {prefs.isMasterMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#987CB0]" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => {
              audioController.playUiTick();
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-xl border border-[#E2DBD0] bg-white hover:bg-slate-50 flex items-center justify-center text-[#77717D] hover:text-[#38343B] transition-colors shadow-2xs cursor-pointer"
            title="Configuración de audio y visual"
            aria-label="Abrir configuración"
          >
            <Settings className="w-4 h-4 text-[#77717D]" />
          </button>
        </div>
      </div>
    </header>
  );
};
