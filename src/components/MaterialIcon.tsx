/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MaterialIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({ icon, size = 44, className = '' }) => {
  switch (icon) {
    case 'ingot-silver':
      // Star-Metal / Mythril Ingot (metallic silver-blue bar with beveled facets)
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path d="M12 40 L28 48 L52 38 L36 30 Z" fill="#94a3b8" />
          <path d="M12 40 L28 48 L28 54 L12 46 Z" fill="#64748b" />
          <path d="M28 48 L52 38 L52 44 L28 54 Z" fill="#475569" />
          <path d="M20 24 L36 32 L56 24 L40 16 Z" fill="#cbd5e1" />
          <path d="M20 24 L36 32 L36 38 L20 30 Z" fill="#94a3b8" />
          <path d="M36 32 L56 24 L56 30 L36 38 Z" fill="#64748b" />
          {/* Sparkle highlight */}
          <circle cx="36" cy="24" r="2" fill="#ffffff" filter="drop-shadow(0 0 3px #67e8f9)" />
          <path d="M36 18 L36 30 M30 24 L42 24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'crystal-blue':
      // Mana Crystal (glowing cyan octahedron)
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <polygon points="32,8 48,26 32,58 16,26" fill="#0284c7" />
          <polygon points="32,8 48,26 32,38" fill="#38bdf8" />
          <polygon points="32,8 32,38 16,26" fill="#7dd3fc" />
          <polygon points="32,38 48,26 32,58" fill="#0369a1" />
          <polygon points="16,26 32,38 32,58" fill="#0284c7" />
          <line x1="32" y1="8" x2="32" y2="58" stroke="#bae6fd" strokeWidth="1.2" opacity="0.6" />
          <circle cx="32" cy="24" r="1.5" fill="#ffffff" filter="drop-shadow(0 0 4px #bae6fd)" />
        </svg>
      );

    case 'motor-cyan':
      // Servo Motor (futuristic cyan & copper actuator unit)
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <rect x="14" y="22" width="30" height="26" rx="4" fill="#0891b2" stroke="#164e63" strokeWidth="2" />
          <rect x="44" y="28" width="10" height="14" rx="2" fill="#f97316" stroke="#9a3412" strokeWidth="1.5" />
          <rect x="54" y="32" width="4" height="6" fill="#64748b" />
          <rect x="18" y="14" width="18" height="8" rx="2" fill="#334155" />
          <circle cx="28" cy="35" r="7" fill="#0f172a" />
          <circle cx="28" cy="35" r="4" fill="#22d3ee" />
          <line x1="20" y1="28" x2="20" y2="42" stroke="#67e8f9" strokeWidth="1.5" />
        </svg>
      );

    case 'potion-purple':
      // Aether Vial (magic flask with cork and glowing purple potion)
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <rect x="27" y="10" width="10" height="6" rx="1.5" fill="#d97706" />
          <rect x="25" y="16" width="14" height="6" rx="1" fill="#78350f" />
          <path d="M26 22 L18 36 C16 44 20 54 32 54 C44 54 48 44 46 36 L38 22 Z" fill="#9333ea" stroke="#581c87" strokeWidth="2" />
          <ellipse cx="32" cy="38" rx="10" ry="12" fill="#a855f7" />
          <circle cx="28" cy="42" r="3" fill="#e9d5ff" />
          <circle cx="36" cy="46" r="2" fill="#f3e8ff" />
          <circle cx="34" cy="34" r="1.5" fill="#ffffff" />
        </svg>
      );

    case 'chip-green':
      // Control Chip (microchip with green board and golden connector leads)
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <rect x="18" y="18" width="28" height="28" rx="4" fill="#065f46" stroke="#047857" strokeWidth="2" />
          <rect x="24" y="24" width="16" height="16" rx="2" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
          {/* Pins */}
          {[22, 28, 34, 40].map((x) => (
            <React.Fragment key={x}>
              <line x1={x} y1="12" x2={x} y2="18" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
              <line x1={x} y1="46" x2={x} y2="52" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
            </React.Fragment>
          ))}
          {[22, 28, 34, 40].map((y) => (
            <React.Fragment key={y}>
              <line x1="12" y1={y} x2="18" y2={y} stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
              <line x1="46" y1={y} x2="52" y2={y} stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
            </React.Fragment>
          ))}
          <circle cx="32" cy="32" r="3" fill="#34d399" />
        </svg>
      );

    case 'leather-brown':
      // Synthetic Leather hide
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <path
            d="M20 16 C26 12 38 12 44 16 C48 24 54 28 52 36 C50 44 48 52 42 52 C36 50 28 50 22 52 C16 52 14 44 12 36 C10 28 16 24 20 16 Z"
            fill="#854d0e"
            stroke="#451a03"
            strokeWidth="2.5"
          />
          <path
            d="M24 20 C28 17 36 17 40 20 C44 26 48 30 46 36 C44 42 42 46 38 46 C34 44 28 44 24 46 C20 46 18 42 16 36 C15 30 20 26 24 20 Z"
            fill="#a16207"
          />
          <circle cx="30" cy="30" r="1.5" fill="#451a03" />
          <circle cx="34" cy="35" r="1.5" fill="#451a03" />
          <circle cx="27" cy="38" r="1.5" fill="#451a03" />
        </svg>
      );

    case 'gear-gold':
      // Clockwork Brass Gears
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="16" fill="#ca8a04" stroke="#713f12" strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <rect
              key={angle}
              x="29"
              y="10"
              width="6"
              height="8"
              rx="1.5"
              fill="#eab308"
              stroke="#854d0e"
              strokeWidth="1.2"
              transform={`rotate(${angle} 32 32)`}
            />
          ))}
          <circle cx="32" cy="32" r="8" fill="#451a03" />
          <circle cx="32" cy="32" r="4" fill="#fde047" />
        </svg>
      );

    case 'plate-rust':
      // Scrap Metal Plate with rivets
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <polygon points="14,16 48,12 52,48 16,52" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
          <polygon points="18,19 45,15 48,45 19,48" fill="#9a3412" />
          <circle cx="22" cy="22" r="2" fill="#d1d5db" />
          <circle cx="42" cy="18" r="2" fill="#d1d5db" />
          <circle cx="44" cy="42" r="2" fill="#d1d5db" />
          <circle cx="22" cy="44" r="2" fill="#d1d5db" />
          <line x1="28" y1="28" x2="38" y2="38" stroke="#451a03" strokeWidth="2" />
        </svg>
      );

    case 'medal-gold':
      // Master Medallion (Grandmaster Medallion with crimson ribbon & golden crest)
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          {/* Crimson hanging ribbons */}
          <polygon points="26,10 22,28 32,24" fill="#dc2626" />
          <polygon points="38,10 42,28 32,24" fill="#991b1b" />
          <polygon points="26,10 38,10 32,24" fill="#ef4444" />
          {/* Outer Golden Medallion Ring with sunburst notches */}
          <circle cx="32" cy="38" r="18" fill="#eab308" stroke="#854d0e" strokeWidth="2.5" filter="drop-shadow(0 0 5px rgba(234,179,8,0.6))" />
          <circle cx="32" cy="38" r="14" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Inner Medallion Plate */}
          <circle cx="32" cy="38" r="11" fill="#78350f" />
          {/* Embossed Golden Anvil & Star in Center */}
          <path d="M26 34 L38 34 L36 38 L34 42 L30 42 L28 38 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <polygon points="32,28 33,31 36,31 33.5,33 34.5,36 32,34 29.5,36 30.5,33 28,31 31,31" fill="#ffffff" />
          {/* Shining glint */}
          <circle cx="25" cy="31" r="1.5" fill="#ffffff" />
        </svg>
      );

    case 'core-blue':
    default:
      // Plasma Core
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="20" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="14" fill="#0284c7" />
          <circle cx="32" cy="32" r="8" fill="#38bdf8" />
          <circle cx="32" cy="32" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #67e8f9)" />
          <path d="M22 22 L42 42 M22 42 L42 22" stroke="#a5f3fc" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );
  }
};
