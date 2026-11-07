/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaterialItem, FacilityUpgrades, FusionRecipe, TrapEngineering } from '../types/game';
import { MaterialIcon } from './MaterialIcon';
import { FUSION_RECIPES } from '../data/gameData';
import { TrapEngineeringTab } from './TrapEngineeringTab';
import { sound } from '../audio/soundManager';
import { X, ShieldAlert, Sparkles, CheckCircle, ArrowRight, Wrench, Flame } from 'lucide-react';

interface UpgradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  gold: number;
  reputation: number;
  materials: MaterialItem[];
  upgrades: FacilityUpgrades;
  engineering: TrapEngineering;
  onUpgradeFacility: (key: keyof FacilityUpgrades, cost: number) => void;
  onUpgradeEngineering: (field: keyof TrapEngineering, cost: number) => void;
  onUnlockTrapType: (type: 'asphalt' | 'tesla' | 'cryo' | 'vortex', cost: number) => void;
  onUpdateMaterialCount: (id: string, delta: number) => void;
  onMeltDownMaterial: (id: string) => void;
  onFuseMaterials: (recipe: FusionRecipe) => void;
}

export const UpgradesModal: React.FC<UpgradesModalProps> = ({
  isOpen,
  onClose,
  day,
  gold,
  reputation,
  materials,
  upgrades,
  engineering,
  onUpgradeFacility,
  onUpgradeEngineering,
  onUnlockTrapType,
  onUpdateMaterialCount,
  onMeltDownMaterial,
  onFuseMaterials,
}) => {
  // Modal Top Tabs: 'facilities' (original Image 2) vs 'trap_crafting' (newly requested)
  const [modalTab, setModalTab] = useState<'facilities' | 'trap_crafting'>('facilities');

  // Fusion Mixer Slots
  const [slotA, setSlotA] = useState<MaterialItem | null>(null);
  const [slotB, setSlotB] = useState<MaterialItem | null>(null);
  const [fuseSuccessMessage, setFuseSuccessMessage] = useState<string | null>(null);

  // Security Tooltip hover/active state (matches Image 2)
  const [showSecurityTooltip, setShowSecurityTooltip] = useState<boolean>(true);

  if (!isOpen) return null;

  // Find matching recipe for the 2 slots
  const matchedRecipe = FUSION_RECIPES.find(
    (r) =>
      slotA &&
      slotB &&
      ((r.inputA === slotA.id && r.inputB === slotB.id) ||
        (r.inputA === slotB.id && r.inputB === slotA.id))
  );

  const handleFuse = () => {
    if (!matchedRecipe || !slotA || !slotB) return;
    if (slotA.count < 1 || slotB.count < 1) return;

    sound.playHammerHit('PERFECT');
    sound.playCoins();
    onFuseMaterials(matchedRecipe);
    setFuseSuccessMessage(`融合成功！獲得「${matchedRecipe.nameZh}」！`);

    // Reset slots
    setSlotA(null);
    setSlotB(null);

    setTimeout(() => {
      setFuseSuccessMessage(null);
    }, 3000);
  };

  const handleSelectForMixer = (mat: MaterialItem) => {
    if (mat.count <= 0) return;
    if (!slotA) {
      setSlotA(mat);
    } else if (!slotB && slotA.id !== mat.id) {
      setSlotB(mat);
    } else {
      // replace slot A
      setSlotA(mat);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none overflow-y-auto">
      {/* The Master Wooden-Trim Modal Container from Image 2 */}
      <div className="relative w-full max-w-5xl bg-[#26150b] border-4 border-[#7a421e] rounded-2xl shadow-2xl p-4 md:p-6 text-stone-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Top Header Section */}
        <div className="flex items-center justify-between border-b-2 border-[#572e14] pb-3">
          {/* Multiverse Forge Logo Banner */}
          <div className="flex items-center gap-3">
            <div className="bg-[#412110] border-2 border-[#945124] px-4 py-1.5 rounded-xl shadow-md">
              <h2 className="font-display font-black text-amber-300 text-xl tracking-wider uppercase">
                MULTIVERSE FORGE
              </h2>
            </div>
            <span className="text-xs text-amber-400/80 font-bold hidden sm:inline">
              設施技能升級與材料融合
            </span>
          </div>

          {/* Day / Gold / Reputation HUD from Image 2 */}
          <div className="flex items-center gap-3">
            <div className="bg-[#1b0d06] border-2 border-[#542d14] rounded-xl px-3 py-1.5 flex items-center gap-3 text-xs font-bold">
              <span className="text-amber-200">
                Day {day} <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block ml-0.5" />
              </span>
              <span className="text-yellow-300">
                Gold: {gold.toLocaleString()}
              </span>
              <span className="text-amber-300">
                Reputation: {reputation} Stars
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-900 border border-amber-800 text-amber-300 hover:bg-stone-800 hover:text-white transition"
              title="關閉面板"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sub-navigation Tab Switcher */}
        <div className="flex items-center gap-2 border-b-2 border-[#542d14] pb-2">
          <button
            onClick={() => {
              sound.playCoins();
              setModalTab('facilities');
            }}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
              modalTab === 'facilities'
                ? 'wood-button text-amber-100 shadow-md'
                : 'bg-[#1e0f07] border border-amber-900 text-stone-400 hover:text-amber-200'
            }`}
          >
            <Flame size={16} className="text-amber-400" />
            設施升級與材料融合 (Facilities & Fusion)
          </button>

          <button
            onClick={() => {
              sound.playCoins();
              setModalTab('trap_crafting');
            }}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition relative ${
              modalTab === 'trap_crafting'
                ? 'wood-button text-amber-100 shadow-md'
                : 'bg-[#1e0f07] border border-amber-900 text-stone-400 hover:text-amber-200'
            }`}
          >
            <Wrench size={16} className="text-amber-400" />
            <span>🛠️ 陷阱工藝研發 (Trap Crafting)</span>
            <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shadow">
              NEW
            </span>
          </button>
        </div>

        {/* --- MAIN TAB CONTENT --- */}
        {modalTab === 'facilities' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* === LEFT CARD: MATERIALS MANAGEMENT & FUSION === */}
            <div className="forge-panel p-4 flex flex-col gap-4">
              <div className="border-b border-amber-900/80 pb-1.5 flex items-center justify-between">
                <h3 className="font-bold text-amber-300 text-sm uppercase tracking-wider">
                  MATERIALS MANAGEMENT & FUSION
                </h3>
                <span className="text-[10px] text-amber-400">點擊材料放入融合槽</span>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Materials Grid (2 columns on left side of left card) */}
              <div className="md:col-span-2 grid grid-cols-3 gap-2 max-h-88 overflow-y-auto pr-1">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => handleSelectForMixer(mat)}
                    className="forge-panel-inner p-2 flex flex-col items-center justify-between relative hover:border-amber-400 transition cursor-pointer group"
                  >
                    <MaterialIcon icon={mat.icon} size={38} />
                    <span className="text-[11px] font-bold text-amber-100 text-center truncate w-full mt-1">
                      {mat.nameZh.split(' ')[0]}
                    </span>

                    {/* Count + - controls from Image 2 */}
                    <div className="flex items-center gap-1.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onUpdateMaterialCount(mat.id, -1)}
                        disabled={mat.count <= 0}
                        className="w-4 h-4 bg-[#412110] border border-amber-700 text-amber-300 rounded text-[10px] flex items-center justify-center hover:bg-amber-800 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="font-mono-num text-xs font-bold text-amber-300 min-w-4 text-center">
                        {mat.count}
                      </span>
                      <button
                        onClick={() => onUpdateMaterialCount(mat.id, 1)}
                        className="w-4 h-4 bg-[#412110] border border-amber-700 text-amber-300 rounded text-[10px] flex items-center justify-center hover:bg-amber-800"
                      >
                        +
                      </button>
                    </div>

                    {/* Melt Down Button from Image 2 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMeltDownMaterial(mat.id);
                      }}
                      disabled={mat.count <= 0}
                      className="w-full text-[9px] font-bold py-0.5 rounded bg-amber-950/80 border border-amber-700/80 text-amber-200 hover:bg-amber-900 transition disabled:opacity-40"
                    >
                      Melt Down
                    </button>
                  </div>
                ))}
              </div>

              {/* Fusion Mixer Section (Right side of left card - exact match to Image 2) */}
              <div className="forge-panel-inner p-3 flex flex-col items-center justify-between">
                <span className="text-xs font-bold text-amber-300 mb-2">
                  Fusion Mixer
                </span>

                {/* 2 Input Slots */}
                <div className="flex items-center gap-2 mb-2">
                  {/* Slot A */}
                  <div
                    onClick={() => setSlotA(null)}
                    className="w-14 h-14 bg-stone-950/90 border-2 border-dashed border-amber-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 relative"
                    title="點擊清除 Slot A"
                  >
                    {slotA ? (
                      <>
                        <MaterialIcon icon={slotA.icon} size={28} />
                        <span className="text-[9px] text-amber-300 truncate max-w-12">
                          {slotA.nameZh.split(' ')[0]}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-stone-500">材料 A</span>
                    )}
                  </div>

                  <span className="text-amber-500 font-black">+</span>

                  {/* Slot B */}
                  <div
                    onClick={() => setSlotB(null)}
                    className="w-14 h-14 bg-stone-950/90 border-2 border-dashed border-amber-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 relative"
                    title="點擊清除 Slot B"
                  >
                    {slotB ? (
                      <>
                        <MaterialIcon icon={slotB.icon} size={28} />
                        <span className="text-[9px] text-amber-300 truncate max-w-12">
                          {slotB.nameZh.split(' ')[0]}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-stone-500">材料 B</span>
                    )}
                  </div>
                </div>

                {/* Fuse Button from Image 2 */}
                <button
                  onClick={handleFuse}
                  disabled={!matchedRecipe}
                  className={`w-full py-2 rounded-xl font-bold text-xs shadow-md transition ${
                    matchedRecipe
                      ? 'wood-button text-amber-100 hover:scale-105 active:scale-95'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  ✨ Fuse (融合)
                </button>

                {/* Downward Arrow */}
                <div className="text-amber-500 my-1 text-base">▼</div>

                {/* Output Result Slot */}
                <div className="w-16 h-16 bg-stone-950/90 border-2 border-amber-500 rounded-xl flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  {matchedRecipe ? (
                    <div className="flex flex-col items-center">
                      <Sparkles size={20} className="text-cyan-300 animate-spin" />
                      <span className="text-[9px] font-bold text-cyan-200 mt-1 leading-tight">
                        {matchedRecipe.nameZh}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-stone-600">產出神品</span>
                  )}
                </div>

                {fuseSuccessMessage && (
                  <p className="text-[10px] text-emerald-400 font-bold text-center mt-2 animate-bounce">
                    {fuseSuccessMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* === RIGHT CARD: FACILITY & SKILLS UPGRADES === */}
          <div className="forge-panel p-4 flex flex-col gap-4">
            <div className="border-b border-amber-900/80 pb-1.5 flex items-center justify-between">
              <h3 className="font-bold text-amber-300 text-sm uppercase tracking-wider">
                FACILITY & SKILLS UPGRADES
              </h3>
              <span className="text-[10px] text-stone-400">消耗金幣提升設備等級</span>
            </div>

            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-1">
              {/* Category 1: FORGE */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-amber-900/40 pb-1">
                  <span>🔨 FORGE (鍛造設施)</span>
                </div>

                {/* Furnace Upgrade */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-orange-950 border border-orange-600 flex items-center justify-center text-orange-400 text-lg">
                      🔥
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                        <span>Furnace (熔爐)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.furnaceLevel} ➔ Lv {Math.min(4, upgrades.furnaceLevel + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {upgrades.furnaceLevel >= 4 ? '已達滿級 (最高熔煉速度)' : '提升加熱速度，解鎖跨界合金融煉 (Multi-World)'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpgradeFacility('furnaceLevel', 200)}
                    disabled={upgrades.furnaceLevel >= 4 || gold < 200}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {upgrades.furnaceLevel >= 4 ? 'MAX' : 'Gold 200'}
                  </button>
                </div>

                {/* Anvil Upgrade */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-600 flex items-center justify-center text-slate-300 text-lg">
                      ⚙️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                        <span>Anvil (重型鐵砧)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.anvilLevel} ➔ Lv {Math.min(4, upgrades.anvilLevel + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {upgrades.anvilLevel >= 4 ? '已達滿級' : '擴大 QTE Great / Perfect 完美判定區間'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpgradeFacility('anvilLevel', 150)}
                    disabled={upgrades.anvilLevel >= 4 || gold < 150}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {upgrades.anvilLevel >= 4 ? 'MAX' : 'Gold 150'}
                  </button>
                </div>

                {/* *NEW* Master Bellows Upgrade */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-orange-950 border border-orange-500 flex items-center justify-center text-orange-300 text-lg">
                      💨
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                        <span className="text-amber-400 font-extrabold">*NEW*</span>
                        <span>Master Bellows (泰坦高壓風箱)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.bellowsPowerLevel || 0} ➔ Lv {Math.min(3, (upgrades.bellowsPowerLevel || 0) + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {(upgrades.bellowsPowerLevel || 0) === 0 && '拉風箱加熱效率 +35%，大幅縮短高溫熔煉時間'}
                        {(upgrades.bellowsPowerLevel || 0) === 1 && '加裝石棉隔熱內膽，熔爐降溫衰減減緩 50%'}
                        {(upgrades.bellowsPowerLevel || 0) === 2 && '雙動氣缸增壓，單次抽氣直達理想鍛造溫度'}
                        {(upgrades.bellowsPowerLevel || 0) >= 3 && '已達極致神級風箱，熔爐永保頂級恆溫'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const cur = upgrades.bellowsPowerLevel || 0;
                      const cost = cur === 0 ? 130 : cur === 1 ? 190 : 270;
                      onUpgradeFacility('bellowsPowerLevel', cost);
                    }}
                    disabled={(upgrades.bellowsPowerLevel || 0) >= 3 || gold < ((upgrades.bellowsPowerLevel || 0) === 0 ? 130 : (upgrades.bellowsPowerLevel || 0) === 1 ? 190 : 270)}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {(upgrades.bellowsPowerLevel || 0) >= 3 ? 'MAX' : `Gold ${(upgrades.bellowsPowerLevel || 0) === 0 ? 130 : (upgrades.bellowsPowerLevel || 0) === 1 ? 190 : 270}`}
                  </button>
                </div>

                {/* Quench Tank Upgrade */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-600 flex items-center justify-center text-blue-300 text-lg">
                      🪣
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                        <span>Quench Tank (冷卻淬火槽)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.quenchTankLevel} ➔ Lv {Math.min(3, upgrades.quenchTankLevel + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {upgrades.quenchTankLevel >= 3 ? '滿級淬火槽：冷卻時間 -60%' : 'Reduce Quench Time，大幅提升冷卻完成評分'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpgradeFacility('quenchTankLevel', 120)}
                    disabled={upgrades.quenchTankLevel >= 3 || gold < 120}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {upgrades.quenchTankLevel >= 3 ? 'MAX' : 'Gold 120'}
                  </button>
                </div>
              </div>

              {/* Category 2: DEFENSE & SECURITY */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 border-b border-cyan-900/40 pb-1">
                  <span>🛡️ DEFENSE & SECURITY (防衛與警備)</span>
                </div>

                {/* Anti-Theft Scan (Exact highlight from Image 2) */}
                <div className="relative">
                  <div className="forge-panel-inner p-2.5 border-2 border-cyan-500/80 bg-cyan-950/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-300">
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
                          <span className="text-amber-400 font-extrabold">*NEW*</span>
                          <span>Security System (保全掃描)</span>
                          <span className="text-emerald-400 text-[11px]">
                            Lv {upgrades.securityScanLevel} ➔ Lv {Math.min(3, upgrades.securityScanLevel + 1)}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-300">
                          {upgrades.securityScanLevel >= 3 ? '高能防盜電磁防線已啟動' : '自動警報掃描潛入小偷，降低偷竊成功率'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onUpgradeFacility('securityScanLevel', 220)}
                      disabled={upgrades.securityScanLevel >= 3 || gold < 220}
                      className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                    >
                      {upgrades.securityScanLevel >= 3 ? 'MAX' : 'Upgrade 220G'}
                    </button>
                  </div>

                  {/* Tooltip Card Matching the exact Image 2 popup */}
                  {showSecurityTooltip && (
                    <div className="mt-1.5 p-2 bg-[#1b0d06] border-2 border-amber-600 rounded-xl shadow-xl flex items-center gap-3">
                      <div className="flex-1 text-[11px] text-stone-200 leading-tight">
                        <span className="font-bold text-amber-300">Anti-Theft Scan Lv 1 (New):</span>
                        <p className="mt-0.5 text-stone-300">
                          Automatically detects small thieves. Deter success rate +10%. Prevents theft attempts.
                        </p>
                      </div>
                      {/* Goblin Crossed Out Badge (Matches Image 2) */}
                      <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-red-950/80 flex items-center justify-center shrink-0 relative">
                        <span className="text-lg">👺</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-0.5 bg-red-500 rotate-45" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Entrance Trap System Upgrade */}
                <div className="forge-panel-inner p-2.5 border-2 border-amber-500/80 bg-amber-950/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-300 text-lg">
                      🪤
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                        <span className="text-yellow-400 font-extrabold">*NEW*</span>
                        <span>Trap System (玄關機關陷阱)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.trapLevel} ➔ Lv {Math.min(3, upgrades.trapLevel + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {upgrades.trapLevel === 0 && '在店鋪玄關門口部署靜態陷阱，小偷進入時自動造成重創或大幅減速'}
                        {upgrades.trapLevel === 1 && '解鎖第 2 個陷阱槽與電磁停滯力場（減速 65%）'}
                        {upgrades.trapLevel === 2 && '解鎖廢土焦油滑道（使小偷滑倒並強制掉落贓物袋）'}
                        {upgrades.trapLevel >= 3 && '已升級至頂級機關術：自動快速重填冷卻時間 -40%'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const cost = upgrades.trapLevel === 0 ? 140 : upgrades.trapLevel === 1 ? 200 : 280;
                      onUpgradeFacility('trapLevel', cost);
                    }}
                    disabled={
                      upgrades.trapLevel >= 3 ||
                      gold < (upgrades.trapLevel === 0 ? 140 : upgrades.trapLevel === 1 ? 200 : 280)
                    }
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {upgrades.trapLevel >= 3
                      ? 'MAX'
                      : `Gold ${upgrades.trapLevel === 0 ? 140 : upgrades.trapLevel === 1 ? 200 : 280}`}
                  </button>
                </div>

                {/* *NEW* Autonomous Sentry Golem (秘法守護機甲) */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-500 flex items-center justify-center text-indigo-300 text-lg">
                      🤖
                    </div>
                    <div>
                      <div className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                        <span className="text-yellow-400 font-extrabold">*NEW*</span>
                        <span>Sentry Golem (秘法巡邏守衛)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.sentryGolemLevel || 0} ➔ Lv {Math.min(3, (upgrades.sentryGolemLevel || 0) + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {(upgrades.sentryGolemLevel || 0) === 0 && '召喚自動浮游守衛，每隔 5 秒自動射擊小偷造成 1.0 HP 傷害與電擊擊退'}
                        {(upgrades.sentryGolemLevel || 0) === 1 && '高能聚焦水晶：射擊間隔縮短至 3.5 秒，傷害提升至 1.5 HP'}
                        {(upgrades.sentryGolemLevel || 0) === 2 && '重裝奧術脈衝：命中時自動震落小偷剛抓走的商品贓物'}
                        {(upgrades.sentryGolemLevel || 0) >= 3 && '已達滿級：守護神魔像坐鎮，全店自動火力覆蓋'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const cur = upgrades.sentryGolemLevel || 0;
                      const cost = cur === 0 ? 180 : cur === 1 ? 260 : 360;
                      onUpgradeFacility('sentryGolemLevel', cost);
                    }}
                    disabled={(upgrades.sentryGolemLevel || 0) >= 3 || gold < ((upgrades.sentryGolemLevel || 0) === 0 ? 180 : (upgrades.sentryGolemLevel || 0) === 1 ? 260 : 360)}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {(upgrades.sentryGolemLevel || 0) >= 3 ? 'MAX' : `Gold ${(upgrades.sentryGolemLevel || 0) === 0 ? 180 : (upgrades.sentryGolemLevel || 0) === 1 ? 260 : 360}`}
                  </button>
                </div>

                {/* *NEW* Flying Hammer Mastery (飛鎚投擲精通) */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300 text-lg">
                      🔨
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                        <span className="text-yellow-400 font-extrabold">*NEW*</span>
                        <span>Hammer Mastery (飛鎚投擲精通)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.flyingHammerMastery || 0} ➔ Lv {Math.min(3, (upgrades.flyingHammerMastery || 0) + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {(upgrades.flyingHammerMastery || 0) === 0 && '解鎖長距投擲，點擊「投擲飛鎚」直接造成 1.5 HP 傷害'}
                        {(upgrades.flyingHammerMastery || 0) === 1 && '旋轉貫穿：命中必定眩暈小偷 1.5 秒，並提升投擲速度'}
                        {(upgrades.flyingHammerMastery || 0) === 2 && '雷神之怒：傷害提升至 2.5 HP，且命中凍結目標時傷害 2 倍'}
                        {(upgrades.flyingHammerMastery || 0) >= 3 && '已達滿級：飛鎚百發百中，瞬間秒殺普通盜賊'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const cur = upgrades.flyingHammerMastery || 0;
                      const cost = cur === 0 ? 120 : cur === 1 ? 200 : 290;
                      onUpgradeFacility('flyingHammerMastery', cost);
                    }}
                    disabled={(upgrades.flyingHammerMastery || 0) >= 3 || gold < ((upgrades.flyingHammerMastery || 0) === 0 ? 120 : (upgrades.flyingHammerMastery || 0) === 1 ? 200 : 290)}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {(upgrades.flyingHammerMastery || 0) >= 3 ? 'MAX' : `Gold ${(upgrades.flyingHammerMastery || 0) === 0 ? 120 : (upgrades.flyingHammerMastery || 0) === 1 ? 200 : 290}`}
                  </button>
                </div>
              </div>

              {/* Category 3: MANAGEMENT & COMMERCE */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-amber-900/40 pb-1">
                  <span>📦 MANAGEMENT & COMMERCE (店面與商會)</span>
                </div>

                {/* Warehouse Upgrade */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300 text-lg">
                      🏚️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                        <span>Warehouse (倉庫容量)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.warehouseLevel} ➔ Lv {Math.min(3, upgrades.warehouseLevel + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        +50 Capacity，Customer Log (Unlocked)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpgradeFacility('warehouseLevel', 180)}
                    disabled={upgrades.warehouseLevel >= 3 || gold < 180}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {upgrades.warehouseLevel >= 3 ? 'MAX' : 'Gold 180'}
                  </button>
                </div>

                {/* *NEW* Portal Stabilizer Upgrade */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-300 text-lg">
                      🌀
                    </div>
                    <div>
                      <div className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
                        <span className="text-amber-400 font-extrabold">*NEW*</span>
                        <span>Portal Stabilizer (時空門穩定儀)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.portalStabilizerLevel || 0} ➔ Lv {Math.min(3, (upgrades.portalStabilizerLevel || 0) + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {(upgrades.portalStabilizerLevel || 0) === 0 && '穩定次元通道：所有新進顧客初始耐性時間 +25%'}
                        {(upgrades.portalStabilizerLevel || 0) === 1 && '吸引跨界 VIP 貴客：高額賞金訂單出現機率提升 40%'}
                        {(upgrades.portalStabilizerLevel || 0) === 2 && '維度共鳴：訂單完成時獲得雙倍商會聲望星級！'}
                        {(upgrades.portalStabilizerLevel || 0) >= 3 && '已達滿級：時空裂隙完全鎖定，門戶不再產生時空震'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const cur = upgrades.portalStabilizerLevel || 0;
                      const cost = cur === 0 ? 160 : cur === 1 ? 250 : 380;
                      onUpgradeFacility('portalStabilizerLevel', cost);
                    }}
                    disabled={(upgrades.portalStabilizerLevel || 0) >= 3 || gold < ((upgrades.portalStabilizerLevel || 0) === 0 ? 160 : (upgrades.portalStabilizerLevel || 0) === 1 ? 250 : 380)}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {(upgrades.portalStabilizerLevel || 0) >= 3 ? 'MAX' : `Gold ${(upgrades.portalStabilizerLevel || 0) === 0 ? 160 : (upgrades.portalStabilizerLevel || 0) === 1 ? 250 : 380}`}
                  </button>
                </div>

                {/* *NEW* Multiverse Guild Charm (萬界商會徽章) */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-yellow-950 border border-yellow-500 flex items-center justify-center text-yellow-300 text-lg">
                      🪙
                    </div>
                    <div>
                      <div className="text-xs font-bold text-yellow-200 flex items-center gap-1.5">
                        <span className="text-amber-400 font-extrabold">*NEW*</span>
                        <span>Guild Charm (萬界商會徽章)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.guildCharmLevel || 0} ➔ Lv {Math.min(3, (upgrades.guildCharmLevel || 0) + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {(upgrades.guildCharmLevel || 0) === 0 && '每日晨間開鋪獲得商會運營補助 +120 Gold'}
                        {(upgrades.guildCharmLevel || 0) === 1 && '顧客滿意額外小費 +25%，完美品質獎金提高'}
                        {(upgrades.guildCharmLevel || 0) === 2 && '防衛成功榮譽勳章：擊敗小偷額外獎勵 80 Gold 懸賞金'}
                        {(upgrades.guildCharmLevel || 0) >= 3 && '已達滿級：享有商會終身最高榮譽津貼'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const cur = upgrades.guildCharmLevel || 0;
                      const cost = cur === 0 ? 170 : cur === 1 ? 280 : 420;
                      onUpgradeFacility('guildCharmLevel', cost);
                    }}
                    disabled={(upgrades.guildCharmLevel || 0) >= 3 || gold < ((upgrades.guildCharmLevel || 0) === 0 ? 170 : (upgrades.guildCharmLevel || 0) === 1 ? 280 : 420)}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {(upgrades.guildCharmLevel || 0) >= 3 ? 'MAX' : `Gold ${(upgrades.guildCharmLevel || 0) === 0 ? 170 : (upgrades.guildCharmLevel || 0) === 1 ? 280 : 420}`}
                  </button>
                </div>
              </div>

              {/* Category 4: MASTERY SKILLS */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 border-b border-emerald-900/40 pb-1">
                  <span>🗡️ MASTERY SKILLS (匠師專屬技藝)</span>
                </div>

                {/* Precision */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-300 text-lg">
                      🎯
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                        <span>Precision (精準打擊)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.skillPrecision} ➔ Lv {Math.min(3, upgrades.skillPrecision + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        Great Area +10%，打擊累積品質倍率提升
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpgradeFacility('skillPrecision', 100)}
                    disabled={upgrades.skillPrecision >= 3 || gold < 100}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {upgrades.skillPrecision >= 3 ? 'MAX' : 'Gold 100'}
                  </button>
                </div>

                {/* Haste */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300 text-lg">
                      ⏱️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                        <span>Haste (神速熱鍛)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.skillHaste} ➔ Lv {Math.min(3, upgrades.skillHaste + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        -1s Forge Time，顧客耐性流失速度減緩 15%
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpgradeFacility('skillHaste', 50)}
                    disabled={upgrades.skillHaste >= 3 || gold < 50}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {upgrades.skillHaste >= 3 ? 'MAX' : 'Gold 50'}
                  </button>
                </div>

                {/* *NEW* Combo Artisan Upgrade */}
                <div className="forge-panel-inner p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-950 border border-purple-500 flex items-center justify-center text-purple-300 text-lg">
                      ✨
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                        <span className="text-amber-400 font-extrabold">*NEW*</span>
                        <span>Combo Artisan (連擊匠心天賦)</span>
                        <span className="text-emerald-400 text-[11px]">
                          Lv {upgrades.comboArtisanLevel || 0} ➔ Lv {Math.min(3, (upgrades.comboArtisanLevel || 0) + 1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-300">
                        {(upgrades.comboArtisanLevel || 0) === 0 && '敲擊 QTE 達成 2 次連續 Perfect 時，當次打擊分數 1.5 倍並額外獎勵 30 Gold'}
                        {(upgrades.comboArtisanLevel || 0) === 1 && '連擊進入「神匠專注」：指針速度暫時減緩 25%，更容易連擊'}
                        {(upgrades.comboArtisanLevel || 0) === 2 && '連續 3 次 Perfect 時觸發「萬界共振」，成品品質直接評為神品'}
                        {(upgrades.comboArtisanLevel || 0) >= 3 && '已達滿級：極致神匠，連擊百發百中'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const cur = upgrades.comboArtisanLevel || 0;
                      const cost = cur === 0 ? 150 : cur === 1 ? 230 : 350;
                      onUpgradeFacility('comboArtisanLevel', cost);
                    }}
                    disabled={(upgrades.comboArtisanLevel || 0) >= 3 || gold < ((upgrades.comboArtisanLevel || 0) === 0 ? 150 : (upgrades.comboArtisanLevel || 0) === 1 ? 230 : 350)}
                    className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40"
                  >
                    {(upgrades.comboArtisanLevel || 0) >= 3 ? 'MAX' : `Gold ${(upgrades.comboArtisanLevel || 0) === 0 ? 150 : (upgrades.comboArtisanLevel || 0) === 1 ? 230 : 350}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
          <TrapEngineeringTab
            gold={gold}
            engineering={engineering}
            onUpgradeEngineering={onUpgradeEngineering}
            onUnlockTrapType={onUnlockTrapType}
          />
        )}

        {/* --- BOTTOM TAB NAVIGATION BAR FROM IMAGE 2 --- */}
        <div className="flex items-center justify-between border-t-2 border-[#542d14] pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalTab('facilities')}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs shadow transition ${
                modalTab === 'facilities'
                  ? 'wood-button text-amber-100'
                  : 'bg-[#24130b] text-stone-400 hover:text-amber-200 border border-amber-900'
              }`}
            >
              Upgrades (設施升級)
            </button>
            <button
              onClick={() => setModalTab('trap_crafting')}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs shadow transition ${
                modalTab === 'trap_crafting'
                  ? 'wood-button text-amber-100'
                  : 'bg-[#24130b] text-stone-400 hover:text-amber-200 border border-amber-900'
              }`}
            >
              🛠️ 陷阱工藝研發
            </button>
            <button
              onClick={onClose}
              className="bg-[#24130b] hover:bg-[#341b0d] border border-amber-800 px-4 py-1.5 rounded-lg text-stone-300 font-medium text-xs transition"
            >
              返回鐵匠鋪 (Back to Forge)
            </button>
          </div>

          <button
            onClick={onClose}
            className="wood-button px-5 py-1.5 rounded-lg text-amber-100 font-bold text-xs shadow active:scale-95 transition"
          >
            完成設定 (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
