/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CustomerOrder,
  MaterialItem,
  ThiefEntity,
  WorldType,
  ForgeStep,
  QteHitRating,
  CoolantType,
  ModuleType,
  FacilityUpgrades,
  TrapSlot,
  TrapType,
  TrapEngineering,
  EquippedTitleBadge,
  Achievement,
  FlyingLootEffect,
} from '../types/game';
import { CustomerPortrait } from './CustomerPortrait';
import { MaterialIcon } from './MaterialIcon';
import { ThiefCharacter } from './ThiefCharacter';
import { EntranceTrapView } from './EntranceTrapView';
import { QteBar } from './QteBar';
import { COOLANTS, MODULES, getBlacksmithRank, getNextBlacksmithRank } from '../data/gameData';
import { BlacksmithRankInfo } from '../types/game';
import { sound } from '../audio/soundManager';
import { Volume2, VolumeX, Music, Shield, Sparkles, Flame, Eye, RefreshCw, Zap, Award, Trophy } from 'lucide-react';

interface ForgeSceneProps {
  currentOrder: CustomerOrder | null;
  day: number;
  gold: number;
  reputation: number;
  activeWorld: WorldType;
  materials: MaterialItem[];
  thieves: ThiefEntity[];
  flyingLoots?: FlyingLootEffect[];
  traps: TrapSlot[];
  upgrades: FacilityUpgrades;
  engineering?: TrapEngineering;
  reconDroneAlert?: { active: boolean; message: string } | null;
  autoReloadNotice?: { trapId: string; cost: number; timestamp: number } | null;
  chainReactionAlert?: { active: boolean; count: number; timestamp: number } | null;
  rankUpAlert?: { oldRank: BlacksmithRankInfo; newRank: BlacksmithRankInfo; timestamp: number } | null;
  newAchievementAlert?: { achievement: Achievement; timestamp: number } | null;
  equippedTitleBadge?: EquippedTitleBadge | null;
  forgeExp?: number;
  onOpenRankModal?: () => void;
  onOpenAchievements?: () => void;
  isExtremeMode?: boolean;
  onToggleExtremeMode?: () => void;
  extremeRewardNotice?: { rep: number; medallions: number; timestamp: number } | null;
  onToggleWorld: () => void;
  onWhackThief: (thiefId: string) => void;
  onThrowHammer: (thiefId: string) => void;
  onSelectTrapType: (slotId: string, newType: TrapType) => void;
  onManualRearm: (slotId: string) => void;
  onCompleteForging: (qualityScore: number, matchBonus: number, perfectCount?: number) => void;
  onOpenUpgrades: () => void;
  onOpenShop: () => void;
  onOpenQuests: () => void;
  onOpenWarehouse: () => void;
  onOpenReference: () => void;
}

