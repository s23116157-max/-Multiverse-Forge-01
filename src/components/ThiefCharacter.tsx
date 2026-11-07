/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThiefEntity } from '../types/game';
import { Zap } from 'lucide-react';

interface ThiefCharacterProps {
  thief: ThiefEntity;
  onWhack: (thiefId: string) => void;
  onThrowHammer: (thiefId: string) => void;
}

export const ThiefCharacter: React.FC<ThiefCharacterProps> = ({ thief, onWhack, onThrowHammer }) => {
  return (
    <div
      className={`absolute z-30 transition-transform duration-100 cursor-pointer select-none group ${
        thief.state === 'stunned' ? 'animate-bounce' : 'animate-float'
      }`}
      style={{
        left: `${thief.xPercent}%`,
        bottom: `${thief.yPercent}%`,
        transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onWhack(thief.id);
      }}
    >
      {/* "CATCH THIEF!" Exclamation Banner from Mockup */}
      <div 
        className="absolute -top-12 -left-8 whitespace-nowrap z-40 flex items-center gap-1.5 animate-pulse"
        style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
      >
        <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center border-2 border-white shadow-md">
          !
        </span>
        <span className="bg-red-600/90 text-white text-xs font-bold px-2 py-0.5 rounded-md border border-red-300 shadow-md">
          抓小偷! (CATCH THIEF)
        </span>
      </div>

      {/* Special Drop Preview Pill */}
      {thief.specialDrop && (
        <div 
          className="absolute -top-7 -left-6 z-40 whitespace-nowrap flex items-center gap-1 bg-amber-950/95 border border-amber-500/80 text-amber-200 text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
          style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <span>{thief.specialDrop.icon}</span>
          <span>攜帶稀有物：{thief.specialDrop.materialNameZh} x{thief.specialDrop.count}</span>
        </div>
      )}

      {/* Trap Status Effect Badges (Frozen / Immobilized / Slowed / Stunned / Revealed / Disguised) */}
      {thief.isRevealed && (
        <div 
          className="absolute -top-20 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap flex items-center gap-1 bg-cyan-950/95 border-2 border-cyan-400 text-cyan-200 text-[10px] font-black px-2 py-0.5 rounded-full shadow-[0_0_12px_#22d3ee] animate-pulse"
          style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <span className="text-yellow-300">🎯</span>
          <span>雷達破隱 (REVEALED)</span>
        </div>
      )}

      {thief.isDisguised && !thief.isRevealed && (
        <div 
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap flex items-center gap-1 bg-stone-900/90 border border-stone-500 text-stone-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow"
          style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <span>👻 擬態隱身中 (CLOAKED)</span>
        </div>
      )}

      {thief.isFrozen && (
        <div 
          className="absolute -top-16 left-0 z-40 flex items-center gap-1 bg-cyan-900/95 border-2 border-cyan-300 text-cyan-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_#38bdf8]"
          style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <span>❄️ 深度霜凍 (2X 易傷)</span>
        </div>
      )}

      {thief.isImmobilized && !thief.isFrozen && (
        <div 
          className="absolute -top-16 left-0 z-40 flex items-center gap-1 bg-purple-900/95 border border-purple-400 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
          style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <span>🪨 黏著瀝青固化 (IMMOBILIZED)</span>
        </div>
      )}

      {thief.isSlowed && !thief.isImmobilized && !thief.isFrozen && (
        <div 
          className="absolute -top-16 left-0 z-40 flex items-center gap-1 bg-cyan-900/95 border border-cyan-400 text-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
          style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <Zap size={11} className="text-cyan-300 animate-spin" />
          <span>減速力場 (SLOWED)</span>
        </div>
      )}

      {thief.state === 'stunned' && (
        <div 
          className="absolute -top-16 left-0 z-40 flex items-center gap-1 bg-amber-900/95 border border-amber-400 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
          style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <span>💫 眩暈倒地 (STUNNED)</span>
        </div>
      )}

      {/* Mini Health Bar */}
      <div 
        className="w-16 bg-stone-900/80 rounded-full h-2 border border-stone-600 overflow-hidden mb-1 mx-auto"
        style={{ transform: thief.direction === 'out' ? 'scaleX(-1)' : 'scaleX(1)' }}
      >
        <div
          className="bg-emerald-500 h-full transition-all duration-150"
          style={{ width: `${Math.max(0, (thief.hp / thief.maxHp) * 100)}%` }}
        />
      </div>

      {/* Stylized Goblin Thief Vector (matching Mockup Image 1) */}
      <div className={`relative group-hover:scale-105 active:scale-95 transition-all duration-200 ${
        thief.isDisguised && !thief.isRevealed
          ? 'opacity-25 grayscale blur-[0.6px]'
          : thief.isRevealed
          ? 'opacity-100 filter drop-shadow-[0_0_12px_#06b6d4]'
          : thief.isSlowed
          ? 'filter drop-shadow-[0_0_8px_#22d3ee]'
          : ''
      }`}>
        <svg width="86" height="100" viewBox="0 0 100 120" fill="none">
          {/* Brown Burlap Loot Sack on back */}
          <ellipse cx="68" cy="72" rx="24" ry="22" fill="#854d0e" stroke="#451a03" strokeWidth="3" />
          <path d="M78 52 C84 48 88 56 82 60" stroke="#713f12" strokeWidth="2.5" />
          {/* Gold coin or crystal peeking out */}
          <circle cx="66" cy="58" r="4" fill="#facc15" stroke="#a16207" strokeWidth="1" />
          <polygon points="76,64 78,58 74,60" fill="#38bdf8" />

          {/* Thief Body / Vest */}
          <rect x="30" y="58" width="28" height="34" rx="6" fill="#1c1917" stroke="#44403c" strokeWidth="2.5" />
          {/* Belt & Buckle */}
          <rect x="28" y="74" width="32" height="6" fill="#78350f" />
          <rect x="40" y="73" width="8" height="8" fill="#ca8a04" />

          {/* Goblin Legs & Boots */}
          <path d="M34 92 L28 112 L20 114" stroke="#1c1917" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 92 L54 112 L62 114" stroke="#1c1917" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

          {/* Goblin Head with Green Skin */}
          <ellipse cx="44" cy="40" rx="16" ry="15" fill="#4ade80" stroke="#166534" strokeWidth="2" />

          {/* Pointy Goblin Ears */}
          <polygon points="32,38 12,30 28,48" fill="#4ade80" stroke="#166534" strokeWidth="2" />
          <polygon points="56,38 76,30 60,48" fill="#4ade80" stroke="#166534" strokeWidth="2" />

          {/* Black Mask / Bandana over eyes */}
          <path d="M28 32 C34 30 54 30 60 32 L60 42 C54 44 34 44 28 42 Z" fill="#09090b" stroke="#27272a" strokeWidth="1.5" />

          {/* Glowing Sly Yellow Eyes */}
          <ellipse cx="36" cy="37" rx="3.5" ry="2.5" fill="#facc15" />
          <circle cx="37" cy="37" r="1.5" fill="#000000" />
          <ellipse cx="52" cy="37" rx="3.5" ry="2.5" fill="#facc15" />
          <circle cx="53" cy="37" r="1.5" fill="#000000" />

          {/* Long Goblin Hook Nose */}
          <path d="M44 40 L40 48 L46 47" fill="#4ade80" stroke="#166534" strokeWidth="2" strokeLinejoin="round" />

          {/* Smirking mouth with tooth */}
          <path d="M36 50 Q44 54 52 49" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
          <polygon points="46,49 48,53 50,50" fill="#f8fafc" />

          {/* Goblin Hands reaching out */}
          <circle cx="26" cy="65" r="5" fill="#4ade80" stroke="#166534" strokeWidth="1.5" />
          <circle cx="48" cy="66" r="5" fill="#4ade80" stroke="#166534" strokeWidth="1.5" />
        </svg>

        {/* Quick Fly-Hammer Action Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onThrowHammer(thief.id);
          }}
          className="absolute -bottom-2 -left-3 wood-button text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap hover:scale-105 active:scale-95 transition-transform"
          title="投擲鐵鎚擊暈小偷 (Hammer Toss)"
        >
          🔨 投擲飛鎚!
        </button>
      </div>
    </div>
  );
};
