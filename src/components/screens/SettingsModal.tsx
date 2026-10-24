import React, { useState, useEffect } from 'react';
import { audioController } from '../../utils/audioController.ts';
import { cozyAmbientMusic } from '../../utils/cozyAmbientMusic.ts';
import { X, Volume2, VolumeX, Music, Sliders, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [prefs, setPrefs] = useState(audioController.getPreferences());
  const [isAmbientOn, setIsAmbientOn] = useState(cozyAmbientMusic.getIsRunning());

  useEffect(() => {
    const unsub = audioController.subscribe(() => {
      setPrefs(audioController.getPreferences());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleBgmChange = (val: number) => {
    audioController.setPreferences({ bgmVolume: val });
    cozyAmbientMusic.setVolume(val);
  };

  const handleSfxChange = (val: number) => {
    audioController.setPreferences({ sfxVolume: val });
    audioController.playCardFlip();
  };

  const handleToggleAmbient = () => {
    if (isAmbientOn) {
      cozyAmbientMusic.stop();
      setIsAmbientOn(false);
    } else {
      cozyAmbientMusic.start();
      setIsAmbientOn(true);
    }
  };

  const handleToggleMasterMute = () => {
    const nextMuted = !prefs.isMasterMuted;
    audioController.setPreferences({ isMasterMuted: nextMuted });
    if (nextMuted && isAmbientOn) {
      cozyAmbientMusic.stop();
      setIsAmbientOn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE5DA]">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#77717D] mb-0.5">
              <Sliders className="w-3.5 h-3.5 text-[#987CB0]" />
              <span>Ajustes & Experiencia</span>
            </div>
            <h3 className="text-xl font-normal text-[#38343B] font-serif-display">
              Configuración de Sonido
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3EFE9] hover:bg-[#EAE4DB] flex items-center justify-center text-[#77717D] transition-colors cursor-pointer"
            aria-label="Cerrar configuración"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders & Controls */}
        <div className="space-y-5">
          {/* Master Mute Button */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#EDE7DD] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#38343B] block">Silencio General</span>
              <span className="text-[11px] text-[#77717D] block">Silencia todos los sonidos y música</span>
            </div>
            <button
              onClick={handleToggleMasterMute}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                prefs.isMasterMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-[#FAF8F5] border-[#E2DBD0] text-[#5A387E]'
              }`}
            >
              {prefs.isMasterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Ambient Lo-Fi Toggle */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#EDE7DD] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#38343B] block">Música Ambiental Lo-Fi</span>
              <span className="text-[11px] text-[#77717D] block">Acordes cálidos relajantes con fade-in</span>
            </div>
            <button
              onClick={handleToggleAmbient}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isAmbientOn
                  ? 'bg-[#E8DDF3] border-[#D7C4EB] text-[#5A387E]'
                  : 'bg-[#FAF8F5] border-[#E2DBD0] text-slate-500'
              }`}
            >
              {isAmbientOn ? 'Encendida' : 'Apagada'}
            </button>
          </div>

          {/* Music Volume Slider */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#EDE7DD] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#38343B] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#987CB0]" />
                <span>Volumen de Música</span>
              </span>
              <span className="font-mono text-[#77717D]">{Math.round(prefs.bgmVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={prefs.bgmVolume}
              onChange={(e) => handleBgmChange(parseFloat(e.target.value))}
              className="w-full accent-[#987CB0] cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              Inicia progresivamente en 0 y realiza rampa suave hasta este nivel.
            </span>
          </div>

          {/* SFX Volume Slider */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#EDE7DD] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#38343B] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#476C55]" />
                <span>Volumen Efectos de Sonido</span>
              </span>
              <span className="font-mono text-[#77717D]">{Math.round(prefs.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={prefs.sfxVolume}
              onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
              className="w-full accent-[#476C55] cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">
              Volteo de cartas, campanillas de acierto y recompensas.
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#ECE5DA] flex items-center justify-between text-[11px] text-[#77717D]">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#987CB0]" />
            <span>Preferencias guardadas localmente</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#38343B] text-white text-xs font-semibold hover:bg-[#252227] transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
