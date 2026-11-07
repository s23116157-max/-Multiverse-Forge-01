/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MaterialItem } from '../types/game';
import { MaterialIcon } from './MaterialIcon';
import { sound } from '../audio/soundManager';
import { X, ShoppingBag, Coins } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  gold: number;
  materials: MaterialItem[];
  onBuyMaterial: (materialId: string, quantity: number, totalCost: number) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  gold,
  materials,
  onBuyMaterial,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-2xl bg-[#26150b] border-4 border-[#7a421e] rounded-2xl shadow-2xl p-4 md:p-6 text-stone-100 flex flex-col gap-4 max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#572e14] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 className="font-display font-black text-amber-200 text-lg">
                萬界黑市補給站 (Multiverse Black Market)
              </h2>
              <div className="text-xs text-stone-400">
                向跨界行商採購稀有合金、魔晶與賽博零件
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 border border-amber-700 font-mono-num font-bold text-yellow-300 text-sm">
              <Coins size={16} className="text-yellow-400" />
              {gold.toLocaleString()} G
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-900 border border-amber-800 text-amber-300 hover:bg-stone-800 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Goods List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-96 pr-1">
          {materials.map((mat) => {
            const unitPrice = Math.round(mat.basePrice * 1.2);
            const bundleCount = 3;
            const bundleCost = unitPrice * bundleCount;
            const canAfford = gold >= bundleCost;

            return (
              <div
                key={mat.id}
                className="forge-panel-inner p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <MaterialIcon icon={mat.icon} size={38} />
                  <div>
                    <div className="text-xs font-bold text-amber-100">{mat.nameZh.split(' ')[0]}</div>
                    <div className="text-[10px] text-stone-400">
                      庫存: <span className="font-mono-num text-amber-300">{mat.count}</span>
                    </div>
                    <div className="text-[10px] text-yellow-400 font-mono-num">
                      單價: {unitPrice} G
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (canAfford) {
                      sound.playCoins();
                      onBuyMaterial(mat.id, bundleCount, bundleCost);
                    }
                  }}
                  disabled={!canAfford}
                  className="wood-button px-3 py-1.5 rounded-lg text-amber-100 font-bold text-xs disabled:opacity-40 active:scale-95 transition"
                >
                  購買 +{bundleCount} ({bundleCost}G)
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
            完成採購
          </button>
        </div>
      </div>
    </div>
  );
};
