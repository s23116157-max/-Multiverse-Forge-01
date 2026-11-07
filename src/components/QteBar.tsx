/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QteHitRating } from '../types/game';

interface QteBarProps {
  onHit: (rating: QteHitRating) => void;
  hitsRemaining: number;
  totalHits: number;
  perfectWidthPercent?: number; // default ~16%
  greatWidthPercent?: number;   // default ~38%
  speedMultiplier?: number;
  disabled?: boolean;
}

export const QteBar: React.FC<QteBarProps> = ({
  onHit,
  hitsRemaining,
  totalHits,
  perfectWidthPercent = 16,
  greatWidthPercent = 38,
  speedMultiplier = 1,
  disabled = false,
}) => {
  const [cursorPos, setCursorPos] = useState<number>(50); // 0 to 100
  const [lastRating, setLastRating] = useState<QteHitRating | null>(null);
  const [floatingSparks, setFloatingSparks] = useState<{ id: number; text: string; color: string; x: number }[]>([]);
  
  const posRef = useRef<number>(50);
  const dirRef = useRef<number>(1);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Cursor oscillation loop
  useEffect(() => {
    if (disabled || hitsRemaining <= 0) return;

    const animate = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const baseSpeed = 70 * speedMultiplier; // % per second
      let newPos = posRef.current + dirRef.current * baseSpeed * dt;

      if (newPos >= 96) {
        newPos = 96;
        dirRef.current = -1;
      } else if (newPos <= 4) {
        newPos = 4;
        dirRef.current = 1;
      }

      posRef.current = newPos;
      setCursorPos(newPos);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [disabled, hitsRemaining, speedMultiplier]);

  // Handle strike execution
  const triggerStrike = useCallback(() => {
    if (disabled || hitsRemaining <= 0) return;

    const current = posRef.current;
    const center = 50;
    const dist = Math.abs(current - center);

    const halfPerfect = perfectWidthPercent / 2;
    const halfGreat = greatWidthPercent / 2;

    let rating: QteHitRating = 'PASS';
    let label = 'PASS!';
    let color = '#facc15';

    if (dist <= halfPerfect) {
      rating = 'PERFECT';
      label = 'PERFECT HIT!';
      color = '#22c55e';
    } else if (dist <= halfGreat) {
      rating = 'GREAT';
      label = 'GREAT!';
      color = '#38bdf8';
    } else if (dist > 40) {
      rating = 'MISS';
      label = 'MISS...';
      color = '#ef4444';
    }

    setLastRating(rating);
    const sparkId = Date.now() + Math.random();
    setFloatingSparks((prev) => [...prev, { id: sparkId, text: label, color, x: current }]);

    setTimeout(() => {
      setFloatingSparks((prev) => prev.filter((s) => s.id !== sparkId));
    }, 800);

    onHit(rating);
  }, [disabled, hitsRemaining, perfectWidthPercent, greatWidthPercent, onHit]);

  // Spacebar hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !disabled && hitsRemaining > 0) {
        e.preventDefault();
        triggerStrike();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerStrike, disabled, hitsRemaining]);

  const halfGreat = greatWidthPercent / 2;
  const halfPerfect = perfectWidthPercent / 2;

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none py-1">
      {/* Floating Spark Text Feedback */}
      {floatingSparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute -top-10 font-black text-sm md:text-base pointer-events-none drop-shadow-md z-30 transition-all transform -translate-x-1/2 animate-bounce"
          style={{ left: `${spark.x}%`, color: spark.color }}
        >
          {spark.text}
        </div>
      ))}

      {/* Top Tag: "Perfect Hit" indicator (as seen in Image 1) */}
      <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 tracking-wider mb-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        Perfect Hit
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* The Master Bar Container with Bronze Framing and Side Arrows */}
      <div 
        className="relative w-full flex items-center cursor-pointer group"
        onClick={triggerStrike}
        title="點擊或按空白鍵進行鍛造敲擊 (Strike Hammer)"
      >
        {/* Left Bronze Arrow Head */}
        <div className="w-6 h-8 bg-gradient-to-r from-amber-700 to-amber-900 border-2 border-amber-500 clip-arrow-left flex items-center justify-center text-amber-200 font-black text-xs shrink-0 shadow-lg">
          ◀
        </div>

        {/* Central Track */}
        <div className="relative flex-1 h-7 bg-stone-950 border-y-2 border-amber-600 overflow-hidden shadow-inner flex items-center">
          {/* Subtle Track Texture */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Pass Zone (Sides) - Dark Stone */}
          <div className="absolute inset-0 bg-stone-900/90" />

          {/* Great Hit Zone (Cyan/Blue tint) */}
          <div
            className="absolute top-0 bottom-0 bg-sky-900/60 border-x border-sky-400/40"
            style={{
              left: `${50 - halfGreat}%`,
              width: `${greatWidthPercent}%`,
            }}
          />

          {/* Perfect Hit Zone (Emerald Green from Image 1) */}
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 border-x-2 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
            style={{
              left: `${50 - halfPerfect}%`,
              width: `${perfectWidthPercent}%`,
            }}
          />

          {/* Center Zero Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/70 -translate-x-1/2 z-10" />

          {/* Dynamic Sliding Cursor (Green glowing pill cursor from Image 1) */}
          <div
            className="absolute top-0 bottom-0 z-20 transition-transform -translate-x-1/2 flex items-center justify-center pointer-events-none"
            style={{ left: `${cursorPos}%` }}
          >
            <div className="w-5 h-8 bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-700 border-2 border-white rounded-md shadow-[0_0_10px_#4ade80]" />
          </div>
        </div>

        {/* Right Bronze Arrow Head */}
        <div className="w-6 h-8 bg-gradient-to-l from-amber-700 to-amber-900 border-2 border-amber-500 clip-arrow-right flex items-center justify-center text-amber-200 font-black text-xs shrink-0 shadow-lg">
          ▶
        </div>
      </div>

      {/* Bottom Tag: "Perfect Hit" indicator (as seen in Image 1) */}
      <div className="text-[11px] font-bold text-emerald-400 tracking-wider mt-0.5">
        Perfect Hit
      </div>

      {/* Hit Counter and Helper Instruction */}
      <div className="mt-1 flex items-center gap-3 text-xs text-stone-300">
        <span className="font-mono-num font-bold text-amber-300">
          錘打進度: {totalHits - hitsRemaining + 1} / {totalHits}
        </span>
        <span className="text-stone-400">·</span>
        <button
          onClick={triggerStrike}
          disabled={disabled || hitsRemaining <= 0}
          className="wood-button text-amber-100 font-bold px-3 py-1 rounded text-xs active:scale-95 transition-transform"
        >
          🔨 敲擊！(空白鍵 Space)
        </button>
      </div>
    </div>
  );
};
