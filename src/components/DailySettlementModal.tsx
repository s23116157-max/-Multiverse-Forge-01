/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { DailySummary } from '../types/game';
import confetti from 'canvas-confetti';
import { Trophy, Award, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

interface DailySettlementModalProps {
  isOpen: boolean;
  summary: DailySummary;
  onNextDay: () => void;
}

export const DailySettlementModal: React.FC<DailySettlementModalProps> = ({
  isOpen,
  summary,
  onNextDay,
}) => {
  useEffect(() => {
    if (isOpen && (summary.grade === 'S' || summary.grade === 'A')) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, summary.grade]);

  if (!isOpen) return null;

  const isS = summary.grade === 'S';
  const isA = summary.grade === 'A';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-lg bg-[#27140a] border-4 border-[#82441c] rounded-2xl p-6 text-stone-100 shadow-2xl flex flex-col gap-4">
        {/* Settlement Header */}
        <div className="text-center border-b-2 border-amber-800/80 pb-3">
          <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">
            MULTIVERSE FORGE SETTLEMENT
          </span>
          <h2 className="font-display font-black text-2xl text-amber-200 mt-0.5">
            第 {summary.day} 天營業結算報告
          </h2>
        </div>

        {/* Grade Badge Display */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div
            className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-4 shadow-2xl ${
              isS
                ? 'bg-gradient-to-b from-amber-400 to-yellow-600 border-yellow-200 text-stone-950'
                : isA
                ? 'bg-gradient-to-b from-emerald-500 to-teal-700 border-emerald-300 text-white'
                : 'bg-gradient-to-b from-stone-700 to-stone-900 border-stone-500 text-amber-300'
            }`}
          >
            <span className="font-display text-5xl font-black">{summary.grade}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {isS ? 'PERFECT GRADE' : isA ? 'EXCELLENT' : 'STANDARD'}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <span className="text-stone-300">
              {isS && '🏆 S 級榮譽：完成所有委託且零商品失竊！解鎖傳奇設備圖紙與額外獎金。'}
              {isA && '⭐ A 級卓越：失竊件數低於 1 件，獲得額外材料包補助。'}
              {summary.grade === 'B' && '👍 B 級平穩：基本營業收益正常，請繼續留意防範小偷。'}
              {(summary.grade === 'C' || summary.grade === 'D') &&
                '⚠️ C/D 級警示：失竊過多或訂單超時，扣除店面維護維修費。'}
            </span>
          </div>
        </div>

        {/* Extreme Mode Achievement Banner */}
        {summary.isExtremeMode && (
          <div className="bg-gradient-to-r from-red-950 via-amber-950 to-red-950 border-2 border-red-500/80 rounded-xl p-2.5 flex items-center justify-between text-xs shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-black text-amber-200 flex items-center gap-1.5">
                  <span>極限鐵匠模式結算 (Extreme Forge Mode)</span>
                  <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full">2x 聲譽</span>
                </div>
                <div className="text-[10px] text-stone-300 mt-0.5">
                  成功頂住翻倍耐心時間壓力，斬獲榮譽與專屬素材！
                </div>
              </div>
            </div>
            {(summary.masterMedallionsEarned || 0) > 0 && (
              <div className="flex items-center gap-1 bg-amber-950/90 border border-amber-400 px-2.5 py-1 rounded-lg text-amber-200 font-black shadow">
                <span>🏅</span>
                <span>+{summary.masterMedallionsEarned} 宗師勳章</span>
              </div>
            )}
          </div>
        )}

        {/* Breakdown Stats Table from GDD */}
        <div className="bg-[#1b0d06] border border-amber-900/80 rounded-xl p-3 flex flex-col gap-2 text-xs">
          {summary.isExtremeMode && (
            <div className="flex items-center justify-between border-b border-amber-900/60 pb-1.5 bg-amber-950/30 px-2 py-1 rounded">
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <span>🏅</span>
                <span>獲贈專屬【宗師勳章】:</span>
              </span>
              <span className="font-mono-num font-black text-yellow-300 text-sm">
                +{summary.masterMedallionsEarned || 1} 枚 (已入庫倉庫)
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="text-stone-400">完成委託訂單:</span>
            <span className="font-mono-num font-bold text-amber-300">
              {summary.ordersCompleted} 筆 (失敗: {summary.ordersFailed})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="text-stone-400">成功擊退小偷:</span>
            <span className="font-mono-num font-bold text-emerald-400">
              {summary.thievesDefeated} 名
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="text-stone-400">商品失竊件數:</span>
            <span
              className={`font-mono-num font-bold ${
                summary.itemsStolen === 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {summary.itemsStolen} 件 {summary.itemsStolen === 0 && ' (完美防衛!)'}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="text-stone-400">玄關機關陷阱觸發:</span>
            <span className="font-mono-num font-bold text-cyan-300">
              {summary.trapsTriggered || 0} 次 (自動打擊與控場)
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="text-stone-400">本日總收入金幣:</span>
            <span className="font-mono-num font-bold text-yellow-300 text-sm">
              +{summary.totalGoldEarned.toLocaleString()} G
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400">店面聲譽變化:</span>
            <span className="font-mono-num font-bold text-amber-400 flex items-center gap-1">
              +{summary.totalReputationChange} 聲譽點
              {summary.isExtremeMode && (
                <span className="text-[10px] text-red-400 font-extrabold">(極限 2x 倍率)</span>
              )}
            </span>
          </div>
        </div>

        {/* Advance to Next Day Button */}
        <button
          onClick={onNextDay}
          className="wood-button w-full py-2.5 rounded-xl text-amber-100 font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition"
        >
          <span>開始第 {summary.day + 1} 天營業 (Start Next Day)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
