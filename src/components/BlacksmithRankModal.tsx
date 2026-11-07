/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BlacksmithRankInfo } from '../types/game';
import { BLACKSMITH_RANKS, getBlacksmithRank, getNextBlacksmithRank } from '../data/gameData';
import { X, Award, CheckCircle, Lock, Sparkles, ChevronRight, Zap, Crown } from 'lucide-react';
import { sound } from '../audio/soundManager';

interface BlacksmithRankModalProps {
  isOpen: boolean;
  onClose: () => void;
  forgeExp: number;
  totalOrdersCompleted: number;
  masterMedallionsCount: number;
}

export const BlacksmithRankModal: React.FC<BlacksmithRankModalProps> = ({
  isOpen,
  onClose,
  forgeExp,
  totalOrdersCompleted,
  masterMedallionsCount,
}) => {
  if (!isOpen) return null;

  const currentRank = getBlacksmithRank(forgeExp);
  const nextRank = getNextBlacksmithRank(forgeExp);

  // Calculate progress toward next rank
  let progressPercent = 100;
  let expNeeded = 0;
  if (nextRank) {
    const baseExp = currentRank.requiredExp;
    const tierRange = nextRank.requiredExp - baseExp;
    const currentProgress = Math.max(0, forgeExp - baseExp);
    progressPercent = Math.min(100, Math.round((currentProgress / tierRange) * 100));
    expNeeded = Math.max(0, nextRank.requiredExp - forgeExp);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-3xl bg-[#24130a] border-4 border-[#82441c] rounded-2xl shadow-2xl p-4 md:p-6 text-stone-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-900/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <span>{currentRank.badgeIcon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-600/30 border border-amber-500 text-amber-300 px-2 py-0.5 rounded font-black tracking-wide uppercase">
                  BLACKSMITH RANK & PRESTIGE
                </span>
                <span className="text-xs text-stone-400 font-mono-num font-bold">
                  Lv {currentRank.level} / 5
                </span>
              </div>
              <h2 className="font-display font-black text-amber-200 text-lg md:text-xl flex items-center gap-2 mt-0.5">
                <span>萬界鐵匠職堦晉升錄</span>
                <span className={`text-sm px-2.5 py-0.5 rounded-full border ${currentRank.borderClass} ${currentRank.colorClass} bg-stone-950/70`}>
                  {currentRank.titleZh}
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

        {/* Current Standing Card & Progress Bar */}
        <div className={`p-4 rounded-xl border-2 ${currentRank.borderClass} bg-gradient-to-r ${currentRank.bgGradient} shadow-xl flex flex-col gap-3 relative overflow-hidden`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
            <div>
              <div className="text-xs text-stone-300 font-medium flex items-center gap-1.5">
                <span>當前鍛造造詣 (Forge Mastery Experience):</span>
                <span className="font-mono-num font-black text-yellow-300 text-base">
                  {forgeExp.toLocaleString()} EXP
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-1">
                每一次成功交付訂單、敲出 Perfect 打擊或於極限模式中淬火，皆可積累鍛造造詣！
              </p>
            </div>

            {nextRank ? (
              <div className="bg-stone-950/80 border border-amber-700/80 rounded-xl px-3 py-1.5 text-right shrink-0">
                <div className="text-[10px] text-stone-400">晉升至【{nextRank.bonusTitle}】</div>
                <div className="text-xs font-mono-num font-black text-amber-300">
                  尚需 {expNeeded} EXP
                </div>
              </div>
            ) : (
              <div className="bg-amber-950/90 border border-yellow-400 rounded-xl px-3 py-1.5 text-center shrink-0 shadow">
                <div className="text-xs font-black text-yellow-300 flex items-center gap-1">
                  <Crown size={14} className="text-yellow-400" />
                  <span>已達萬界聖匠巔峰</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1 relative z-10">
            <div className="flex items-center justify-between text-[11px] font-mono-num">
              <span className="text-stone-300 font-bold">
                {currentRank.titleZh.split(' ')[0]} (Lv {currentRank.level})
              </span>
              <span className="text-yellow-300 font-black">
                {nextRank ? `${progressPercent}%` : 'MAX LEVEL (100%)'}
              </span>
              {nextRank && (
                <span className="text-stone-400">
                  {nextRank.titleZh.split(' ')[0]} (Lv {nextRank.level})
                </span>
              )}
            </div>
            <div className="w-full h-3.5 bg-stone-950/90 rounded-full border border-amber-800/80 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5-Tier Blacksmith Rank Ladder */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-amber-900/60 pb-1">
            <h3 className="font-bold text-amber-300 text-xs md:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>🏅</span>
              <span>鐵匠五階職堦與專屬權能 (Rank Hierarchy & Passive Perks)</span>
            </h3>
            <span className="text-[10px] text-stone-400">晉升即享永久被動增益</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {BLACKSMITH_RANKS.map((rank) => {
              const isCurrent = currentRank.id === rank.id;
              const isUnlocked = forgeExp >= rank.requiredExp;

              return (
                <div
                  key={rank.id}
                  className={`p-3 rounded-xl border-2 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                    isCurrent
                      ? `bg-stone-900/90 ${rank.borderClass} shadow-lg ring-1 ring-amber-500/40`
                      : isUnlocked
                      ? 'bg-stone-950/70 border-stone-700/80'
                      : 'bg-[#150a04]/60 border-stone-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl shrink-0 shadow ${
                        isUnlocked
                          ? `${rank.borderClass} bg-stone-950 text-white`
                          : 'border-stone-800 bg-stone-900 text-stone-600'
                      }`}
                    >
                      <span>{rank.badgeIcon}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-num text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 font-bold">
                          Lv {rank.level}
                        </span>
                        <h4 className={`text-xs md:text-sm font-black ${rank.colorClass}`}>
                          {rank.titleZh}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-mono-num">
                          (門檻: {rank.requiredExp.toLocaleString()} EXP)
                        </span>

                        {isCurrent && (
                          <span className="text-[9px] bg-amber-500 text-stone-950 font-black px-2 py-0.2 rounded-full uppercase animate-pulse">
                            當前職堦 (Current)
                          </span>
                        )}
                        {!isCurrent && isUnlocked && (
                          <span className="text-[9px] bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <CheckCircle size={10} />
                            已達成
                          </span>
                        )}
                      </div>

                      {/* Perks Bullet Points */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5">
                        {rank.perksZh.map((perk, pIdx) => (
                          <div
                            key={pIdx}
                            className={`text-[11px] flex items-center gap-1 ${
                              isUnlocked ? 'text-stone-200' : 'text-stone-500'
                            }`}
                          >
                            <span className={isUnlocked ? 'text-amber-400' : 'text-stone-600'}>
                              ✦
                            </span>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 self-end md:self-center">
                    {isUnlocked ? (
                      <div className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <CheckCircle size={14} />
                        <span>權能生效中</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-500 text-xs flex items-center gap-1">
                        <Lock size={12} />
                        <span>未解鎖</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Master Career Statistics Footnote */}
        <div className="bg-[#180c05] border border-amber-900/60 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div>
            <div className="text-[10px] text-stone-400">總交付武器</div>
            <div className="font-mono-num font-bold text-amber-300 mt-0.5">
              {totalOrdersCompleted} 件
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-400">當前鍛造造詣</div>
            <div className="font-mono-num font-bold text-yellow-300 mt-0.5">
              {forgeExp} EXP
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-400">已獲宗師勳章</div>
            <div className="font-mono-num font-bold text-amber-400 mt-0.5">
              {masterMedallionsCount} 枚
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-400">職堦頭銜加成</div>
            <div className="font-mono-num font-bold text-emerald-400 mt-0.5">
              Lv {currentRank.level} ({currentRank.bonusTitle})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
