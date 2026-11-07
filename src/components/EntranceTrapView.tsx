/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrapSlot, TrapType, TrapEngineering } from '../types/game';
import { Zap, Shield, Flame, AlertCircle, RefreshCw, Check, Repeat } from 'lucide-react';

interface EntranceTrapViewProps {
  traps: TrapSlot[];
  trapUpgradeLevel: number;
  engineering?: TrapEngineering;
  autoReloadNotice?: { trapId: string; cost: number; timestamp: number } | null;
  onSelectTrapType: (slotId: string, newType: TrapType) => void;
  onManualRearm: (slotId: string) => void;
  onOpenUpgrades: () => void;
}

export const EntranceTrapView: React.FC<EntranceTrapViewProps> = ({
  traps,
  trapUpgradeLevel,
  engineering,
  autoReloadNotice,
  onSelectTrapType,
  onManualRearm,
  onOpenUpgrades,
}) => {
  const [selectedSlotForMenu, setSelectedSlotForMenu] = useState<string | null>(null);

  // If traps are not unlocked yet (level 0)
  if (trapUpgradeLevel <= 0) {
    return (
      <div className="absolute left-[18%] bottom-14 z-20 pointer-events-auto">
        <button
          onClick={onOpenUpgrades}
          className="bg-black/70 border border-amber-700/60 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] text-amber-300/80 hover:text-amber-100 hover:border-amber-500 transition shadow-lg group"
          title="在設施升級中解鎖玄關陷阱防衛系統"
        >
          <span className="text-amber-400 group-hover:scale-110 transition-transform">⚙️</span>
          <span>玄關陷阱位 (升級解鎖)</span>
        </button>
      </div>
    );
  }

  // Calculate dynamic stats
  const spikeDmg = engineering ? (engineering.spikeDamageLevel === 1 ? 1.5 : engineering.spikeDamageLevel === 2 ? 2.5 : 3.5) : 1.5;
  const spikeKb = engineering ? (engineering.spikeKnockbackLevel === 1 ? '5%' : engineering.spikeKnockbackLevel === 2 ? '9%' : '14%') : '5%';
  const stasisDur = engineering ? (engineering.stasisDurationLevel === 1 ? 6 : engineering.stasisDurationLevel === 2 ? 9 : 12) : 6;
  const stasisSlow = engineering ? (engineering.stasisSlowRateLevel === 1 ? 65 : engineering.stasisSlowRateLevel === 2 ? 75 : 85) : 65;

  return (
    <div className="absolute left-[16%] md:left-[19%] bottom-8 z-20 pointer-events-auto flex items-center gap-4">
      {/* Auto-Cycle Reload System Status Badge */}
      {engineering?.autoCycleReloadLevel && engineering.autoCycleReloadLevel > 0 && (
        <div 
          onClick={onOpenUpgrades}
          className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-950/90 border border-emerald-500/80 text-[9px] font-bold text-emerald-300 shadow-lg whitespace-nowrap cursor-pointer hover:border-emerald-400 transition"
          title="自動化循環裝填已啟動：冷卻完成後自動扣除金幣重裝上膛"
        >
          <Repeat size={10} className="animate-spin-slow text-emerald-400" />
          <span>
            自動循環 Lv{engineering.autoCycleReloadLevel} (-{engineering.autoCycleReloadLevel === 1 ? 15 : engineering.autoCycleReloadLevel === 2 ? 10 : 5}G)
          </span>
        </div>
      )}

      {traps.map((trap, idx) => {
        const isReady = trap.isArmed;

        return (
          <div key={trap.id} className="relative flex flex-col items-center group">
            {/* Floating Auto-Reload Toast Alert */}
            {autoReloadNotice && autoReloadNotice.trapId === trap.id && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 border border-emerald-400 text-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-bounce flex items-center gap-1 whitespace-nowrap pointer-events-none">
                <Repeat size={10} className="text-emerald-300" />
                <span>⚡ -{autoReloadNotice.cost}G 循環重裝就緒!</span>
              </div>
            )}

            {/* Trap Floor Visual */}
            <div
              onClick={() => {
                if (!trap.isArmed) {
                  onManualRearm(trap.id);
                } else {
                  setSelectedSlotForMenu(selectedSlotForMenu === trap.id ? null : trap.id);
                }
              }}
              className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-center shadow-2xl ${
                isReady
                  ? trap.type === 'spike_trap'
                    ? 'bg-amber-950/80 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)] hover:scale-105'
                    : trap.type === 'stasis_trap'
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.6)] hover:scale-105'
                    : trap.type === 'asphalt_trap'
                    ? 'bg-purple-950/90 border-purple-500 shadow-[0_0_14px_rgba(168,85,247,0.6)] hover:scale-105'
                    : trap.type === 'tesla_mine'
                    ? 'bg-sky-950/90 border-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.7)] hover:scale-105'
                    : 'bg-stone-950/90 border-yellow-600 shadow-[0_0_12px_rgba(202,138,4,0.5)] hover:scale-105'
                  : 'bg-stone-900/60 border-stone-700 opacity-70'
              }`}
              title={
                isReady
                  ? `[已就緒] 點擊更換陷阱類型 (${trap.type})${engineering?.autoCycleReloadLevel ? ' · 自動循環已裝填' : ''}`
                  : trap.cooldownRemaining > 0
                  ? `冷卻中 (${trap.cooldownRemaining.toFixed(1)}s) - 點擊快速重置`
                  : (engineering?.autoCycleReloadLevel && engineering.autoCycleReloadLevel > 0)
                  ? '資金儲備不足以自動裝填 - 點擊手動架設'
                  : '待手動補齊 - 點擊架設重裝'
              }
            >
              {/* Trap SVG Representation */}
              {trap.type === 'spike_trap' && (
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                  {/* Iron Bear Trap base */}
                  <ellipse cx="25" cy="28" rx="20" ry="12" fill="#451a03" stroke="#92400e" strokeWidth="2" />
                  {/* Jagged metal teeth */}
                  <path
                    d="M10 26 L13 16 L17 26 L21 15 L25 26 L29 15 L33 26 L37 16 L40 26"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <circle cx="25" cy="28" r="4" fill="#ef4444" />
                </svg>
              )}

              {trap.type === 'stasis_trap' && (
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                  <polygon
                    points="25,6 42,16 42,34 25,44 8,34 8,16"
                    fill="#083344"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    className={isReady ? 'animate-pulse' : ''}
                  />
                  <circle cx="25" cy="25" r="8" fill="#06b6d4" opacity="0.6" />
                  <path d="M25 15 L25 35 M15 25 L35 25" stroke="#a5f3fc" strokeWidth="1.5" />
                  <circle cx="25" cy="25" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #22d3ee)" />
                </svg>
              )}

              {trap.type === 'asphalt_trap' && (
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                  {/* Sticky asphalt puddle */}
                  <ellipse cx="25" cy="28" rx="21" ry="14" fill="#2e1065" stroke="#9333ea" strokeWidth="2.5" />
                  <circle cx="18" cy="26" r="4" fill="#581c87" />
                  <circle cx="32" cy="28" r="5" fill="#581c87" />
                  <circle cx="25" cy="32" r="3" fill="#c084fc" />
                  {/* Web/slimy strands */}
                  <path d="M14 24 Q25 18 36 24" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
                </svg>
              )}

              {trap.type === 'tesla_mine' && (
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                  {/* Tesla overload mine */}
                  <circle cx="25" cy="25" r="18" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx="25" cy="25" r="10" fill="#0284c7" />
                  <polygon points="25,12 28,22 34,22 29,26 31,34 25,29 19,34 21,26 16,22 22,22" fill="#facc15" />
                  <circle cx="25" cy="25" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />
                </svg>
              )}

              {trap.type === 'cryo_trap' && (
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                  {/* Cryo frost rune circle */}
                  <circle cx="25" cy="25" r="18" fill="#082f49" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 2" />
                  <polygon points="25,10 35,25 25,40 15,25" fill="#7dd3fc" opacity="0.8" />
                  <polygon points="10,25 25,15 40,25 25,35" fill="#bae6fd" opacity="0.6" />
                  <line x1="25" y1="8" x2="25" y2="42" stroke="#ffffff" strokeWidth="2" />
                  <line x1="8" y1="25" x2="42" y2="25" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="25" cy="25" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #38bdf8)" />
                </svg>
              )}

              {trap.type === 'vortex_trap' && (
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                  {/* Space-folding vortex */}
                  <circle cx="25" cy="25" r="19" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
                  <path
                    d="M25 10 A15 15 0 0 1 40 25 A12 12 0 0 1 25 37 A9 9 0 0 1 16 25 A6 6 0 0 1 25 19 A3 3 0 0 1 25 25"
                    stroke="#d8b4fe"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    className="animate-spin origin-center"
                  />
                  <circle cx="25" cy="25" r="3" fill="#f43f5e" filter="drop-shadow(0 0 6px #ec4899)" />
                </svg>
              )}

              {trap.type === 'oil_tar_trap' && (
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                  <ellipse cx="25" cy="28" rx="20" ry="14" fill="#18181b" stroke="#713f12" strokeWidth="2" />
                  <path d="M12 28 Q20 36 28 30 Q36 24 40 28" stroke="#ca8a04" strokeWidth="2" fill="none" />
                  <circle cx="20" cy="26" r="3" fill="#3f3f46" />
                  <circle cx="32" cy="30" r="2.5" fill="#3f3f46" />
                  <line x1="16" y1="20" x2="22" y2="24" stroke="#eab308" strokeWidth="1.5" />
                  <line x1="26" y1="20" x2="32" y2="24" stroke="#eab308" strokeWidth="1.5" />
                </svg>
              )}

              {/* Cooldown Overlay Sweep */}
              {!isReady && (
                <div className="absolute inset-0 rounded-xl bg-black/60 flex flex-col items-center justify-center p-1">
                  <RefreshCw size={14} className="text-amber-400 animate-spin mb-0.5" />
                  <span className="font-mono-num text-[10px] font-bold text-amber-300">
                    {trap.cooldownRemaining.toFixed(0)}s
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute -top-2 -right-2">
                {isReady ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white block shadow-[0_0_6px_#10b981]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-stone-800 block" />
                )}
              </div>
            </div>

            {/* Label below trap */}
            <div className="mt-1 text-center">
              <span className="text-[10px] font-bold text-amber-200/90 block leading-tight">
                {trap.type === 'spike_trap'
                  ? '荊棘重夾'
                  : trap.type === 'stasis_trap'
                  ? '電磁減速場'
                  : trap.type === 'asphalt_trap'
                  ? '黏著瀝青陷阱'
                  : trap.type === 'tesla_mine'
                  ? '超導雷暴地雷'
                  : trap.type === 'cryo_trap'
                  ? '零度霜凍陷阱'
                  : trap.type === 'vortex_trap'
                  ? '次元折疊漩渦'
                  : '廢土焦油道'}
              </span>
              <span className="text-[9px] text-stone-400 block">
                {isReady
                  ? (engineering?.autoCycleReloadLevel && engineering.autoCycleReloadLevel > 0 ? '🔄 自動循環就緒' : '機關已架設')
                  : trap.cooldownRemaining > 0
                  ? `冷卻中 (${trap.cooldownRemaining.toFixed(1)}s)`
                  : (engineering?.autoCycleReloadLevel && engineering.autoCycleReloadLevel > 0)
                  ? '⚠️ 資金不足'
                  : '⚠️ 待手動補齊'}
              </span>
            </div>

            {/* Tactical Trap Switcher Popover Menu */}
            {selectedSlotForMenu === trap.id && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-56 bg-[#1f1008] border-2 border-amber-600 rounded-xl p-2 shadow-2xl flex flex-col gap-1.5 z-50 animate-bounce-short">
                <div className="flex items-center justify-between border-b border-amber-900 pb-1 text-[11px] font-bold text-amber-300">
                  <span>更換陷阱機關 (#{idx + 1})</span>
                  <button
                    onClick={() => setSelectedSlotForMenu(null)}
                    className="text-stone-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* 1. Spike Trap */}
                <button
                  onClick={() => {
                    onSelectTrapType(trap.id, 'spike_trap');
                    setSelectedSlotForMenu(null);
                  }}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                    trap.type === 'spike_trap'
                      ? 'bg-amber-900/80 border-amber-400 text-amber-100 font-bold'
                      : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-600'
                  }`}
                >
                  <span className="text-base">🪤</span>
                  <div>
                    <div className="font-bold">荊棘獵獸夾 (Spike Trap)</div>
                    <div className="text-[9px] text-amber-400">瞬發 {spikeDmg} HP 重創 + 擊退 {spikeKb}</div>
                  </div>
                </button>

                {/* 2. Stasis Trap */}
                <button
                  onClick={() => {
                    onSelectTrapType(trap.id, 'stasis_trap');
                    setSelectedSlotForMenu(null);
                  }}
                  className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                    trap.type === 'stasis_trap'
                      ? 'bg-cyan-900/80 border-cyan-400 text-cyan-100 font-bold'
                      : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-cyan-600'
                  }`}
                >
                  <span className="text-base">⚡</span>
                  <div>
                    <div className="font-bold">電磁停滯力場 (Stasis Trap)</div>
                    <div className="text-[9px] text-cyan-300">減速 {stasisSlow}% 持續 {stasisDur} 秒 + 觸電</div>
                  </div>
                </button>

                {/* 3. Tar Trap */}
                {trapUpgradeLevel >= 3 && (
                  <button
                    onClick={() => {
                      onSelectTrapType(trap.id, 'oil_tar_trap');
                      setSelectedSlotForMenu(null);
                    }}
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                      trap.type === 'oil_tar_trap'
                        ? 'bg-stone-800 border-yellow-500 text-yellow-200 font-bold'
                        : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-yellow-600'
                    }`}
                  >
                    <span className="text-base">🛢️</span>
                    <div>
                      <div className="font-bold">廢土焦油滑道 (Tar Trap)</div>
                      <div className="text-[9px] text-yellow-300">小偷滑倒 + 強制掉落贓物</div>
                    </div>
                  </button>
                )}

                {/* 4. Sticky Asphalt Trap (Requested feature) */}
                {engineering?.unlockedAsphalt && (
                  <button
                    onClick={() => {
                      onSelectTrapType(trap.id, 'asphalt_trap');
                      setSelectedSlotForMenu(null);
                    }}
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                      trap.type === 'asphalt_trap'
                        ? 'bg-purple-900/90 border-purple-400 text-purple-100 font-bold'
                        : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-purple-500'
                    }`}
                  >
                    <span className="text-base">🪨</span>
                    <div>
                      <div className="font-bold text-purple-300">黏著瀝青陷阱 (Asphalt Trap)</div>
                      <div className="text-[9px] text-purple-200">100% 完全定身固化 4 秒！</div>
                    </div>
                  </button>
                )}

                {/* 5. Tesla Shock Mine */}
                {engineering?.unlockedTeslaMine && (
                  <button
                    onClick={() => {
                      onSelectTrapType(trap.id, 'tesla_mine');
                      setSelectedSlotForMenu(null);
                    }}
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                      trap.type === 'tesla_mine'
                        ? 'bg-sky-900/90 border-sky-400 text-sky-100 font-bold'
                        : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-sky-400'
                    }`}
                  >
                    <span className="text-base">💥</span>
                    <div>
                      <div className="font-bold text-sky-300">超導雷暴地雷 (Tesla Mine)</div>
                      <div className="text-[9px] text-sky-200">瞬發 2.5 HP 巨額雷暴打擊 + 炸退</div>
                    </div>
                  </button>
                )}

                {/* 6. Cryo Freeze Trap */}
                {engineering?.unlockedCryo && (
                  <button
                    onClick={() => {
                      onSelectTrapType(trap.id, 'cryo_trap');
                      setSelectedSlotForMenu(null);
                    }}
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                      trap.type === 'cryo_trap'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-100 font-bold'
                        : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-cyan-400'
                    }`}
                  >
                    <span className="text-base">❄️</span>
                    <div>
                      <div className="font-bold text-cyan-300">零度霜凍陷阱 (Cryo Freeze)</div>
                      <div className="text-[9px] text-cyan-200">完全凍結 3.5s + 飛鎚易傷翻倍</div>
                    </div>
                  </button>
                )}

                {/* 7. Dimensional Vortex Trap */}
                {engineering?.unlockedVortex && (
                  <button
                    onClick={() => {
                      onSelectTrapType(trap.id, 'vortex_trap');
                      setSelectedSlotForMenu(null);
                    }}
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition text-xs ${
                      trap.type === 'vortex_trap'
                        ? 'bg-purple-950 border-pink-400 text-pink-100 font-bold'
                        : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-pink-400'
                    }`}
                  >
                    <span className="text-base">🌀</span>
                    <div>
                      <div className="font-bold text-pink-300">次元折疊漩渦 (Vortex)</div>
                      <div className="text-[9px] text-pink-200">彈回大門外 + 強制震落贓物</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
