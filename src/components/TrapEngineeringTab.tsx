/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrapEngineering } from '../types/game';
import { sound } from '../audio/soundManager';
import { Shield, Zap, Sparkles, Flame, CheckCircle, ArrowRight, Lock, Eye, Radio, Crosshair, AlertTriangle, RefreshCw, Repeat } from 'lucide-react';

interface TrapEngineeringTabProps {
  gold: number;
  engineering: TrapEngineering;
  onUpgradeEngineering: (field: keyof TrapEngineering, cost: number) => void;
  onUnlockTrapType: (type: 'asphalt' | 'tesla' | 'cryo' | 'vortex', cost: number) => void;
}

export const TrapEngineeringTab: React.FC<TrapEngineeringTabProps> = ({
  gold,
  engineering,
  onUpgradeEngineering,
  onUnlockTrapType,
}) => {
  const droneLevel = engineering.reconDroneLevel || 0;
  const droneCost = droneLevel === 0 ? 220 : droneLevel === 1 ? 340 : 480;

  const autoReloadLevel = engineering.autoCycleReloadLevel || 0;
  const autoReloadCost = autoReloadLevel === 0 ? 160 : autoReloadLevel === 1 ? 260 : 380;

  const chainLevel = engineering.trapChainReactionLevel || 0;
  const chainCost = chainLevel === 0 ? 190 : chainLevel === 1 ? 290 : 420;

  const handleUpgradeDrone = () => {
    if (droneLevel >= 3 || gold < droneCost) return;
    sound.playCoins();
    sound.playDroneRadar();
    onUpgradeEngineering('reconDroneLevel', droneCost);
  };

  const handleUpgradeAutoReload = () => {
    if (autoReloadLevel >= 3 || gold < autoReloadCost) return;
    sound.playCoins();
    sound.playAutoReload();
    onUpgradeEngineering('autoCycleReloadLevel', autoReloadCost);
  };

  const handleUpgradeChain = () => {
    if (chainLevel >= 3 || gold < chainCost) return;
    sound.playCoins();
    sound.playTrapShock();
    onUpgradeEngineering('trapChainReactionLevel', chainCost);
  };

  return (
    <div className="flex flex-col gap-5 text-stone-100 select-none">
      {/* Intro Banner */}
      <div className="forge-panel p-4 flex items-center justify-between border-2 border-amber-600/80 bg-gradient-to-r from-[#291308] via-[#3a1d0d] to-[#1c0c05]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-950 border-2 border-amber-500 flex items-center justify-center text-amber-300 text-2xl shadow-lg">
            🛠️
          </div>
          <div>
            <h3 className="font-display font-black text-amber-200 text-base md:text-lg">
              萬界陷阱工藝研發所 (Trap Engineering & Crafting)
            </h3>
            <p className="text-xs text-stone-300">
              消耗金幣研發改良現有陷阱的威力、減速強度與擊退力，並解鎖高階傳奇機關！
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-amber-700 font-mono-num font-bold text-yellow-300 text-sm">
          <span>可用資金:</span>
          <span>{gold.toLocaleString()} G</span>
        </div>
      </div>

      {/* *NEW* FEATURED UPGRADE: 自動巡邏偵察機 (Autonomous Recon Patrol Drone) */}
      <div className="forge-panel p-4 border-2 border-cyan-500/80 bg-gradient-to-r from-[#0b1d28] via-[#102a3a] to-[#091720] shadow-xl relative overflow-hidden">
        {/* Ambient Radar Rings Background */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border border-cyan-500/20 pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full border border-cyan-500/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* High-Tech Animated Drone Icon */}
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-3xl shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative">
              <span className="animate-pulse">🛸</span>
              {droneLevel > 0 && (
                <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -top-1 -right-1 border-2 border-stone-950 animate-ping" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-black px-2 py-0.5 rounded uppercase tracking-wide">
                  *NEW* 空中保全
                </span>
                <h4 className="text-sm md:text-base font-black text-cyan-100 flex items-center gap-2">
                  <span>自動巡邏偵察機 (Autonomous Recon Patrol Drone)</span>
                  <span className="font-mono-num text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300">
                    {droneLevel === 0 ? '未部署' : `Lv ${droneLevel} / 3`}
                  </span>
                </h4>
              </div>

              <p className="text-xs text-stone-200 leading-relaxed max-w-2xl">
                全天候盤旋於玄關上空，搭載光學與次元波動雷達。<strong className="text-cyan-300">自動掃描外圍潛入之隱身或偽裝盜賊</strong>，在進入店面偷竊前強制破除偽裝並觸發聲光警報，防止意外失竊！
              </p>

              {/* Tiered Upgrade Benefits Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                <div className={`p-2 rounded-lg border text-[11px] transition ${
                  droneLevel >= 1
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400'
                }`}>
                  <div className="font-bold flex items-center gap-1 text-cyan-300">
                    <Radio size={12} />
                    <span>Lv 1: 全息雷達預警</span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    外圍偵測提前發出聲光警報，高亮入侵目標防備偷襲。
                  </p>
                </div>

                <div className={`p-2 rounded-lg border text-[11px] transition ${
                  droneLevel >= 2
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400'
                }`}>
                  <div className="font-bold flex items-center gap-1 text-emerald-300">
                    <Eye size={12} />
                    <span>Lv 2: 破除偽裝與隱形</span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    高能探照燈瞬間穿透光學迷彩，強制隱身怪客顯形。
                  </p>
                </div>

                <div className={`p-2 rounded-lg border text-[11px] transition ${
                  droneLevel >= 3
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400'
                }`}>
                  <div className="font-bold flex items-center gap-1 text-yellow-300">
                    <Crosshair size={12} />
                    <span>Lv 3: 弱點標記+減速易傷</span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    探照燈壓制盜賊移速 -25%，打擊與飛鎚傷害額外 +1.0 HP！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Upgrade Button */}
          <div className="shrink-0 flex flex-col items-center md:items-end gap-1.5 w-full md:w-auto">
            <button
              onClick={handleUpgradeDrone}
              disabled={droneLevel >= 3 || gold < droneCost}
              className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                droneLevel >= 3
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 cursor-default'
                  : gold >= droneCost
                  ? 'wood-button text-amber-100 hover:scale-105 active:scale-95'
                  : 'bg-stone-800 border border-stone-700 text-stone-500 cursor-not-allowed'
              }`}
            >
              {droneLevel >= 3 ? (
                <>
                  <CheckCircle size={16} className="text-cyan-400" />
                  <span>已達最高等級 (MAX)</span>
                </>
              ) : (
                <>
                  <span>
                    {droneLevel === 0 ? '🛠️ 部署巡邏偵察機' : `⚡ 升級偵察系統 Lv ${droneLevel + 1}`}
                  </span>
                  <span className="font-mono-num text-yellow-300">
                    ({droneCost} G)
                  </span>
                </>
              )}
            </button>

            {droneLevel > 0 && (
              <span className="text-[10px] text-cyan-300 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                玄關空中巡邏掃描運作中
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* === LEFT CARD: EXISTING TRAPS STAT UPGRADES === */}
        <div className="forge-panel p-4 flex flex-col gap-4">
          <div className="border-b border-amber-900/80 pb-2 flex items-center justify-between">
            <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>🪤</span>
              現有機關性能強化 (Trap Performance Upgrades)
            </h4>
            <span className="text-[10px] text-amber-400">永久強化效果</span>
          </div>

          <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
            {/* 1. Spike Trap Damage */}
            <div className="forge-panel-inner p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-600 flex items-center justify-center text-xl shrink-0">
                  🗡️
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-100 flex items-center gap-2">
                    <span>獵獸夾·精鋼利刃 (Spike Damage)</span>
                    <span className="text-emerald-400 font-mono-num text-[11px]">
                      Lv {engineering.spikeDamageLevel} ➔ {Math.min(3, engineering.spikeDamageLevel + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    直接傷害: <span className="font-mono-num font-bold text-amber-300">
                      {engineering.spikeDamageLevel === 1 ? '1.5 HP' : engineering.spikeDamageLevel === 2 ? '2.5 HP' : '3.5 HP (致命)'}
                    </span>
                    {engineering.spikeDamageLevel < 3 && ` ➔ ${engineering.spikeDamageLevel === 1 ? '2.5 HP' : '3.5 HP'}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const cost = engineering.spikeDamageLevel === 1 ? 120 : 200;
                  onUpgradeEngineering('spikeDamageLevel', cost);
                }}
                disabled={engineering.spikeDamageLevel >= 3 || gold < (engineering.spikeDamageLevel === 1 ? 120 : 200)}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {engineering.spikeDamageLevel >= 3 ? 'MAX' : `${engineering.spikeDamageLevel === 1 ? 120 : 200} G`}
              </button>
            </div>

            {/* 2. Spike Trap Knockback */}
            <div className="forge-panel-inner p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-600 flex items-center justify-center text-xl shrink-0">
                  🏹
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-100 flex items-center gap-2">
                    <span>強力彈簧衝程 (Spike Knockback)</span>
                    <span className="text-emerald-400 font-mono-num text-[11px]">
                      Lv {engineering.spikeKnockbackLevel} ➔ {Math.min(3, engineering.spikeKnockbackLevel + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    擊退衝程: <span className="font-mono-num font-bold text-amber-300">
                      {engineering.spikeKnockbackLevel === 1 ? '5%' : engineering.spikeKnockbackLevel === 2 ? '9%' : '14% (大步擊退)'}
                    </span>
                    {engineering.spikeKnockbackLevel < 3 && ` ➔ ${engineering.spikeKnockbackLevel === 1 ? '9%' : '14%'}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const cost = engineering.spikeKnockbackLevel === 1 ? 90 : 160;
                  onUpgradeEngineering('spikeKnockbackLevel', cost);
                }}
                disabled={engineering.spikeKnockbackLevel >= 3 || gold < (engineering.spikeKnockbackLevel === 1 ? 90 : 160)}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {engineering.spikeKnockbackLevel >= 3 ? 'MAX' : `${engineering.spikeKnockbackLevel === 1 ? 90 : 160} G`}
              </button>
            </div>

            {/* 3. Stasis Field Slow Duration */}
            <div className="forge-panel-inner p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-300 text-xl shrink-0">
                  ⏱️
                </div>
                <div>
                  <div className="text-xs font-bold text-cyan-200 flex items-center gap-2">
                    <span>電磁電容蓄能 (Slow Duration)</span>
                    <span className="text-emerald-400 font-mono-num text-[11px]">
                      Lv {engineering.stasisDurationLevel} ➔ {Math.min(3, engineering.stasisDurationLevel + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    減速持續時間: <span className="font-mono-num font-bold text-cyan-300">
                      {engineering.stasisDurationLevel === 1 ? '6 秒' : engineering.stasisDurationLevel === 2 ? '9 秒' : '12 秒 (超長拖延)'}
                    </span>
                    {engineering.stasisDurationLevel < 3 && ` ➔ ${engineering.stasisDurationLevel === 1 ? '9 秒' : '12 秒'}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const cost = engineering.stasisDurationLevel === 1 ? 110 : 180;
                  onUpgradeEngineering('stasisDurationLevel', cost);
                }}
                disabled={engineering.stasisDurationLevel >= 3 || gold < (engineering.stasisDurationLevel === 1 ? 110 : 180)}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {engineering.stasisDurationLevel >= 3 ? 'MAX' : `${engineering.stasisDurationLevel === 1 ? 110 : 180} G`}
              </button>
            </div>

            {/* 4. Stasis Field Slow Strength */}
            <div className="forge-panel-inner p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-300 text-xl shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-cyan-200 flex items-center gap-2">
                    <span>高斯力場磁阻 (Slow Strength)</span>
                    <span className="text-emerald-400 font-mono-num text-[11px]">
                      Lv {engineering.stasisSlowRateLevel} ➔ {Math.min(3, engineering.stasisSlowRateLevel + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    移速削減幅度: <span className="font-mono-num font-bold text-cyan-300">
                      {engineering.stasisSlowRateLevel === 1 ? '-65% 移速' : engineering.stasisSlowRateLevel === 2 ? '-75% 移速' : '-85% 移速 (龜速)'}
                    </span>
                    {engineering.stasisSlowRateLevel < 3 && ` ➔ ${engineering.stasisSlowRateLevel === 1 ? '-75%' : '-85%'}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const cost = engineering.stasisSlowRateLevel === 1 ? 130 : 210;
                  onUpgradeEngineering('stasisSlowRateLevel', cost);
                }}
                disabled={engineering.stasisSlowRateLevel >= 3 || gold < (engineering.stasisSlowRateLevel === 1 ? 130 : 210)}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {engineering.stasisSlowRateLevel >= 3 ? 'MAX' : `${engineering.stasisSlowRateLevel === 1 ? 130 : 210} G`}
              </button>
            </div>

            {/* 5. Tar Trap Loot Recovery Bounty */}
            <div className="forge-panel-inner p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-900 border border-yellow-600 flex items-center justify-center text-yellow-400 text-xl shrink-0">
                  🛢️
                </div>
                <div>
                  <div className="text-xs font-bold text-yellow-200 flex items-center gap-2">
                    <span>廢土機油黏著度 (Tar Slick Bounty)</span>
                    <span className="text-emerald-400 font-mono-num text-[11px]">
                      Lv {engineering.tarLootDropLevel} ➔ {Math.min(3, engineering.tarLootDropLevel + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    滑倒掉包 + 額外震落私房錢: <span className="font-mono-num font-bold text-yellow-400">
                      +{engineering.tarLootDropLevel * 60} G
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const cost = engineering.tarLootDropLevel === 1 ? 100 : 170;
                  onUpgradeEngineering('tarLootDropLevel', cost);
                }}
                disabled={engineering.tarLootDropLevel >= 3 || gold < (engineering.tarLootDropLevel === 1 ? 100 : 170)}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {engineering.tarLootDropLevel >= 3 ? 'MAX' : `${engineering.tarLootDropLevel === 1 ? 100 : 170} G`}
              </button>
            </div>

            {/* 6. *NEW* Rearm Speed Accelerator (裝填加速器) */}
            <div className="forge-panel-inner p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-300 text-xl shrink-0">
                  ⚙️
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200 flex items-center gap-2">
                    <span>齒輪快速復位機構 (Rearm Speed)</span>
                    <span className="text-emerald-400 font-mono-num text-[11px]">
                      Lv {engineering.rearmSpeedLevel || 1} ➔ {Math.min(3, (engineering.rearmSpeedLevel || 1) + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    所有陷阱冷卻時間縮減: <span className="font-mono-num font-bold text-amber-300">
                      {(engineering.rearmSpeedLevel || 1) === 1 ? '-20%' : (engineering.rearmSpeedLevel || 1) === 2 ? '-35%' : '-50% (極速重填)'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const currentLv = engineering.rearmSpeedLevel || 1;
                  const cost = currentLv === 1 ? 150 : 240;
                  onUpgradeEngineering('rearmSpeedLevel', cost);
                }}
                disabled={(engineering.rearmSpeedLevel || 1) >= 3 || gold < ((engineering.rearmSpeedLevel || 1) === 1 ? 150 : 240)}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {(engineering.rearmSpeedLevel || 1) >= 3 ? 'MAX' : `${(engineering.rearmSpeedLevel || 1) === 1 ? 150 : 240} G`}
              </button>
            </div>

            {/* 7. *NEW* Trap Overcharge Shockwave (陷阱過載電容) */}
            <div className="forge-panel-inner p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-500 flex items-center justify-center text-purple-300 text-xl shrink-0">
                  💥
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-200 flex items-center gap-2">
                    <span>過載連帶震波 (Trap Overcharge)</span>
                    <span className="text-emerald-400 font-mono-num text-[11px]">
                      Lv {engineering.trapOverchargeLevel || 1} ➔ {Math.min(3, (engineering.trapOverchargeLevel || 1) + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    觸發時觸發群體震波機率: <span className="font-mono-num font-bold text-purple-300">
                      {(engineering.trapOverchargeLevel || 1) === 1 ? '25%' : (engineering.trapOverchargeLevel || 1) === 2 ? '40%' : '55% (連環震退)'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const currentLv = engineering.trapOverchargeLevel || 1;
                  const cost = currentLv === 1 ? 140 : 220;
                  onUpgradeEngineering('trapOverchargeLevel', cost);
                }}
                disabled={(engineering.trapOverchargeLevel || 1) >= 3 || gold < ((engineering.trapOverchargeLevel || 1) === 1 ? 140 : 220)}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {(engineering.trapOverchargeLevel || 1) >= 3 ? 'MAX' : `${(engineering.trapOverchargeLevel || 1) === 1 ? 140 : 220} G`}
              </button>
            </div>

            {/* 8. *NEW* Autonomous Recon Patrol Drone (自動巡邏偵察機) */}
            <div className="forge-panel-inner p-3 flex items-center justify-between gap-3 border border-cyan-500/50 bg-cyan-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 text-xl shrink-0">
                  🛸
                </div>
                <div>
                  <div className="text-xs font-bold text-cyan-200 flex items-center gap-2">
                    <span className="text-yellow-400 font-extrabold">*NEW*</span>
                    <span>自動巡邏偵察機 (Recon Drone)</span>
                    <span className="text-cyan-400 font-mono-num text-[11px]">
                      Lv {droneLevel} ➔ {Math.min(3, droneLevel + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    {droneLevel === 0 && '懸停玄關雷達掃描，提早發現外圍偷竊者並發出警報'}
                    {droneLevel === 1 && '遠程雷達預警已啟動：升級至 Lv 2 解鎖反隱形破除偽裝光束'}
                    {droneLevel === 2 && '全光譜反隱破除：升級至 Lv 3 解鎖弱點鎖定與探照威壓 (-25% 移速/+1 傷害)'}
                    {droneLevel >= 3 && '最高等級：全場偽裝強制破除，探照燈弱點鎖定易傷'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpgradeDrone}
                disabled={droneLevel >= 3 || gold < droneCost}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {droneLevel >= 3 ? 'MAX' : `${droneCost} G`}
              </button>
            </div>

            {/* 9. *NEW* Automated Cycle Reload System (自動化循環裝填) */}
            <div className={`forge-panel-inner p-3 flex items-center justify-between gap-3 border transition ${
              autoReloadLevel > 0
                ? 'border-emerald-500/60 bg-emerald-950/20'
                : 'border-amber-600/50 bg-[#1c0e06]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xl shrink-0 ${
                  autoReloadLevel > 0
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-stone-900 border-stone-600 text-stone-400'
                }`}>
                  <Repeat className={autoReloadLevel > 0 ? 'animate-spin-slow text-emerald-400' : 'text-stone-400'} size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-100 flex items-center gap-2">
                    <span className="text-yellow-400 font-extrabold">*NEW*</span>
                    <span>自動化循環裝填 (Auto-Cycle Reload)</span>
                    <span className="text-emerald-400 font-mono-num text-[11px]">
                      Lv {autoReloadLevel} ➔ {Math.min(3, autoReloadLevel + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5 leading-snug">
                    {autoReloadLevel === 0 && (
                      <>
                        未解鎖：陷阱冷卻結束需<span className="text-amber-400">手動點擊補齊</span>。解鎖後冷卻完成自動消耗少量金幣即時上膛，防衛不中斷！
                      </>
                    )}
                    {autoReloadLevel === 1 && (
                      <>
                        已啟用：冷卻結束自動消耗 <span className="font-mono-num font-bold text-yellow-300">15G</span> 即時重裝。升級至 Lv 2 降至 <span className="text-emerald-400">10G</span>！
                      </>
                    )}
                    {autoReloadLevel === 2 && (
                      <>
                        高壓微型供彈：每次重裝僅需 <span className="font-mono-num font-bold text-yellow-300">10G</span>。升級至 Lv 3 解鎖量子微縮供彈 (<span className="text-emerald-400">5G/次 且冷卻額外 -15%</span>)！
                      </>
                    )}
                    {autoReloadLevel >= 3 && (
                      <>
                        最高等級 (MAX)：萬界量子供彈！每次重裝僅消耗 <span className="font-mono-num font-bold text-yellow-300">5G</span>，且所有陷阱冷卻速度<span className="text-emerald-300 font-bold">額外提升 15%</span>！
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpgradeAutoReload}
                disabled={autoReloadLevel >= 3 || gold < autoReloadCost}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {autoReloadLevel >= 3 ? 'MAX' : `${autoReloadCost} G`}
              </button>
            </div>

            {/* 10. *NEW* Trap Chain Reaction (陷阱連鎖啟動) */}
            <div className={`forge-panel-inner p-3 flex items-center justify-between gap-3 border transition ${
              chainLevel > 0
                ? 'border-indigo-500/60 bg-indigo-950/20'
                : 'border-amber-600/50 bg-[#1c0e06]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xl shrink-0 ${
                  chainLevel > 0
                    ? 'bg-indigo-950 border-indigo-400 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                    : 'bg-stone-900 border-stone-600 text-stone-400'
                }`}>
                  <Zap className={chainLevel > 0 ? 'text-indigo-400 animate-pulse' : 'text-stone-400'} size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-100 flex items-center gap-2">
                    <span className="text-yellow-400 font-extrabold">*NEW*</span>
                    <span>陷阱連鎖啟動 (Trap Chain Reaction)</span>
                    <span className="text-indigo-400 font-mono-num text-[11px]">
                      Lv {chainLevel} ➔ {Math.min(3, chainLevel + 1)}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5 leading-snug">
                    {chainLevel === 0 && (
                      <>
                        未解鎖：當一處陷阱被觸發時，<span className="text-indigo-300">連鎖啟動</span>鄰近已架設陷阱，形成連續防禦火網防堵群體盜賊！
                      </>
                    )}
                    {chainLevel === 1 && (
                      <>
                        已啟用：觸發陷阱時有 <span className="font-mono-num font-bold text-yellow-300">35%</span> 機率連鎖誘爆相鄰陷阱。升級至 Lv 2 提升至 <span className="text-indigo-300">60%</span>！
                      </>
                    )}
                    {chainLevel === 2 && (
                      <>
                        共振引爆：觸發時有 <span className="font-mono-num font-bold text-yellow-300">60%</span> 機率連鎖誘發！升級至 Lv 3 解鎖完美共振 (<span className="text-indigo-300">85% 超高機率 + 額外擊退</span>)！
                      </>
                    )}
                    {chainLevel >= 3 && (
                      <>
                        最高等級 (MAX)：萬界連鎖共鳴！高達 <span className="font-mono-num font-bold text-yellow-300">85%</span> 機率連鎖啟動全場機關，連續防衛鏈無懈可擊！
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpgradeChain}
                disabled={chainLevel >= 3 || gold < chainCost}
                className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 shrink-0"
              >
                {chainLevel >= 3 ? 'MAX' : `${chainCost} G`}
              </button>
            </div>
          </div>
        </div>

        {/* === RIGHT CARD: UNLOCK ADVANCED TRAPS === */}
        <div className="forge-panel p-4 flex flex-col gap-4">
          <div className="border-b border-amber-900/80 pb-2 flex items-center justify-between">
            <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>🧪</span>
              解鎖高階傳奇陷阱類型 (Unlock Advanced Traps)
            </h4>
            <span className="text-[10px] text-cyan-400">研發後可在門口裝備</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* 1. 『黏著瀝青陷阱』(Sticky Asphalt Trap) - Requested Feature */}
            <div className={`forge-panel-inner p-3.5 border-2 transition ${
              engineering.unlockedAsphalt
                ? 'border-emerald-500/80 bg-emerald-950/20'
                : 'border-yellow-600/80 bg-[#1e0f06]'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-900 border-2 border-yellow-600 flex items-center justify-center text-2xl shrink-0 shadow-lg">
                    🪨
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-yellow-200">
                        『黏著瀝青陷阱』(Sticky Asphalt Trap)
                      </span>
                      {engineering.unlockedAsphalt ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle size={12} />
                          已解鎖
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-700">
                          未解鎖
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
                      維度科技：廢土拾荒 × 高分子複合合成樹脂
                    </span>
                    <p className="text-xs text-stone-200 mt-1 leading-relaxed">
                      小偷踩入後，速乾聚合瀝青瞬間封死其雙腳，<strong className="text-yellow-300">100% 完全定身 (Immobilized) 長達 4 秒</strong>！期間小偷無法移動、無法偷竊，為玩家提供充裕的時間敲擊擊暈！
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-amber-900/60 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {engineering.unlockedAsphalt ? '已可在玄關 1、2 號槽位自由更換裝備' : '研發費用: 260 Gold'}
                </span>

                <button
                  onClick={() => {
                    if (!engineering.unlockedAsphalt && gold >= 260) {
                      sound.playCoins();
                      sound.playTrapAsphalt();
                      onUnlockTrapType('asphalt', 260);
                    }
                  }}
                  disabled={engineering.unlockedAsphalt || gold < 260}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                    engineering.unlockedAsphalt
                      ? 'bg-emerald-950 border border-emerald-600 text-emerald-300 cursor-default'
                      : gold >= 260
                      ? 'wood-button text-amber-100 shadow-md active:scale-95'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {engineering.unlockedAsphalt ? '✓ 已研發裝備中' : '研發解鎖 (260 G)'}
                </button>
              </div>
            </div>

            {/* 2. 『超導雷暴地雷』(Tesla Overload Shock Mine) */}
            <div className={`forge-panel-inner p-3.5 border-2 transition ${
              engineering.unlockedTeslaMine
                ? 'border-cyan-500/80 bg-cyan-950/20'
                : 'border-cyan-800/80 bg-[#0d1624]'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-2xl shrink-0 shadow-lg text-cyan-300">
                    ⚡
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-cyan-200">
                        『超導雷暴地雷』(Tesla Overload Shock Mine)
                      </span>
                      {engineering.unlockedTeslaMine ? (
                        <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-0.5">
                          <CheckCircle size={12} />
                          已解鎖
                        </span>
                      ) : (
                        <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-700">
                          未解鎖
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">
                      維度科技：科幻世界 × 電漿冷聚變電弧
                    </span>
                    <p className="text-xs text-stone-200 mt-1 leading-relaxed">
                      小偷靠近時引爆高壓電弧脈衝，造成 <strong className="text-cyan-300">2.5 HP 巨額範圍雷暴打擊</strong>，並直接擊暈小偷且大幅炸退，瞬間粉碎入侵者的企圖！
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-cyan-900/60 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {engineering.unlockedTeslaMine ? '已可在玄關 1、2 號槽位自由更換裝備' : '研發費用: 320 Gold'}
                </span>

                <button
                  onClick={() => {
                    if (!engineering.unlockedTeslaMine && gold >= 320) {
                      sound.playCoins();
                      sound.playTrapTeslaExplode();
                      onUnlockTrapType('tesla', 320);
                    }
                  }}
                  disabled={engineering.unlockedTeslaMine || gold < 320}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                    engineering.unlockedTeslaMine
                      ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 cursor-default'
                      : gold >= 320
                      ? 'wood-button text-amber-100 shadow-md active:scale-95'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {engineering.unlockedTeslaMine ? '✓ 已研發裝備中' : '研發解鎖 (320 G)'}
                </button>
              </div>
            </div>

            {/* 3. *NEW* 『零度霜凍陷阱』(Cryo Freeze Trap) */}
            <div className={`forge-panel-inner p-3.5 border-2 transition ${
              engineering.unlockedCryo
                ? 'border-sky-400/80 bg-sky-950/20'
                : 'border-sky-800/80 bg-[#091e2b]'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-950 border-2 border-sky-400 flex items-center justify-center text-2xl shrink-0 shadow-lg text-sky-300">
                    ❄️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-sky-200">
                        『零度霜凍陷阱』(Cryo Freeze Trap)
                      </span>
                      {engineering.unlockedCryo ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle size={12} />
                          已解鎖
                        </span>
                      ) : (
                        <span className="text-[10px] text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-700">
                          未解鎖
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-sky-400 font-semibold block mt-0.5">
                      維度科技：奇幻世界 × 極地極光寒冰符文
                    </span>
                    <p className="text-xs text-stone-200 mt-1 leading-relaxed">
                      小偷踩入後急速結凍成冰雕，<strong className="text-sky-300">完全凍結 3.5 秒</strong>！在凍結狀態下受到飛鎚與敲擊傷害翻倍（200% 易傷加成），一鎚即可定乾坤！
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-sky-900/60 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {engineering.unlockedCryo ? '已可在玄關 1、2 號槽位自由更換裝備' : '研發費用: 300 Gold'}
                </span>

                <button
                  onClick={() => {
                    if (!engineering.unlockedCryo && gold >= 300) {
                      sound.playCoins();
                      sound.playFreeze();
                      onUnlockTrapType('cryo', 300);
                    }
                  }}
                  disabled={engineering.unlockedCryo || gold < 300}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                    engineering.unlockedCryo
                      ? 'bg-sky-950 border border-sky-500 text-sky-300 cursor-default'
                      : gold >= 300
                      ? 'wood-button text-amber-100 shadow-md active:scale-95'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {engineering.unlockedCryo ? '✓ 已研發裝備中' : '研發解鎖 (300 G)'}
                </button>
              </div>
            </div>

            {/* 4. *NEW* 『次元折疊漩渦』(Dimensional Vortex Trap) */}
            <div className={`forge-panel-inner p-3.5 border-2 transition ${
              engineering.unlockedVortex
                ? 'border-purple-400/80 bg-purple-950/20'
                : 'border-purple-800/80 bg-[#1f0f29]'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-950 border-2 border-purple-400 flex items-center justify-center text-2xl shrink-0 shadow-lg text-purple-300">
                    🌀
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-purple-200">
                        『次元折疊漩渦』(Dimensional Vortex Trap)
                      </span>
                      {engineering.unlockedVortex ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle size={12} />
                          已解鎖
                        </span>
                      ) : (
                        <span className="text-[10px] text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-700">
                          未解鎖
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-purple-400 font-semibold block mt-0.5">
                      維度科技：時空樞紐 × 引力曲率重構
                    </span>
                    <p className="text-xs text-stone-200 mt-1 leading-relaxed">
                      踩中後產生時空塌縮，<strong className="text-purple-300">立刻將小偷彈回玄關大門外並震落所有贓物</strong>，使其必須重新走回店內，提供最完美的防禦空間！
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-purple-900/60 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {engineering.unlockedVortex ? '已可在玄關 1、2 號槽位自由更換裝備' : '研發費用: 350 Gold'}
                </span>

                <button
                  onClick={() => {
                    if (!engineering.unlockedVortex && gold >= 350) {
                      sound.playCoins();
                      sound.playVortex();
                      onUnlockTrapType('vortex', 350);
                    }
                  }}
                  disabled={engineering.unlockedVortex || gold < 350}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                    engineering.unlockedVortex
                      ? 'bg-purple-950 border border-purple-500 text-purple-300 cursor-default'
                      : gold >= 350
                      ? 'wood-button text-amber-100 shadow-md active:scale-95'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {engineering.unlockedVortex ? '✓ 已研發裝備中' : '研發解鎖 (350 G)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
