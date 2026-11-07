/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Achievement, AchievementCategory, EquippedTitleBadge } from '../types/game';
import { sound } from '../audio/soundManager';
import { Trophy, Award, Shield, Flame, Coins, Sparkles, CheckCircle2, Lock, X } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  equippedTitleBadge: EquippedTitleBadge | null;
  onEquipTitleBadge: (achievement: Achievement | null) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  equippedTitleBadge,
  onEquipTitleBadge,
}) => {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('all');

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  const categories: { id: AchievementCategory; label: string; icon: string }[] = [
    { id: 'all', label: '全部成就', icon: '🏆' },
    { id: 'forge', label: '鍛造造詣', icon: '⚒️' },
    { id: 'defense', label: '守衛防衛', icon: '🛡️' },
    { id: 'wealth', label: '財富榮耀', icon: '💰' },
    { id: 'extreme', label: '極限挑戰', icon: '🔥' },
    { id: 'mastery', label: '匠藝專精', icon: '👑' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#2a170d] via-[#1c0f08] to-[#120803] border-4 border-[#6b3e1e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#231209] border-b-2 border-[#542d14] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-500/80 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Trophy size={22} className="text-yellow-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                  HALL OF HEROIC FEATS
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 border border-amber-600 text-amber-300 font-mono-num font-bold">
                  {unlockedCount} / {totalCount} ({completionPercent}%)
                </span>
              </div>
              <h2 className="font-display font-black text-amber-200 text-lg md:text-xl flex items-center gap-2">
                <span>萬界鐵匠成就殿堂</span>
                <span className="text-xs text-stone-400 font-sans font-normal hidden sm:inline">
                  · 解鎖特殊鐵匠稱號與專屬展示徽章
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playCoins();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-stone-900 border border-amber-800 text-amber-300 hover:bg-stone-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Equipped Title & Badge Banner */}
        <div className="px-5 py-3 bg-[#180c05] border-b border-[#42220e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 font-semibold">當前佩戴稱號與徽章：</span>
            {equippedTitleBadge ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-950 via-[#3d2311] to-amber-950 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
                <span className="text-xl filter drop-shadow">{equippedTitleBadge.badgeIcon}</span>
                <span className="text-xs font-black text-yellow-300 tracking-wider">
                  {equippedTitleBadge.titleZh}
                </span>
              </div>
            ) : (
              <span className="text-xs text-stone-500 italic">
                尚未佩戴稱號（達成成就後點擊「佩戴稱號」即可在頂部狀態列展示）
              </span>
            )}
          </div>

          {equippedTitleBadge && (
            <button
              onClick={() => {
                sound.playCoins();
                onEquipTitleBadge(null);
              }}
              className="text-[11px] text-stone-400 hover:text-amber-300 underline transition"
            >
              卸下當前稱號
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-3 pb-2 flex items-center gap-2 overflow-x-auto border-b border-amber-950/60 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playCoins();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)] border border-amber-400'
                  : 'bg-stone-900/90 text-stone-400 hover:text-amber-200 border border-stone-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Achievements List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
          {filteredAchievements.map((ach) => {
            const isEquipped = equippedTitleBadge?.id === ach.id;
            const progressRatio = Math.min(1, ach.progress / ach.target);
            const progressPercent = Math.round(progressRatio * 100);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  ach.isUnlocked
                    ? 'bg-gradient-to-r from-[#24130b] via-[#1a0e07] to-[#24130b] border-amber-600/70 shadow-lg'
                    : 'bg-stone-950/70 border-stone-800/80 opacity-85'
                }`}
              >
                {/* Left: Badge Icon & Information */}
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Badge Icon Display */}
                  <div
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl shrink-0 shadow-md transition-transform ${
                      ach.isUnlocked
                        ? `${ach.badgeColorClass} scale-105`
                        : 'bg-stone-900 border-stone-800 text-stone-600 grayscale'
                    }`}
                  >
                    {ach.isUnlocked ? (
                      <span className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] animate-float">
                        {ach.badgeIcon}
                      </span>
                    ) : (
                      <Lock size={20} className="text-stone-600" />
                    )}
                  </div>

                  {/* Texts & Rewards */}
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`font-black text-sm md:text-base ${
                          ach.isUnlocked ? 'text-amber-200' : 'text-stone-400'
                        }`}
                      >
                        {ach.titleZh}
                      </h4>

                      {/* Unlocked Special Title Badge */}
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                          ach.isUnlocked
                            ? 'bg-amber-950/80 border-amber-500 text-yellow-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                            : 'bg-stone-900 border-stone-800 text-stone-500'
                        }`}
                      >
                        <Award size={12} className={ach.isUnlocked ? 'text-yellow-400' : 'text-stone-600'} />
                        <span>稱號: {ach.unlockedTitleZh}</span>
                      </span>

                      {ach.isUnlocked && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>已達成</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-300 leading-snug">{ach.descriptionZh}</p>

                    {/* Progress Bar & Numerical Counter */}
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 max-w-xs h-2.5 bg-stone-900 rounded-full border border-stone-700/80 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            ach.isUnlocked
                              ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                              : 'bg-gradient-to-r from-amber-600 to-yellow-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono-num font-bold text-stone-400">
                        {ach.progress.toLocaleString()} / {ach.target.toLocaleString()} ({progressPercent}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Gold Reward & Equip Title Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                  <div className="flex items-center gap-1 text-xs font-mono-num font-bold text-yellow-300 bg-amber-950/70 border border-amber-700/60 px-2.5 py-1 rounded-lg">
                    <Coins size={14} className="text-yellow-400" />
                    <span>+{ach.rewardGold.toLocaleString()} G</span>
                  </div>

                  {ach.isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playCoins();
                        sound.playMultiverseSurge();
                        onEquipTitleBadge(ach);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                        isEquipped
                          ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-[0_0_12px_#10b981]'
                          : 'wood-button text-amber-100 hover:text-white'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <Sparkles size={14} className="animate-spin" />
                          <span>佩戴展示中</span>
                        </>
                      ) : (
                        <>
                          <span>佩戴稱號與徽章</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] text-stone-500 px-3 py-1.5 bg-stone-900 rounded-lg border border-stone-800">
                      尚未達成
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#180c05] border-t-2 border-[#542d14] flex items-center justify-between text-xs text-stone-400">
          <span>提示：佩戴的稱號與徽章將實時銘刻於主畫面上方玩家狀態列！</span>
          <button
            onClick={() => {
              sound.playCoins();
              onClose();
            }}
            className="wood-button px-5 py-1.5 rounded-xl text-amber-100 font-bold text-xs"
          >
            關閉殿堂 (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