export const ForgeScene: React.FC<ForgeSceneProps> = ({
  currentOrder,
  day,
  gold,
  reputation,
  activeWorld,
  materials,
  thieves,
  flyingLoots = [],
  traps,
  upgrades,
  engineering,
  reconDroneAlert,
  autoReloadNotice,
  chainReactionAlert,
  rankUpAlert,
  newAchievementAlert,
  equippedTitleBadge,
  forgeExp = 0,
  onOpenRankModal,
  onOpenAchievements,
  isExtremeMode = false,
  onToggleExtremeMode,
  extremeRewardNotice,
  onToggleWorld,
  onWhackThief,
  onThrowHammer,
  onSelectTrapType,
  onManualRearm,
  onCompleteForging,
  onOpenUpgrades,
  onOpenShop,
  onOpenQuests,
  onOpenWarehouse,
  onOpenReference,
}) => {
  // Forge Mini-Game State Machine
  const [forgeStep, setForgeStep] = useState<ForgeStep>('STANDBY');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [crucibleHeat, setCrucibleHeat] = useState<number>(300); // target 800 - 1100
  const [qteHitsRemaining, setQteHitsRemaining] = useState<number>(4);
  const [qteScores, setQteScores] = useState<QteHitRating[]>([]);
  const [selectedCoolant, setSelectedCoolant] = useState<CoolantType | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [isHammerStriking, setIsHammerStriking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isBgmActive, setIsBgmActive] = useState<boolean>(sound.isBgmActive());

  // Inventory category filter
  const [inventoryTab, setInventoryTab] = useState<'all' | 'ingot' | 'crystal' | 'tech'>('all');

  // Combo tracking for Combo Artisan upgrade
  const [consecutivePerfects, setConsecutivePerfects] = useState<number>(0);
  const [showComboSurge, setShowComboSurge] = useState<boolean>(false);

  // Heat decay when in MELT step (bellows upgrade slows down cooling)
  useEffect(() => {
    if (forgeStep !== 'MELT') return;
    const decayRate = Math.max(5, 15 - (upgrades.bellowsPowerLevel || 0) * 3);
    const interval = setInterval(() => {
      setCrucibleHeat((prev) => Math.max(250, prev - decayRate));
    }, 200);
    return () => clearInterval(interval);
  }, [forgeStep, upgrades.bellowsPowerLevel]);

  // Handle Bellows Pump (Heating boosted by bellows power upgrade)
  const handlePumpBellows = () => {
    sound.playBellows();
    const pumpPower = 120 + (upgrades.bellowsPowerLevel || 0) * 45;
    setCrucibleHeat((prev) => {
      const next = Math.min(1400, prev + pumpPower);
      return next;
    });
  };

  // Check if heat is ready to advance
  const isHeatOptimal = crucibleHeat >= 800 && crucibleHeat <= 1150;

  // Start forging when order is present
  const handleStartForge = () => {
    if (!currentOrder) return;
    // Pre-check materials
    setSelectedMaterials(currentOrder.requiredMaterials.map((m) => m.materialId));
    setForgeStep('MELT');
    setCrucibleHeat(450);
    setQteHitsRemaining(4);
    setQteScores([]);
    setConsecutivePerfects(0);
    setShowComboSurge(false);
    setSelectedCoolant(null);
    setSelectedModule(null);
  };

  // Move from Heat to Hammer QTE
  const handleProceedToHammer = () => {
    sound.playHammerHit('GREAT');
    setForgeStep('HAMMER_QTE');
    setQteHitsRemaining(4);
    setQteScores([]);
    setConsecutivePerfects(0);
    setShowComboSurge(false);
  };

  // Handle QTE Strike
  const handleQteHit = (rating: QteHitRating) => {
    sound.playHammerHit(rating);
    setIsHammerStriking(true);
    setTimeout(() => setIsHammerStriking(false), 200);

    const updated = [...qteScores, rating];
    setQteScores(updated);

    // Combo Artisan mastery logic
    if (rating === 'PERFECT') {
      const nextCombo = consecutivePerfects + 1;
      setConsecutivePerfects(nextCombo);
      if (nextCombo >= 2 && (upgrades.comboArtisanLevel || 0) > 0) {
        sound.playMultiverseSurge();
        setShowComboSurge(true);
        setTimeout(() => setShowComboSurge(false), 2200);
      }
    } else {
      setConsecutivePerfects(0);
    }

    const nextHits = qteHitsRemaining - 1;
    setQteHitsRemaining(nextHits);

    if (nextHits <= 0) {
      setTimeout(() => {
        setForgeStep('QUENCH_ASSEMBLE');
      }, 500);
    }
  };

  // Handle Final Quench and Deliver
  const handleFinalQuench = () => {
    sound.playQuench();
    sound.playCoins();

    // Calculate score
    const perfectCount = qteScores.filter((s) => s === 'PERFECT').length;
    const greatCount = qteScores.filter((s) => s === 'GREAT').length;
    const passCount = qteScores.filter((s) => s === 'PASS').length;

    // Quality multiplier: 1.0 to 1.5
    let qualityMultiplier = 1.0 + perfectCount * 0.12 + greatCount * 0.06 - (qteScores.length - perfectCount - greatCount - passCount) * 0.1;
    qualityMultiplier = Math.max(0.6, Math.min(1.5, qualityMultiplier));

    // Match bonus: matching coolant to world
    let matchBonus = 1.0;
    if (currentOrder) {
      if (currentOrder.requiredCoolant === selectedCoolant) matchBonus += 0.2;
      if (currentOrder.requiredModule === selectedModule) matchBonus += 0.2;
    }

    onCompleteForging(qualityMultiplier, matchBonus, perfectCount);
    setForgeStep('STANDBY');
    setSelectedMaterials([]);
    setSelectedCoolant(null);
    setSelectedModule(null);
  };

  // Blacksmith Rank & Perk Calculation
  const currentRank = getBlacksmithRank(forgeExp);
  const nextRank = getNextBlacksmithRank(forgeExp);
  const rankPerfectMultiplier = currentRank.level >= 3 ? 1.15 : 1.0;

  // Real-time Forging Quality Score calculation for flame transitions & distortion
  const runningQualityScore = React.useMemo(() => {
    if (forgeStep === 'STANDBY') return 1.08;
    if (forgeStep === 'MELT') {
      if (crucibleHeat >= 800 && crucibleHeat <= 1150) return 1.35;
      if (crucibleHeat > 1150) return 0.85;
      if (crucibleHeat < 500) return 0.70;
      return 1.10;
    }
    if (qteScores.length > 0) {
      const perfectCount = qteScores.filter((s) => s === 'PERFECT').length;
      const greatCount = qteScores.filter((s) => s === 'GREAT').length;
      const passCount = qteScores.filter((s) => s === 'PASS').length;
      const missCount = qteScores.filter((s) => s === 'MISS').length;
      let score = 1.0 + perfectCount * 0.15 + greatCount * 0.08 + passCount * 0.02 - missCount * 0.15;
      if (consecutivePerfects >= 2) score += 0.2;
      return Math.max(0.6, Math.min(1.5, score));
    }
    return 1.15;
  }, [forgeStep, crucibleHeat, qteScores, consecutivePerfects]);

  // Flame type: High quality >= 1.25 -> blue-white high temp; Low quality < 0.95 -> dark red; Normal -> orange
  const flameType: 'HIGH_BLUE' | 'LOW_RED' | 'NORMAL' =
    runningQualityScore >= 1.25 ? 'HIGH_BLUE' : runningQualityScore < 0.95 ? 'LOW_RED' : 'NORMAL';

  // Calculate Anvil & Precision hit zone width with Rank 3 perk
  const perfectWidth = Math.round((14 + upgrades.anvilLevel * 2 + upgrades.skillPrecision * 2) * rankPerfectMultiplier);
  const greatWidth = 36 + upgrades.anvilLevel * 4 + upgrades.skillPrecision * 3;

  const filteredMaterials = materials.filter((m) => {
    if (inventoryTab === 'all') return true;
    return m.category === inventoryTab;
  });

  return (
    <div className="relative w-full h-full min-h-screen bg-stone-950 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. TOP HUD BAR (Matches Image 1 top right & status) */}
      <header className="relative z-40 w-full bg-gradient-to-b from-[#2a170d] to-[#1a0e08] border-b-2 border-[#5a3318] px-4 py-2 flex items-center justify-between shadow-lg">
        {/* Left: Game Title Wordmark & Blacksmith Rank Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-[#3a1d0d] border border-[#7d431e] rounded-lg shadow-inner flex items-center gap-2">
            <span className="font-display font-black text-amber-300 text-base md:text-lg tracking-wider uppercase">
              MULTIVERSE FORGE
            </span>
            <span className="text-amber-500/80 text-xs hidden sm:inline">《萬界鐵匠鋪》</span>
          </div>

          {/* Blacksmith Rank Pill */}
          <button
            onClick={onOpenRankModal}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-2 transition hover:scale-105 shadow-md ${currentRank.borderClass} ${
              currentRank.level >= 5
                ? 'bg-amber-950/90 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.4)] animate-pulse'
                : currentRank.level >= 4
                ? 'bg-purple-950/80 text-purple-200 shadow-[0_0_10px_rgba(192,132,252,0.3)]'
                : 'bg-stone-900/90 text-stone-200'
            }`}
            title="點擊查看鐵匠職堦晉升進度與專屬特權"
          >
            <span className="text-base">{currentRank.badgeIcon}</span>
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-center gap-1">
                <span className={`text-[11px] font-black ${currentRank.colorClass}`}>
                  {currentRank.titleZh.split(' ')[0]}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-stone-800 text-stone-300 font-bold">
                  Lv.{currentRank.level}
                </span>
              </div>
              <div className="w-16 h-1 bg-stone-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300"
                  style={{
                    width: nextRank
                      ? `${Math.min(100, Math.max(8, ((forgeExp - currentRank.requiredExp) / (nextRank.requiredExp - currentRank.requiredExp)) * 100))}%`
                      : '100%',
                  }}
                />
              </div>
            </div>
          </button>

          {/* Equipped Special Title & Badge Pill */}
          {equippedTitleBadge && (
            <button
              onClick={onOpenAchievements}
              className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition hover:scale-105 shadow-md ${equippedTitleBadge.badgeColorClass}`}
              title="點擊開啟萬界鐵匠成就殿堂"
            >
              <span className="text-base filter drop-shadow">{equippedTitleBadge.badgeIcon}</span>
              <span className="text-[11px] font-black tracking-wide hidden sm:inline">
                {equippedTitleBadge.titleZh.split(' ')[0]}
              </span>
            </button>
          )}

          {/* Hall of Achievements Trophy Button */}
          <button
            onClick={onOpenAchievements}
            className="p-1.5 rounded-xl bg-stone-900 border border-amber-800 text-yellow-400 hover:bg-stone-800 hover:border-yellow-500 transition shadow"
            title="開啟萬界成就殿堂 (Hall of Achievements)"
          >
            <Trophy size={16} />
          </button>
        </div>

        {/* Center: Forge Status / Portal Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-amber-200/90">
          <span className="text-stone-400">當前連結:</span>
          <span className="px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/60 text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {activeWorld === 'SCIFI' ? '科幻世界 (Sci-Fi)' : activeWorld === 'FANTASY' ? '奇幻世界 (Fantasy)' : '廢土蒸氣 (Steampunk)'}
          </span>
          {upgrades.securityScanLevel > 0 && (
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 flex items-center gap-1 text-[11px]">
              <Shield size={12} />
              自動保全 Lv.{upgrades.securityScanLevel}
            </span>
          )}
          {upgrades.trapLevel > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/60 text-amber-300 flex items-center gap-1 text-[11px]">
              <span>🪤</span>
              玄關陷阱 Lv.{upgrades.trapLevel}
            </span>
          )}
        </div>

        {/* Right: Day, Gold, Reputation (Matches Image 1 top-right badge) */}
        <div className="flex items-center gap-3">
          {/* Day / Gold / Reputation Card */}
          <div className="bg-[#24130b] border-2 border-[#683b1c] rounded-xl px-3 py-1.5 shadow-md flex items-center gap-3 md:gap-4 text-xs font-bold">
            <div className="flex items-center gap-1 text-amber-200">
              <span className="text-stone-400">Day</span>
              <span className="font-mono-num text-amber-300 text-sm">{day}</span>
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 ml-0.5 inline-block" />
            </div>

            <div className="flex items-center gap-1 text-yellow-300">
              <span className="text-amber-500">Gold:</span>
              <span className="font-mono-num text-sm text-yellow-300">{gold.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-300">
              <span className="text-stone-400">Rep:</span>
              <div className="flex text-amber-400 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < reputation ? 'text-amber-400' : 'text-stone-600'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Extreme Blacksmith Mode Toggle */}
          <button
            onClick={onToggleExtremeMode}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-bold transition shadow-md ${
              isExtremeMode
                ? 'bg-gradient-to-r from-red-950 via-[#450a0a] to-red-950 border-red-500 text-red-200 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-stone-900 border-amber-900/60 text-stone-300 hover:text-amber-200 hover:border-amber-600'
            }`}
            title={
              isExtremeMode
                ? '極限鐵匠模式已啟動：顧客耐心消耗翻倍！完成獲 2 倍聲譽與【宗師勳章】。點擊關閉'
                : '點擊開啟『極限鐵匠模式』：挑戰翻倍耐心消耗，獲取 2 倍聲譽與專屬【宗師勳章】'
            }
          >
            <span className={isExtremeMode ? 'animate-bounce text-sm' : 'text-stone-400'}>🔥</span>
            <div className="flex flex-col items-start leading-tight">
              <div className="flex items-center gap-1">
                <span className="hidden sm:inline">極限鐵匠:</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  isExtremeMode ? 'bg-red-600 text-white' : 'bg-stone-800 text-stone-400'
                }`}>
                  {isExtremeMode ? 'ON 2x速' : 'OFF'}
                </span>
              </div>
              {isExtremeMode && (
                <span className="text-[8px] text-amber-300 font-mono-num hidden md:inline">
                  2x聲譽 · 宗師勳章
                </span>
              )}
            </div>
          </button>

          {/* Sound & Music Controls */}
          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              sound.setMuted(next);
            }}
            className="p-1.5 rounded-lg bg-stone-900 border border-amber-900/60 text-amber-300 hover:bg-stone-800 transition"
            title={isMuted ? '開啟音效' : '靜音'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => {
              const active = sound.toggleBgm();
              setIsBgmActive(active);
            }}
            className={`p-1.5 rounded-lg border transition ${
              isBgmActive
                ? 'bg-amber-950 border-amber-500 text-amber-300'
                : 'bg-stone-900 border-amber-900/60 text-stone-400 hover:text-amber-300'
            }`}
            title={isBgmActive ? '停止背景鍛造節奏' : '播放背景鍛造節奏'}
          >
            <Music size={16} />
          </button>

          {/* View Original Design Mockup Button */}
          <button
            onClick={onOpenReference}
            className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 border border-amber-700/60 text-amber-200 hover:bg-amber-950 transition"
            title="查看原版企劃與美術設定稿"
          >
            <Eye size={14} />
            企劃原稿
          </button>
        </div>
      </header>

      {/* 2. MAIN FORGE WORKSHOP ARENA */}
      <main className="relative flex-1 w-full flex overflow-hidden">
        {/* Background Workshop Layers */}
        <div className="absolute inset-0 z-0 bg-[#2b180d] pointer-events-none">
          {/* Wood Beam Arch & Stone Wall Textures */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#5a3014_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Wooden floor planks */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#1b0d06] to-[#341b0d] border-t-4 border-[#522912]" />

          {/* Hanging Blacksmith Tools on Wall (Matching Image 1) */}
          <div className="absolute top-16 left-1/3 flex items-center gap-6 opacity-60">
            <div className="w-1.5 h-16 bg-stone-700 rounded-b shadow" />
            <div className="w-2 h-20 bg-stone-600 rounded-b shadow" />
            <div className="w-1.5 h-14 bg-stone-700 rounded-b shadow" />
          </div>

          {/* --- DYNAMIC WORLD TAPESTRIES & DECORATIONS LAYER --- */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-start justify-center gap-12 pointer-events-none transition-all duration-700">
            {activeWorld === 'FANTASY' && (
              <div className="flex items-start gap-8 opacity-90 animate-fadeIn">
                {/* Left Floating Mana Crystal Lamp */}
                <div className="flex flex-col items-center">
                  <div className="w-1 h-12 bg-amber-800" />
                  <div className="w-6 h-8 bg-cyan-500/80 rounded-b-full shadow-[0_0_15px_#06b6d4] animate-pulse flex items-center justify-center border border-cyan-300">
                    <span className="text-[10px]">✨</span>
                  </div>
                </div>

                {/* Central Royal Velvet Dragon Tapestry */}
                <div className="w-52 h-44 bg-gradient-to-b from-[#4a0e17] via-[#2e0912] to-[#1a0408] border-4 border-[#ca8a04] shadow-2xl rounded-b-2xl relative overflow-hidden flex flex-col items-center p-2">
                  {/* Gold Embroidered Header Bar */}
                  <div className="w-full h-3 bg-[#a16207] rounded-sm mb-1 flex items-center justify-around px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
                    <span className="text-[8px] font-bold text-yellow-100 tracking-widest uppercase">ROYAL RUNES</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
                  </div>
                  {/* Tapestry Crest */}
                  <div className="my-auto flex flex-col items-center text-center">
                    <span className="text-3xl text-amber-300 filter drop-shadow(0 0 8px #f59e0b)">🛡️</span>
                    <span className="text-[10px] font-black text-amber-200 tracking-wider mt-1">
                      艾爾登王廷御用鐵匠旗
                    </span>
                    <span className="text-[8px] text-amber-400/80">
                      ◆ 秘銀聖火 · 龍紋銘刻 ◆
                    </span>
                  </div>
                  {/* Gold Tassels */}
                  <div className="absolute -bottom-1 flex gap-2">
                    <div className="w-2 h-3 bg-yellow-500 rounded-b-sm" />
                    <div className="w-2 h-4 bg-yellow-400 rounded-b-sm" />
                    <div className="w-2 h-3 bg-yellow-500 rounded-b-sm" />
                  </div>
                </div>

                {/* Right Floating Mana Crystal Lamp */}
                <div className="flex flex-col items-center">
                  <div className="w-1 h-12 bg-amber-800" />
                  <div className="w-6 h-8 bg-purple-500/80 rounded-b-full shadow-[0_0_15px_#c084fc] animate-pulse flex items-center justify-center border border-purple-300">
                    <span className="text-[10px]">🔮</span>
                  </div>
                </div>
              </div>
            )}

            {activeWorld === 'SCIFI' && (
              <div className="flex items-start gap-8 opacity-90 animate-fadeIn">
                {/* Left Cooling Plasma Conduit */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-14 bg-cyan-950 border border-cyan-500/60 shadow-[0_0_10px_#06b6d4] flex items-center justify-center">
                    <div className="w-1 h-full bg-cyan-400 animate-pulse" />
                  </div>
                </div>

                {/* Central Cyberpunk Neon Holographic Banner */}
                <div className="w-60 h-44 bg-gradient-to-b from-[#022c22]/80 via-[#031514]/90 to-[#000000] border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)] rounded-lg relative overflow-hidden flex flex-col items-center p-2 backdrop-blur-sm">
                  {/* Digital HUD scanline grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:100%_6px]" />
                  <div className="w-full flex items-center justify-between border-b border-cyan-500/40 pb-1 z-10">
                    <span className="text-[8px] font-mono-num font-bold text-cyan-300">SYSTEM: NEON_FORGE_V4</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  {/* Holographic Wireframe Icon & Text */}
                  <div className="my-auto flex flex-col items-center text-center z-10">
                    <span className="text-3xl filter drop-shadow(0 0 10px #06b6d4)">⚡</span>
                    <span className="text-[10px] font-mono-num font-black text-cyan-200 tracking-wider mt-1">
                      量子光子重組矩陣
                    </span>
                    <span className="text-[8px] text-emerald-300 font-mono-num">
                      [ PLASMA MATRIX SYNTHESIS ]
                    </span>
                  </div>
                  {/* Bottom Hazard Stripe */}
                  <div className="w-full h-2 bg-[repeating-linear-gradient(45deg,#06b6d4,#06b6d4_6px,#0f172a_6px,#0f172a_12px)] z-10" />
                </div>

                {/* Right Cooling Plasma Conduit */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-14 bg-emerald-950 border border-emerald-500/60 shadow-[0_0_10px_#10b981] flex items-center justify-center">
                    <div className="w-1 h-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {activeWorld === 'STEAMPUNK' && (
              <div className="flex items-start gap-6 opacity-90 animate-fadeIn">
                {/* Left Brass Pressure Manometer */}
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-10 bg-amber-900 border border-amber-700" />
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-700 via-amber-900 to-amber-950 border-2 border-amber-400 flex items-center justify-center shadow-lg relative">
                    <div className="w-3 h-0.5 bg-red-500 origin-left rotate-45 animate-pulse" />
                    <span className="absolute bottom-1 text-[7px] font-bold text-amber-200">BAR</span>
                  </div>
                </div>

                {/* Central Weathered Clockwork Gear Banner */}
                <div className="w-56 h-44 bg-gradient-to-b from-[#3a200e] via-[#241208] to-[#120803] border-4 border-[#b45309] shadow-2xl rounded-b-xl relative overflow-hidden flex flex-col items-center p-2">
                  <div className="w-full flex items-center justify-between border-b-2 border-[#b45309] pb-1">
                    <span className="text-[8px] font-bold text-amber-300 tracking-wider">COG & VALVE MFG</span>
                    <span className="text-xs">⚙️</span>
                  </div>
                  {/* Interlocking Brass Cogwheels */}
                  <div className="my-auto flex flex-col items-center text-center">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl text-amber-400 animate-spin" style={{ animationDuration: '8s' }}>⚙️</span>
                      <span className="text-xl text-yellow-500 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>⚙️</span>
                    </div>
                    <span className="text-[10px] font-black text-amber-100 tracking-wider mt-1">
                      廢土蒸汽工坊戰旗
                    </span>
                    <span className="text-[8px] text-amber-400/90 font-mono-num">
                      PRESSURE: 140 PSI · STEAM HIGH
                    </span>
                  </div>
                  {/* Rivets and exhaust slits */}
                  <div className="w-full flex justify-around">
                    <div className="w-2 h-2 rounded-full bg-amber-600 border border-amber-300 shadow" />
                    <div className="w-2 h-2 rounded-full bg-amber-600 border border-amber-300 shadow" />
                    <div className="w-2 h-2 rounded-full bg-amber-600 border border-amber-300 shadow" />
                  </div>
                </div>

                {/* Right Brass Pressure Manometer */}
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-10 bg-amber-900 border border-amber-700" />
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-700 via-amber-900 to-amber-950 border-2 border-amber-400 flex items-center justify-center shadow-lg relative">
                    <div className="w-3 h-0.5 bg-yellow-400 origin-left -rotate-30 animate-pulse" />
                    <span className="absolute bottom-1 text-[7px] font-bold text-amber-200">PSI</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SVG Filter for Heat Wave Distortion */}
          <svg className="absolute w-0 h-0" aria-hidden="true">
            <defs>
              <filter id="heatWaveDistortion" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.025 0.08" numOctaves="2" seed="4" result="noise">
                  <animate attributeName="baseFrequency" dur="3s" values="0.02 0.07; 0.035 0.11; 0.02 0.07" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>

          {/* Brick Furnace with Glowing Hearth Fire (Center-Right Background) */}
          <div className="absolute bottom-28 left-1/2 translate-x-4 md:translate-x-12 w-64 md:w-80 h-72 md:h-84 flex flex-col items-center">
            {/* Heat Haze Shimmering Wave Overlay */}
            <div
              className="absolute -top-14 w-56 h-48 pointer-events-none opacity-80 animate-heat-wave z-10"
              style={{ filter: 'url(#heatWaveDistortion)' }}
            >
              <div
                className={`w-full h-full rounded-full blur-md ${
                  flameType === 'HIGH_BLUE'
                    ? 'bg-gradient-to-t from-cyan-400/35 via-blue-400/20 to-transparent'
                    : flameType === 'LOW_RED'
                    ? 'bg-gradient-to-t from-red-800/30 via-red-950/15 to-transparent'
                    : 'bg-gradient-to-t from-amber-500/25 via-orange-400/15 to-transparent'
                }`}
              />
            </div>

            {/* Curved Stone Chimney & Arch */}
            <div className="w-56 h-36 bg-[#3d2315] border-4 border-[#61361c] rounded-t-full relative shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Inner Glowing Hearth: Dynamically transitions from Blue-White (High) to Dark Red (Low) */}
              <div
                className={`w-40 h-28 rounded-t-full flex items-end justify-center pb-2 transition-all duration-700 ${
                  flameType === 'HIGH_BLUE'
                    ? 'bg-gradient-to-t from-blue-700 via-cyan-400 to-indigo-100 animate-fire-blue'
                    : flameType === 'LOW_RED'
                    ? 'bg-gradient-to-t from-stone-950 via-red-900 to-rose-950 animate-fire-dark'
                    : 'bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 animate-fire'
                }`}
              >
                <Flame
                  size={64}
                  className={`transition-colors duration-700 ${
                    flameType === 'HIGH_BLUE'
                      ? 'text-cyan-100 animate-pulse drop-shadow-[0_0_16px_#38bdf8]'
                      : flameType === 'LOW_RED'
                      ? 'text-red-400 opacity-60'
                      : 'text-amber-100 animate-pulse'
                  }`}
                />
              </div>

              {/* Quality Flame State Badge */}
              <div
                className={`absolute top-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase border shadow backdrop-blur-sm ${
                  flameType === 'HIGH_BLUE'
                    ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_10px_#06b6d4]'
                    : flameType === 'LOW_RED'
                    ? 'bg-red-950/90 border-red-700 text-red-300'
                    : 'bg-amber-950/80 border-amber-600 text-amber-200'
                }`}
              >
                {flameType === 'HIGH_BLUE'
                  ? `【藍白超極溫】${runningQualityScore.toFixed(2)}x`
                  : flameType === 'LOW_RED'
                  ? `【暗紅餘燼】${runningQualityScore.toFixed(2)}x`
                  : `【常規烈火】${runningQualityScore.toFixed(2)}x`}
              </div>
            </div>

            {/* Furnace Base Bricks */}
            <div className="w-64 h-16 bg-[#2d180d] border-x-4 border-b-4 border-[#61361c] shadow-lg flex items-center justify-center gap-3">
              <span className="text-[11px] font-mono-num font-bold text-amber-400">
                爐溫: {crucibleHeat}°C
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                評分: {runningQualityScore.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>

        {/* --- LEFT COLUMN: Customer Order Panel & Inventory (Exact match to Image 1) --- */}
        <div className="relative z-20 w-72 sm:w-80 md:w-88 p-3 flex flex-col gap-3 justify-between pointer-events-auto">
          {/* Top Left: Customer Order Panel */}
          {currentOrder ? (
            <div className="forge-panel p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-amber-900/60 pb-1.5">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Customer Order Panel
                </span>
                <span className="text-[10px] text-amber-500">
                  {currentOrder.world === 'SCIFI' ? '科幻世界' : currentOrder.world === 'FANTASY' ? '奇幻世界' : '廢土蒸氣'}
                </span>
              </div>

              <div className="flex gap-3">
                {/* Customer Portrait */}
                <div className="w-20 h-20 shrink-0 border-2 border-amber-700 rounded-xl overflow-hidden shadow-md">
                  <CustomerPortrait portraitId={currentOrder.portrait} size={80} />
                </div>

                {/* Speech Bubble / Request */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="relative bg-[#3d2214] border border-[#783f1d] rounded-lg p-2 text-xs text-amber-100 shadow">
                    <p className="line-clamp-3 leading-snug">{currentOrder.dialogueZh}</p>
                    {/* Speech bubble tail pointing to portrait */}
                    <div className="absolute top-4 -left-1.5 w-3 h-3 bg-[#3d2214] border-l border-b border-[#783f1d] rotate-45" />
                  </div>

                  {/* Weapon Requirement + Timer icon */}
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-cyan-300">{currentOrder.weaponNameZh}</span>
                    </div>
                    <span className="text-[11px] font-mono-num text-amber-300 font-bold">
                      +{currentOrder.baseGold}G
                    </span>
                  </div>
                </div>
              </div>

              {/* Patience Countdown Bar */}
              <div className="flex flex-col gap-0.5 mt-0.5">
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>耐性倒數 (Patience)</span>
                  <span className="font-mono-num text-amber-300">{Math.ceil(currentOrder.timeRemaining)}s</span>
                </div>
                <div className="w-full h-3 bg-stone-900/90 rounded-full border border-amber-800/80 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      currentOrder.timeRemaining > 20
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                        : 'bg-gradient-to-r from-amber-500 to-red-500 animate-pulse'
                    }`}
                    style={{ width: `${Math.max(0, (currentOrder.timeRemaining / currentOrder.maxTime) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Extreme Mode Active Indicator in Order */}
              {isExtremeMode && (
                <div className="bg-red-950/80 border border-red-500/80 rounded-lg px-2 py-1 flex items-center justify-between text-[10px] text-red-200 shadow animate-pulse">
                  <span className="flex items-center gap-1 font-bold">
                    <span>🔥</span>
                    <span>極限考驗：耐心消耗 x2</span>
                  </span>
                  <span className="text-yellow-300 font-extrabold">+2x聲譽 · 宗師勳章</span>
                </div>
              )}

              {/* Start Forging Trigger */}
              {forgeStep === 'STANDBY' && (
                <button
                  onClick={handleStartForge}
                  className="wood-button w-full py-1.5 rounded-lg text-amber-100 font-bold text-xs flex items-center justify-center gap-1.5 mt-1"
                >
                  <Sparkles size={14} className="text-yellow-300" />
                  開始鍛造此訂單！
                </button>
              )}
            </div>
          ) : (
            <div className="forge-panel p-4 flex flex-col items-center justify-center text-center text-amber-300/70 text-xs">
              <RefreshCw className="animate-spin mb-2 text-amber-500" size={24} />
              等待時空顧客穿過傳送門...
            </div>
          )}

          {/* Bottom Left: Materials Inventory (Matches Image 1) */}
          <div className="forge-panel p-2.5 flex-1 flex flex-col justify-between max-h-72">
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Materials Inventory
              </span>
              <button
                onClick={onOpenWarehouse}
                className="text-[10px] text-amber-400 underline hover:text-amber-200"
              >
                查看全部
              </button>
            </div>

            {/* Inventory Category Filter Tabs */}
            <div className="flex items-center gap-1 my-1.5">
              {(['all', 'ingot', 'crystal', 'tech'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setInventoryTab(tab)}
                  className={`text-[10px] px-2 py-0.5 rounded capitalize transition ${
                    inventoryTab === tab
                      ? 'bg-amber-800 text-amber-100 font-bold'
                      : 'bg-[#311a0e] text-stone-400 hover:text-amber-200'
                  }`}
                >
                  {tab === 'all' ? '全部' : tab === 'ingot' ? '合金' : tab === 'crystal' ? '魔晶' : '科技'}
                </button>
              ))}
            </div>

            {/* Materials Grid (Matches Image 1 & 2) */}
            <div className="grid grid-cols-3 gap-1.5 overflow-y-auto max-h-44 pr-1">
              {filteredMaterials.slice(0, 6).map((mat) => (
                <div
                  key={mat.id}
                  className="forge-panel-inner p-1.5 flex flex-col items-center justify-center relative hover:border-amber-500 transition group"
                  title={`${mat.nameZh}: ${mat.descriptionZh}`}
                >
                  <MaterialIcon icon={mat.icon} size={32} />
                  <span className="font-mono-num text-[11px] font-bold text-amber-300 mt-0.5">
                    {mat.count}
                  </span>
                  <span className="text-[9px] text-stone-300 truncate w-full text-center leading-tight">
                    {mat.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Open Fusion / Upgrades hint */}
            <button
              onClick={onOpenUpgrades}
              className="mt-1 text-[10px] text-center text-amber-400/80 hover:text-amber-200"
            >
              材料融合與管理 (Fusion Mixer) ➜
            </button>
          </div>
        </div>

        {/* --- CENTER STAGE: Anvil, Blacksmith, Glowing Sword & Interactive QTE --- */}
        <div className="relative flex-1 flex flex-col items-center justify-end pb-8 z-10 pointer-events-auto">
          {/* Blacksmith Avatar Hammering Animation (Ash-Gray Skin Tone) */}
          <div className="absolute bottom-40 left-1/2 -translate-x-32 md:-translate-x-44 pointer-events-none select-none">
            <svg
              width="140"
              height="180"
              viewBox="0 0 100 130"
              fill="none"
              className={`transition-transform duration-100 ${
                isHammerStriking ? 'rotate-[-12deg] translate-y-2' : ''
              }`}
            >
              {/* Blacksmith Body & Dark Slate Apron */}
              <ellipse cx="50" cy="85" rx="22" ry="32" fill="#374151" stroke="#1f2937" strokeWidth="3" />
              <rect x="36" y="65" width="28" height="42" rx="4" fill="#1f2937" />
              <path d="M42 65 L36 90 M58 65 L64 90" stroke="#6b7280" strokeWidth="2" />

              {/* Gray Neck */}
              <path d="M44 48 L44 58 L56 58 L56 48 Z" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />

              {/* Gray Left Arm & Hand Holding Tongs */}
              <path d="M60 62 L76 72 L82 80" stroke="#9ca3af" strokeWidth="8" strokeLinecap="round" />
              <circle cx="82" cy="80" r="4.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
              {/* Iron Tongs extending towards anvil */}
              <path d="M82 80 L98 84 M82 82 L100 87" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

              {/* Head with Gray Skin Tone (Valid SVG ellipse with rx and ry) */}
              <circle cx="35" cy="38" r="3.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.2" />
              <circle cx="65" cy="38" r="3.5" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.2" />
              <ellipse cx="50" cy="38" rx="15" ry="17" fill="#9ca3af" stroke="#4b5563" strokeWidth="2" />

              {/* Hair & Topknot Bun */}
              <ellipse cx="50" cy="24" rx="14" ry="10" fill="#1f2937" />
              <circle cx="50" cy="14" r="7" fill="#1f2937" />

              {/* Eyebrows, Eyes & Facial Features */}
              <path d="M42 32 Q46 30 49 33" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M51 33 Q54 30 58 32" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="45" cy="36" r="2" fill="#111827" />
              <circle cx="55" cy="36" r="2" fill="#111827" />
              <path d="M50 35 L52 40 L48 41" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M45 44 Q50 48 55 44" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Raised Muscular Arm with Hammer (Solid Gray Skin Tone) */}
              <g
                className={`origin-[35px_55px] transition-transform duration-100 ${
                  isHammerStriking ? 'rotate-[45deg]' : 'rotate-[-20deg]'
                }`}
              >
                <path d="M36 60 L18 36 L12 28" stroke="#9ca3af" strokeWidth="9" strokeLinecap="round" />
                <circle cx="12" cy="28" r="5" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.2" />
                {/* Heavy Steel Sledgehammer */}
                <rect x="4" y="24" width="24" height="6" fill="#78350f" transform="rotate(-30 16 27)" />
                <rect x="10" y="8" width="16" height="24" rx="3" fill="#475569" stroke="#1e293b" strokeWidth="2" transform="rotate(-30 18 20)" />
              </g>
            </svg>
          </div>

          {/* Heavy Steel Anvil with Glowing Sword/Battleaxe (Centerpiece from Image 1) */}
          <div className="relative flex flex-col items-center">
            {/* The Glowing Weapon Resting on Anvil with Heat Wave Distortion Effect */}
            <div
              className={`relative z-20 -mb-6 flex items-center justify-center transition-all ${
                forgeStep !== 'STANDBY' ? 'animate-heat-wave' : ''
              }`}
              style={forgeStep !== 'STANDBY' ? { filter: 'url(#heatWaveDistortion)' } : undefined}
            >
              {forgeStep !== 'STANDBY' ? (
                <div className="relative group animate-float">
                  {/* Glowing Battleaxe or Runic Sword */}
                  <svg width="240" height="90" viewBox="0 0 240 90" fill="none">
                    {/* Glowing Aura Effect */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Cyan / Violet Energy Aura Blade */}
                    <path
                      d="M40 45 L90 25 L200 42 L220 45 L200 48 L90 65 Z"
                      fill="#38bdf8"
                      filter="url(#glow)"
                      opacity="0.9"
                    />
                    <path
                      d="M50 45 L95 30 L195 44 L210 45 L195 46 L95 60 Z"
                      fill="#e0f2fe"
                    />
                    {/* Weapon Guard and Runes */}
                    <rect x="75" y="20" width="12" height="50" rx="3" fill="#7c3aed" stroke="#c084fc" strokeWidth="2" />
                    <circle cx="81" cy="45" r="5" fill="#facc15" filter="drop-shadow(0 0 5px #facc15)" />
                    {/* Hilt and Pommel */}
                    <rect x="35" y="42" width="40" height="6" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                    <circle cx="33" cy="45" r="6" fill="#ca8a04" />

                    {/* Sparks */}
                    <circle cx="140" cy="35" r="2" fill="#ffffff" className="animate-ping" />
                    <circle cx="170" cy="50" r="1.5" fill="#38bdf8" className="animate-ping" />
                  </svg>
                </div>
              ) : (
                <div className="text-xs font-semibold text-amber-300/80 py-2">
                  [ 鐵砧待命中：從左側面板啟動鍛造 ]
                </div>
              )}

              {/* Combo Surge Floating Fanfare Banner */}
              {showComboSurge && (
                <div className="absolute -top-8 z-50 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 border-2 border-yellow-100 text-stone-950 font-black text-xs px-3 py-1 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.8)] flex items-center gap-1.5 animate-bounce">
                  <Sparkles size={14} className="text-amber-950 animate-spin" />
                  <span>✨ 神匠連擊！COMBO SURGE (評分超絕提升)</span>
                </div>
              )}
            </div>

            {/* Cast-Iron Anvil Base (Matches Image 1) */}
            <div className="relative w-72 md:w-96 flex flex-col items-center">
              <svg width="340" height="120" viewBox="0 0 340 120" fill="none">
                {/* Anvil Horn and Body */}
                <path
                  d="M40 25 L80 20 L270 20 L300 25 L260 45 L230 75 L250 110 L90 110 L110 75 L80 45 Z"
                  fill="#334155"
                  stroke="#1e293b"
                  strokeWidth="4"
                />
                {/* Top Flat Striking Surface Highlight */}
                <polygon points="75,20 275,20 285,25 65,25" fill="#64748b" />
                {/* Anvil Base Pedestal */}
                <rect x="80" y="105" width="180" height="12" rx="3" fill="#1e293b" />
              </svg>

              {/* Wooden Support Barrel/Stump (Bottom Left of Anvil in Image 1) */}
              <div className="absolute -left-12 bottom-0 w-20 h-24 bg-[#522912] border-2 border-[#2b1307] rounded-t-lg shadow-xl overflow-hidden hidden sm:block">
                <div className="w-full h-2 bg-[#2b1307] mt-3" />
                <div className="w-full h-2 bg-[#2b1307] mt-8" />
              </div>
            </div>

            {/* FORGING STEP 1: MELT & BELLOWS CONTROL */}
            {forgeStep === 'MELT' && (
              <div className="w-full max-w-md bg-[#24130b]/95 border-2 border-amber-600 rounded-xl p-3 shadow-2xl mt-2 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-amber-300">
                  步驟一：風箱加熱控溫 (Melt Crucible)
                </span>
                <p className="text-[11px] text-stone-300 text-center">
                  點擊拉動風箱將爐溫推升至最佳區間 (800°C - 1150°C)！
                </p>

                {/* Heat Gauge */}
                <div className="w-full flex items-center gap-2">
                  <span className="text-[10px] text-stone-400">200°C</span>
                  <div className="relative flex-1 h-4 bg-stone-900 rounded-full border border-stone-600 overflow-hidden">
                    {/* Optimal Range Highlight */}
                    <div className="absolute left-[45%] right-[20%] top-0 bottom-0 bg-emerald-500/30 border-x border-emerald-400" />
                    <div
                      className={`h-full transition-all duration-100 ${
                        isHeatOptimal ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(100, (crucibleHeat / 1200) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono-num font-bold text-amber-300">
                    {crucibleHeat}°C
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={handlePumpBellows}
                    className="wood-button px-4 py-1.5 rounded-lg text-amber-100 font-bold text-xs active:scale-95 transition"
                  >
                    💨 鼓動風箱加熱！
                  </button>

                  <button
                    onClick={handleProceedToHammer}
                    disabled={!isHeatOptimal}
                    className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${
                      isHeatOptimal
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg animate-bounce'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    開始上砧錘打 ➜
                  </button>
                </div>
              </div>
            )}

            {/* FORGING STEP 2: HAMMER QTE RHYTHM BAR (Exact match to Image 1) */}
            {forgeStep === 'HAMMER_QTE' && (
              <div className="w-full mt-1">
                <QteBar
                  onHit={handleQteHit}
                  hitsRemaining={qteHitsRemaining}
                  totalHits={4}
                  perfectWidthPercent={perfectWidth}
                  greatWidthPercent={greatWidth}
                  speedMultiplier={1.0 - (upgrades.skillHaste * 0.08)}
                />
              </div>
            )}

            {/* FORGING STEP 3: QUENCH & ASSEMBLE MODULE */}
            {forgeStep === 'QUENCH_ASSEMBLE' && (
              <div className="w-full max-w-lg bg-[#24130b]/95 border-2 border-amber-600 rounded-xl p-3 shadow-2xl mt-2 flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-amber-800/80 pb-1">
                  <span className="text-xs font-bold text-amber-300">
                    步驟三：淬火冷卻與附加組件 (Quench & Assembly)
                  </span>
                  <span className="text-[10px] text-emerald-400">錘打完成！</span>
                </div>

                {/* Coolant Selection */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-stone-300">
                    選擇淬火冷卻液 (搭配當前世界可獲額外加成):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {COOLANTS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCoolant(c.id)}
                        className={`p-2 rounded-lg border text-left transition flex flex-col justify-between ${
                          selectedCoolant === c.id
                            ? 'bg-amber-900/90 border-amber-400 text-amber-100 shadow'
                            : 'bg-stone-900/80 border-stone-700 text-stone-300 hover:border-amber-600'
                        }`}
                      >
                        <span className="text-xs font-bold">{c.nameZh.split(' ')[0]}</span>
                        <span className="text-[10px] text-amber-400/90 leading-tight mt-0.5">{c.world}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module Selection */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-stone-300">
                    安裝組件插槽 (Module Sockets):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {MODULES.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModule(m.id)}
                        className={`p-1.5 rounded-lg border text-left transition flex items-center justify-between ${
                          selectedModule === m.id
                            ? 'bg-amber-900/90 border-amber-400 text-amber-100 shadow'
                            : 'bg-stone-900/80 border-stone-700 text-stone-300 hover:border-amber-600'
                        }`}
                      >
                        <span className="text-xs font-bold">{m.nameZh}</span>
                        <span className="text-[9px] text-amber-400 font-mono-num">{m.world}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finalize Button */}
                <button
                  onClick={handleFinalQuench}
                  disabled={!selectedCoolant}
                  className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition ${
                    selectedCoolant
                      ? 'wood-button text-amber-100 shadow-lg'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={14} className="text-amber-300" />
                  完成冷卻並交付顧客！(Deliver Weapon)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: Multiverse World Portal (Exact match to Image 1) --- */}
        <div className="relative z-20 w-64 sm:w-72 md:w-80 p-3 flex flex-col items-center justify-between pointer-events-auto">
          {/* Autonomous Sentry Golem (Unlocked via Defense Upgrades) */}
          {(upgrades.sentryGolemLevel || 0) > 0 && (
            <div className="absolute -top-10 -left-6 z-30 flex items-center gap-2 animate-float">
              <div className="w-11 h-11 rounded-2xl bg-indigo-950 border-2 border-indigo-400 shadow-[0_0_15px_#818cf8] flex items-center justify-center text-xl relative group">
                <span>🤖</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute -top-1 -right-1 animate-ping" />
              </div>
              <div className="bg-[#1b0d06]/90 border border-indigo-500/80 rounded-lg px-2 py-0.5 text-[9px] text-indigo-200 font-bold shadow">
                秘法守衛 Lv{upgrades.sentryGolemLevel} (巡邏中)
              </div>
            </div>
          )}

          {/* World Portal Archway */}
          <div className="relative flex flex-col items-center w-full">
            {/* Label from Image 1: "World Portal" */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1">
              <span>World Portal</span>
              <span className="text-stone-400">➜</span>
              {(upgrades.portalStabilizerLevel || 0) > 0 && (
                <span className="text-[9px] bg-cyan-950 border border-cyan-400 text-cyan-300 px-1.5 py-0.2 rounded-full font-bold ml-1">
                  ✨ 穩定儀 Lv{upgrades.portalStabilizerLevel}
                </span>
              )}
            </div>

            {/* Circular Glowing Portal Gate */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-[#52331c] shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center overflow-hidden bg-stone-950">
              {/* Portal Stabilizer Concentric Energy Rings */}
              {(upgrades.portalStabilizerLevel || 0) > 0 && (
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300/60 animate-spin pointer-events-none z-20" />
              )}

              {/* Swirling Portal Vortex */}
              <div
                className={`absolute inset-1 rounded-full animate-portal opacity-80 ${
                  activeWorld === 'SCIFI'
                    ? 'bg-[conic-gradient(from_0deg,#06b6d4,#3b82f6,#8b5cf6,#06b6d4)]'
                    : activeWorld === 'FANTASY'
                    ? 'bg-[conic-gradient(from_0deg,#10b981,#3b82f6,#a855f7,#10b981)]'
                    : 'bg-[conic-gradient(from_0deg,#f59e0b,#ef4444,#78350f,#f59e0b)]'
                }`}
              />

              {/* Inner Portal World Horizon View */}
              <div className="relative z-10 w-36 h-36 md:w-44 md:h-44 rounded-full bg-stone-950 border-2 border-cyan-400/80 overflow-hidden flex flex-col items-center justify-center text-center p-2 shadow-inner">
                {activeWorld === 'SCIFI' ? (
                  <div className="flex flex-col items-center">
                    {/* Cyber City Skyscrapers */}
                    <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                      <rect x="5" y="10" width="12" height="30" fill="#0891b2" />
                      <rect x="22" y="4" width="16" height="36" fill="#0284c7" />
                      <rect x="42" y="14" width="14" height="26" fill="#0369a1" />
                      <line x1="10" y1="12" x2="10" y2="35" stroke="#67e8f9" strokeWidth="1" strokeDasharray="2 2" />
                      <line x1="30" y1="8" x2="30" y2="35" stroke="#67e8f9" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                    <span className="text-xs font-bold text-cyan-300 mt-1">Sci-Fi World</span>
                    <span className="text-[10px] text-cyan-200/70">賽博新都</span>
                  </div>
                ) : activeWorld === 'FANTASY' ? (
                  <div className="flex flex-col items-center">
                    {/* Fantasy Castle Towers */}
                    <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                      <polygon points="12,12 8,20 16,20" fill="#059669" />
                      <rect x="8" y="20" width="8" height="20" fill="#10b981" />
                      <polygon points="30,4 24,14 36,14" fill="#059669" />
                      <rect x="24" y="14" width="12" height="26" fill="#10b981" />
                      <polygon points="48,12 44,20 52,20" fill="#059669" />
                      <rect x="44" y="20" width="8" height="20" fill="#10b981" />
                    </svg>
                    <span className="text-xs font-bold text-emerald-300 mt-1">Fantasy World</span>
                    <span className="text-[10px] text-emerald-200/70">精靈秘境森林</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Steampunk Wasteland gears */}
                    <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                      <circle cx="20" cy="20" r="12" fill="#d97706" />
                      <circle cx="40" cy="22" r="10" fill="#b45309" />
                      <line x1="5" y1="36" x2="55" y2="36" stroke="#78350f" strokeWidth="3" />
                    </svg>
                    <span className="text-xs font-bold text-amber-300 mt-1">Steampunk World</span>
                    <span className="text-[10px] text-amber-200/70">廢土蒸氣工坊</span>
                  </div>
                )}
              </div>
            </div>

            {/* Toggle Portal Button (Matches Image 1) */}
            <button
              onClick={() => {
                sound.playPortalSwitch();
                onToggleWorld();
              }}
              className="mt-3 wood-button px-4 py-2 rounded-xl text-amber-100 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition"
            >
              <RefreshCw size={14} className="text-amber-300" />
              切換傳送世界 (Toggle Portal)
            </button>
          </div>

          {/* Quick World Lore Pill */}
          <div className="bg-[#211109]/90 border border-amber-900/60 rounded-xl p-2.5 text-[11px] text-stone-300 text-center w-full shadow">
            {activeWorld === 'SCIFI' && '🚀 科幻世界：偏好超導電漿刃、伺服馬達、液態氮極速淬火。'}
            {activeWorld === 'FANTASY' && '🧙 奇幻世界：偏好星金秘銀、魔力晶石、大教堂聖水淬火。'}
            {activeWorld === 'STEAMPUNK' && '⚙️ 廢土蒸氣：偏好廢鋼裝甲、精工齒輪組、重型機油淬火。'}
          </div>
        </div>

        {/* --- RECON PATROL DRONE INTRUDER ALARM BANNER --- */}
        {reconDroneAlert?.active && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 border-2 border-yellow-300 text-white font-black text-xs md:text-sm px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.9)] flex items-center gap-2 animate-bounce select-none pointer-events-none">
            <span className="w-5 h-5 rounded-full bg-white text-red-600 flex items-center justify-center font-black text-xs">!</span>
            <span>{reconDroneAlert.message}</span>
          </div>
        )}

        {/* --- EXTREME MODE FORGE COMPLETION CELEBRATION TOAST --- */}
        {extremeRewardNotice && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 border-2 border-yellow-200 text-stone-950 font-black text-xs md:text-sm px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.9)] flex items-center gap-2 animate-bounce select-none pointer-events-none">
            <span className="text-xl">🏆</span>
            <span>
              【極限鐵匠完成】榮獲 2 倍聲譽 (+{extremeRewardNotice.rep} ★) 與專屬【宗師勳章】x{extremeRewardNotice.medallions}！
            </span>
          </div>
        )}

        {/* --- AUTONOMOUS RECON PATROL DRONE (Airborne Security) --- */}
        {(engineering?.reconDroneLevel || 0) > 0 && (
          <div 
            className="absolute left-[16%] md:left-[19%] top-[22%] md:top-[25%] z-30 pointer-events-auto flex flex-col items-center animate-float group cursor-pointer"
            onClick={onOpenUpgrades}
            title="自動巡邏偵察機：點擊進入工藝研發"
          >
            {/* Sweeping Conical Radar Spotlight Beam */}
            <div className="absolute top-7 w-48 h-64 pointer-events-none overflow-hidden flex justify-center">
              <div 
                className={`w-full h-full [clip-path:polygon(50%_0%,0%_100%,100%_100%)] opacity-30 transition-colors duration-300 ${
                  thieves.some((t) => t.isRevealed) || reconDroneAlert?.active
                    ? 'bg-gradient-to-b from-red-500/70 via-amber-500/35 to-transparent animate-pulse'
                    : 'bg-gradient-to-b from-cyan-400/50 via-cyan-500/20 to-transparent'
                }`}
              />
            </div>

            {/* Drone Chassis with Dual Rotors & Scanning Core */}
            <div className="relative w-16 h-12 flex items-center justify-center">
              {/* Spinning Dual Rotors */}
              <div className="absolute -top-1 -left-2 w-7 h-1.5 bg-stone-400 rounded-full animate-spin opacity-80" />
              <div className="absolute -top-1 -right-2 w-7 h-1.5 bg-stone-400 rounded-full animate-spin opacity-80" />

              {/* High-tech Chassis */}
              <div className={`w-12 h-8 rounded-xl border-2 flex items-center justify-center shadow-lg transition-colors ${
                thieves.some((t) => t.isRevealed) || reconDroneAlert?.active
                  ? 'bg-red-950 border-red-500 shadow-[0_0_15px_#ef4444]'
                  : 'bg-cyan-950 border-cyan-400 shadow-[0_0_15px_#06b6d4]'
              }`}>
                {/* Core Glowing Eye Scanner */}
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  thieves.some((t) => t.isRevealed) || reconDroneAlert?.active
                    ? 'bg-red-500 border-yellow-300 animate-ping'
                    : 'bg-cyan-400 border-white'
                }`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>

              {/* Status LED */}
              <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-pulse" />
            </div>

            {/* Drone Info Pill */}
            <div className="mt-1 bg-stone-950/90 border border-cyan-500/70 rounded-full px-2 py-0.5 text-[9px] font-bold text-cyan-200 flex items-center gap-1 shadow whitespace-nowrap">
              <span>🛸 偵察機 Lv{engineering?.reconDroneLevel}</span>
              {(engineering?.reconDroneLevel || 0) >= 2 && (
                <span className="text-[8px] bg-cyan-900 text-cyan-300 px-1 rounded">破隱</span>
              )}
            </div>
          </div>
        )}

        {/* --- STATIC ENTRANCE TRAP DEFENSE SYSTEM --- */}
        <EntranceTrapView
          traps={traps}
          trapUpgradeLevel={upgrades.trapLevel}
          engineering={engineering}
          autoReloadNotice={autoReloadNotice}
          onSelectTrapType={onSelectTrapType}
          onManualRearm={onManualRearm}
          onOpenUpgrades={onOpenUpgrades}
        />

        {/* --- DYNAMIC THIEVES SNEAKING IN (Matches Image 1) --- */}
        {thieves.map((thief) => (
          <ThiefCharacter
            key={thief.id}
            thief={thief}
            onWhack={onWhackThief}
            onThrowHammer={onThrowHammer}
          />
        ))}

        {/* --- FLYING SPECIAL LOOT DROP EFFECT (擊敗盜賊稀有合成素材掉落提示) --- */}
        {flyingLoots.map((loot) => (
          <div
            key={loot.id}
            className="absolute z-50 pointer-events-none animate-fly-loot flex flex-col items-center select-none"
            style={{
              left: `${loot.startX}%`,
              bottom: `${loot.startY}%`,
            }}
          >
            <div
              className={`px-3 py-1.5 rounded-full border-2 shadow-2xl flex items-center gap-2 backdrop-blur-md ${
                loot.world === 'FANTASY'
                  ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 border-purple-400 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.9)]'
                  : loot.world === 'SCIFI'
                  ? 'bg-gradient-to-r from-cyan-900 via-blue-900 to-cyan-950 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.9)]'
                  : 'bg-gradient-to-r from-amber-900 via-yellow-900 to-amber-950 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.9)]'
              }`}
            >
              <span className="text-xl animate-bounce">{loot.icon}</span>
              <div className="flex flex-col text-left leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-white">+{loot.count} {loot.materialNameZh}</span>
                  <span className="text-[10px] bg-yellow-400 text-stone-950 font-black px-1.5 py-0.2 rounded-full">
                    稀有掉落!
                  </span>
                </div>
                <span className="text-[9px] text-amber-200/90 font-mono mt-0.5">
                  已自動存入倉庫背包
                </span>
              </div>
            </div>
            <div className="bg-stone-950/80 border border-stone-600/80 text-[9px] font-bold text-stone-300 px-2 py-0.5 rounded-md mt-1 shadow">
              擊敗 {loot.thiefNameZh} 獲得
            </div>
          </div>
        ))}
      </main>

      {/* 3. BOTTOM NAVIGATION BAR (Matches Image 1 bottom buttons) */}
      <footer className="relative z-40 w-full bg-[#1e0f07] border-t-2 border-[#542d14] px-4 py-2 flex items-center justify-center flex-wrap gap-2 md:gap-4 shadow-2xl">
        <button
          onClick={onOpenUpgrades}
          className="wood-button px-4 sm:px-5 py-2 rounded-xl text-amber-100 font-bold text-xs md:text-sm tracking-wide shadow"
        >
          設施升級 (Upgrades)
        </button>

        <button
          onClick={onOpenRankModal}
          className="wood-button px-4 sm:px-5 py-2 rounded-xl text-amber-100 font-bold text-xs md:text-sm tracking-wide shadow flex items-center gap-1.5"
          title="查看萬界鐵匠公會職堦晉升與神匠特權"
        >
          <span>{currentRank.badgeIcon}</span>
          <span>職堦成就 (Rank)</span>
        </button>

        <button
          onClick={onOpenWarehouse}
          className="wood-button px-4 sm:px-5 py-2 rounded-xl text-amber-100 font-bold text-xs md:text-sm tracking-wide shadow"
        >
          材料倉庫 (Warehouse)
        </button>

        <button
          onClick={onOpenShop}
          className="wood-button px-4 sm:px-5 py-2 rounded-xl text-amber-100 font-bold text-xs md:text-sm tracking-wide shadow"
        >
          商人補貨 (Shop)
        </button>

        <button
          onClick={onOpenAchievements}
          className="wood-button px-4 sm:px-5 py-2 rounded-xl text-amber-100 font-bold text-xs md:text-sm tracking-wide shadow flex items-center gap-1.5"
          title="查看萬界長期成就與解鎖專屬鐵匠稱號"
        >
          <span>🏆</span>
          <span>成就榮譽 (Achievements)</span>
        </button>

        <button
          onClick={onOpenQuests}
          className="wood-button px-4 sm:px-5 py-2 rounded-xl text-amber-100 font-bold text-xs md:text-sm tracking-wide shadow"
        >
          萬界委託 (Quests)
        </button>

        <button
          onClick={onOpenReference}
          className="wood-button px-4 sm:px-5 py-2 rounded-xl text-amber-100 font-bold text-xs md:text-sm tracking-wide shadow"
        >
          企劃圖庫 (Settings & Docs)
        </button>
      </footer>

      {/* --- NEW ACHIEVEMENT UNLOCKED NOTIFICATION TOAST --- */}
      {newAchievementAlert && (
        <div
          onClick={onOpenAchievements}
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-2 border-yellow-200 text-stone-950 font-black px-4 py-2.5 rounded-xl shadow-[0_0_30px_rgba(250,204,21,0.9)] flex items-center gap-3 animate-bounce pointer-events-auto cursor-pointer"
          title="點擊開啟成就殿堂檢視"
        >
          <Trophy size={24} className="text-stone-950 animate-spin" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] tracking-wider uppercase font-black text-amber-950">
              🎉 萬界長期成就達成 · 榮耀解鎖！
            </span>
            <div className="text-xs sm:text-sm font-black flex items-center gap-1.5 flex-wrap">
              <span className="text-base">{newAchievementAlert.achievement.badgeIcon}</span>
              <span>{newAchievementAlert.achievement.titleZh}</span>
              <span className="bg-stone-950/80 text-yellow-300 px-2 py-0.5 rounded text-[11px] font-bold">
                解鎖稱號：{newAchievementAlert.achievement.unlockedTitleZh}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- TRAP CHAIN REACTION NOTIFICATION TOAST --- */}
      {chainReactionAlert && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 border-2 border-yellow-200 text-stone-950 font-black px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.9)] flex items-center gap-2 animate-bounce pointer-events-none">
          <Zap size={18} className="text-stone-950 animate-spin" />
          <span className="text-xs md:text-sm">
            ⚡【陷阱連鎖啟動】相鄰武裝陷阱共振觸發！造成衝擊波並重創擊退盜賊！({chainReactionAlert.count} 個陷阱連攜)
          </span>
        </div>
      )}

      {/* --- BLACKSMITH RANK UP CELEBRATORY OVERLAY --- */}
      {rankUpAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto animate-fadeIn">
          <div className="w-full max-w-md bg-gradient-to-b from-[#2e190e] via-[#1a0e08] to-[#120803] border-4 border-amber-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.6)] flex flex-col items-center text-center gap-3 animate-bounce">
            <span className="text-5xl animate-pulse">{rankUpAlert.newRank.badgeIcon}</span>
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest font-black text-amber-400">
                🎉 萬界鐵匠公會授勳晉階 🎉
              </span>
              <h2 className="text-2xl font-black text-yellow-300 font-display mt-1">
                {rankUpAlert.newRank.titleZh}
              </h2>
              <span className="text-xs text-amber-200 mt-1">
                恭喜晉升為 Lv.{rankUpAlert.newRank.level}！解鎖全套職堦專屬神匠特權！
              </span>
            </div>

            <div className="w-full bg-[#120803]/80 border border-amber-700/60 rounded-xl p-3 text-left flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-amber-300">✦ 新解鎖職堦專屬特權：</span>
              {rankUpAlert.newRank.perksZh.map((perk, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-stone-200">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenRankModal}
              className="wood-button w-full py-2.5 rounded-xl text-amber-100 font-bold text-sm tracking-wide mt-2"
            >
              開啟職堦聖殿 (View Details)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
