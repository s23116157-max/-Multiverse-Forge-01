/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaterialItem, FacilityUpgrades } from '../types/game';
import { MaterialIcon } from './MaterialIcon';
import { X, Package, BookOpen } from 'lucide-react';

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: MaterialItem[];
  upgrades: FacilityUpgrades;
  customerHistory: { name: string; weapon: string; gold: number; time: string }[];
}

export const WarehouseModal: React.FC<WarehouseModalProps> = ({
  isOpen,
  onClose,
  materials,
  upgrades,
  customerHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'storage' | 'logs'>('storage');

  if (!isOpen) return null;

  const totalCapacity = 100 + upgrades.warehouseLevel * 50;
  const currentTotal = materials.reduce((acc, m) => acc + m.count, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-3xl bg-[#26150b] border-4 border-[#7a421e] rounded-2xl shadow-2xl p-4 md:p-6 text-stone-100 flex flex-col gap-4 max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#572e14] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300">
              <Package size={22} />
            </div>
            <div>
              <h2 className="font-display font-black text-amber-200 text-lg">
                鐵匠鋪倉庫與時空日誌 (Warehouse & Customer Logs)
              </h2>
              <div className="text-xs text-stone-400">
                目前庫存: <span className="font-mono-num text-amber-300 font-bold">{currentTotal}</span> / {totalCapacity} 件容量 (Lv {upgrades.warehouseLevel})
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-amber-950 pb-2">
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'storage'
                ? 'bg-amber-800 text-amber-100 shadow'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Package size={14} />
            物料明細 (Materials Breakdown)
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-amber-800 text-amber-100 shadow'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen size={14} />
            顧客委託歷史日誌 (Customer Log)
          </button>
        </div>

        {/* Tab 1: Storage */}
        {activeTab === 'storage' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto max-h-96 pr-1">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="forge-panel-inner p-3 flex items-center gap-3 relative"
              >
                <div className="shrink-0">
                  <MaterialIcon icon={mat.icon} size={42} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-amber-100 truncate">{mat.nameZh}</div>
                  <div className="text-[10px] text-stone-400 truncate">{mat.name}</div>
                  <div className="text-[11px] text-amber-300 font-mono-num font-bold mt-1">
                    保有數量: {mat.count} 份
                  </div>
                  <div className="text-[10px] text-stone-400 leading-tight line-clamp-1 mt-0.5">
                    {mat.descriptionZh}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tab 2: Logs */
          <div className="flex flex-col gap-2 overflow-y-auto max-h-96 pr-1">
            {customerHistory.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs">
                尚未有完成的顧客委託紀錄。快去為異界顧客鍛造武器吧！
              </div>
            ) : (
              customerHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="forge-panel-inner p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-amber-200">{item.name}</span>
                    <span className="text-[10px] text-stone-400">交付武器: {item.weapon}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-num text-yellow-300 font-bold">+{item.gold} G</span>
                    <div className="text-[10px] text-stone-500">{item.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end border-t border-[#542d14] pt-2">
          <button
            onClick={onClose}
            className="wood-button px-5 py-1.5 rounded-lg text-amber-100 font-bold text-xs"
          >
            關閉倉庫
          </button>
        </div>
      </div>
    </div>
  );
};
