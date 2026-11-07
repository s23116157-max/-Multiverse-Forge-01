/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Quest } from '../types/game';
import { sound } from '../audio/soundManager';
import { X, Award, CheckCircle, ArrowRight } from 'lucide-react';

interface QuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
  onClaimReward: (questId: string) => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  isOpen,
  onClose,
  quests,
  onClaimReward,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-xl bg-[#26150b] border-4 border-[#7a421e] rounded-2xl shadow-2xl p-4 md:p-6 text-stone-100 flex flex-col gap-4 max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#572e14] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300">
              <Award size={22} />
            </div>
            <div>
              <h2 className="font-display font-black text-amber-200 text-lg">
                萬界鐵匠工會成就與委託 (Guild Quests)
              </h2>
              <div className="text-xs text-stone-400">
                完成工會歷練任務，領取豐厚金幣與店鋪聲譽
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-900 border border-amber-800 text-amber-300 hover:bg-stone-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quest List */}
        <div className="flex flex-col gap-3 overflow-y-auto max-h-96 pr-1">
          {quests.map((quest) => {
            const isReady = quest.progress >= quest.target && !quest.isCompleted;

            return (
              <div
                key={quest.id}
                className={`forge-panel-inner p-3 flex items-center justify-between gap-3 ${
                  quest.isCompleted ? 'opacity-60 border-stone-800' : 'hover:border-amber-500'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-100">{quest.titleZh}</span>
                    {quest.isCompleted && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle size={12} />
                        已領取
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">{quest.descriptionZh}</p>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-stone-900 rounded-full mt-2 overflow-hidden border border-stone-700">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (quest.progress / quest.target) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 mt-0.5 font-mono-num">
                    <span>
                      進度: {quest.progress} / {quest.target}
                    </span>
                    <span className="text-amber-300">
                      獎勵: +{quest.rewardGold}G, +{quest.rewardRep}★
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isReady) {
                      sound.playCoins();
                      onClaimReward(quest.id);
                    }
                  }}
                  disabled={!isReady}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isReady
                      ? 'wood-button text-amber-100 shadow-md animate-bounce'
                      : quest.isCompleted
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  {quest.isCompleted ? '已完成' : isReady ? '領取獎勵!' : '進行中'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#542d14] pt-2">
          <button
            onClick={onClose}
            className="wood-button px-5 py-1.5 rounded-lg text-amber-100 font-bold text-xs"
          >
            關閉委託板
          </button>
        </div>
      </div>
    </div>
  );
};
