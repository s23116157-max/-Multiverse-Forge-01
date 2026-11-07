/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Image as ImageIcon, Book, Shield, Zap, Sparkles } from 'lucide-react';

interface DesignReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignReferenceModal: React.FC<DesignReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState<'ui_gameplay' | 'ui_upgrades' | 'gdd'>('ui_gameplay');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="relative w-full max-w-4xl bg-[#26150b] border-4 border-[#7a421e] rounded-2xl shadow-2xl p-4 md:p-6 text-stone-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#572e14] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600 flex items-center justify-center text-amber-300">
              <Book size={22} />
            </div>
            <div>
              <h2 className="font-display font-black text-amber-200 text-lg">
                《萬界鐵匠鋪》企劃手冊與美術原稿對照
              </h2>
              <div className="text-xs text-stone-400">
                對照使用者上傳之遊戲設計圖與企劃書規格
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

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-amber-950 pb-2">
          <button
            onClick={() => setSelectedTab('ui_gameplay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTab === 'ui_gameplay'
                ? 'bg-amber-800 text-amber-100 shadow'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <ImageIcon size={14} />
            原案圖一：鍛造戰鬥主場景 (In-Game Forge)
          </button>

          <button
            onClick={() => setSelectedTab('ui_upgrades')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTab === 'ui_upgrades'
                ? 'bg-amber-800 text-amber-100 shadow'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <ImageIcon size={14} />
            原案圖二：設施升級與材料融合 (Upgrades & Fusion)
          </button>

          <button
            onClick={() => setSelectedTab('gdd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTab === 'gdd'
                ? 'bg-amber-800 text-amber-100 shadow'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Zap size={14} />
            企劃書核心規則摘要 (GDD Rules)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto max-h-[65vh] pr-1">
          {selectedTab === 'ui_gameplay' && (
            <div className="flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden border-2 border-amber-700 shadow-xl bg-black">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_2cikkq2cikkq2cik_4cff4180.jpg"
                  alt="Multiverse Forge Gameplay In-Game Concept"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="forge-panel-inner p-3 text-xs text-stone-300 flex flex-col gap-1.5">
                <span className="font-bold text-amber-300">原稿還原特徵解析：</span>
                <p>• <strong>Customer Order Panel</strong>：左上角顧客對話泡泡、裝備需求與耐性倒數條。</p>
                <p>• <strong>鍛造 QTE 打擊條</strong>：底座青銅刻紋指針，中央雙向「Perfect Hit」綠色爆擊區。</p>
                <p>• <strong>CATCH THIEF! 警報</strong>：左側小門小偷潛入，頭頂紅色驚嘆號，可直擊或飛鎚打擊。</p>
                <p>• <strong>World Portal 萬界傳送門</strong>：右側旋轉渦流，支援科幻、奇幻、蒸氣朋克世界切換。</p>
              </div>
            </div>
          )}

          {selectedTab === 'ui_upgrades' && (
            <div className="flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden border-2 border-amber-700 shadow-xl bg-black">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_u0tuqbu0tuqbu0tu_8bbc971e.jpg"
                  alt="Multiverse Forge Upgrades & Fusion Concept"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="forge-panel-inner p-3 text-xs text-stone-300 flex flex-col gap-1.5">
                <span className="font-bold text-amber-300">原稿還原特徵解析：</span>
                <p>• <strong>Materials Management & Fusion</strong>：左側材料庫存 +/- 與 Melt Down，右側雙孔 Fusion Mixer。</p>
                <p>• <strong>Forge 設施樹</strong>：Furnace (熔爐)、Anvil (鐵砧)、Quench Tank (冷卻槽)。</p>
                <p>• <strong>*NEW* Security System</strong>：Anti-Theft Scan Lv 1 附帶禁止小偷哥布林標誌的懸浮 Tooltip。</p>
                <p>• <strong>Skills 鍛造師技能</strong>：Precision (精準打擊)、Haste (神速鍛造)。</p>
              </div>
            </div>
          )}

          {selectedTab === 'gdd' && (
            <div className="flex flex-col gap-3 text-xs leading-relaxed text-stone-300">
              <div className="forge-panel-inner p-3">
                <h4 className="font-bold text-amber-300 text-sm mb-1">評分公式 (Scoring Formula)</h4>
                <div className="bg-black/50 p-2 rounded font-mono-num text-amber-200 text-center my-1">
                  訂單得分 = (基礎價值 × 品質係數 × 需求匹配度) + 速度加成 - 瑕疵懲罰
                </div>
                <ul className="list-disc pl-4 space-y-1 text-stone-400 mt-2">
                  <li>品質係數：QTE Perfect 比例越高，最高可達 1.5×。</li>
                  <li>需求匹配度：材質與屬性完全符合獲得 100% 分數，混用錯誤材質會折損。</li>
                  <li>速度加成：剩餘耐性時間每多 10%，額外獲得 5% 金幣與評分。</li>
                </ul>
              </div>

              <div className="forge-panel-inner p-3">
                <h4 className="font-bold text-amber-300 text-sm mb-1">每日營運評級 (Daily Settlement)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mt-2">
                  <div className="bg-amber-950/60 border border-yellow-500/60 p-2 rounded">
                    <span className="font-bold text-yellow-300">S 級 (≥90%)</span>
                    <p className="text-[10px] text-stone-400 mt-0.5">零商品失竊 + 全訂單完成</p>
                  </div>
                  <div className="bg-emerald-950/60 border border-emerald-500/60 p-2 rounded">
                    <span className="font-bold text-emerald-300">A 級 (75-89%)</span>
                    <p className="text-[10px] text-stone-400 mt-0.5">失竊件數 ≤ 1 件</p>
                  </div>
                  <div className="bg-stone-900 border border-stone-600 p-2 rounded">
                    <span className="font-bold text-stone-300">B 級 (60-74%)</span>
                    <p className="text-[10px] text-stone-400 mt-0.5">基本營運收益</p>
                  </div>
                  <div className="bg-red-950/60 border border-red-500/60 p-2 rounded">
                    <span className="font-bold text-red-300">C/D 級 (&lt;60%)</span>
                    <p className="text-[10px] text-stone-400 mt-0.5">扣除店面維修維護費</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#542d14] pt-2">
          <button
            onClick={onClose}
            className="wood-button px-5 py-1.5 rounded-lg text-amber-100 font-bold text-xs"
          >
            返回遊戲
          </button>
        </div>
      </div>
    </div>
  );
};
