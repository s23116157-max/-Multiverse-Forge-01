/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CustomerPortraitProps {
  portraitId: string;
  size?: number;
}

export const CustomerPortrait: React.FC<CustomerPortraitProps> = ({ portraitId, size = 100 }) => {
  switch (portraitId) {
    case 'dwarf_cyber':
      // The iconic Cyber Dwarf from the mockup: Bald head with shaved side, heavy orange beard, futuristic cyan cyber-visor!
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="rounded-xl overflow-hidden shadow-inner">
          <rect width="100" height="100" fill="#382115" />
          {/* Background gradient aura */}
          <circle cx="50" cy="50" r="45" fill="#4a2c1a" />
          
          {/* Armor Shoulders */}
          <path d="M10 95 L25 70 L50 82 L75 70 L90 95 Z" fill="#475569" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M22 72 L32 68 L36 78 L26 82 Z" fill="#0891b2" />
          <path d="M78 72 L68 68 L64 78 L74 82 Z" fill="#0891b2" />

          {/* Dwarf Head & Ears (Ash / Dark Iron Gray Skin Tone) */}
          <circle cx="28" cy="46" r="6" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
          <circle cx="72" cy="46" r="6" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
          <ellipse cx="50" cy="45" rx="24" ry="26" fill="#9ca3af" stroke="#6b7280" strokeWidth="1.5" />

          {/* Shaved hair / top */}
          <path d="M28 34 C28 20 72 20 72 34 C65 24 35 24 28 34 Z" fill="#9a3412" />
          
          {/* Cyber Visor (Cyan glowing glasses) */}
          <rect x="26" y="36" width="48" height="15" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
          <rect x="30" y="39" width="40" height="9" rx="2" fill="#22d3ee" />
          <line x1="33" y1="43" x2="67" y2="43" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="36" cy="43" r="1.5" fill="#ffffff" />
          <circle cx="64" cy="43" r="1.5" fill="#ffffff" />

          {/* Nose */}
          <ellipse cx="50" cy="54" rx="7" ry="5" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />

          {/* Huge Orange Dwarf Beard */}
          <path
            d="M26 55 C20 75 32 96 50 98 C68 96 80 75 74 55 C66 60 58 62 50 62 C42 62 34 60 26 55 Z"
            fill="#c2410c"
            stroke="#7c2d12"
            strokeWidth="2.5"
          />
          {/* Beard Texture Strands */}
          <path d="M38 65 Q44 85 46 95" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 66 Q50 88 50 96" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M62 65 Q56 85 54 95" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'elf_archer':
      // Elven Ranger: pointy ears, emerald hood, silver circlet, golden hair
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="rounded-xl overflow-hidden shadow-inner">
          <rect width="100" height="100" fill="#143026" />
          <circle cx="50" cy="50" r="45" fill="#1b4332" />
          {/* Pointy ears */}
          <polygon points="20,45 10,32 30,42" fill="#fcd3ad" stroke="#d97706" strokeWidth="1.2" />
          <polygon points="80,45 90,32 70,42" fill="#fcd3ad" stroke="#d97706" strokeWidth="1.2" />
          {/* Head */}
          <ellipse cx="50" cy="46" rx="20" ry="24" fill="#fcd3ad" />
          {/* Hood and Cloak */}
          <path d="M22 28 C28 10 72 10 78 28 C86 48 84 88 88 98 L12 98 C16 88 14 48 22 28 Z" fill="#2d6a4f" opacity="0.9" />
          {/* Golden Locks */}
          <path d="M32 36 Q30 60 26 70" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 36 Q70 60 74 70" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
          {/* Face */}
          <ellipse cx="43" cy="44" rx="3" ry="2" fill="#10b981" />
          <ellipse cx="57" cy="44" rx="3" ry="2" fill="#10b981" />
          <path d="M47 54 Q50 56 53 54" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" />
          {/* Circlet */}
          <path d="M30 32 Q50 36 70 32" stroke="#e2e8f0" strokeWidth="2.5" />
          <polygon points="50,28 53,33 47,33" fill="#38bdf8" />
        </svg>
      );

    case 'steampunk_mechanic':
      // Wasteland Mechanic: brass goggles, leather strap, grime on face
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="rounded-xl overflow-hidden shadow-inner">
          <rect width="100" height="100" fill="#291a12" />
          <circle cx="50" cy="50" r="45" fill="#3d261b" />
          {/* Leather Vest & Collar */}
          <path d="M15 95 L30 70 L50 80 L70 70 L85 95 Z" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
          {/* Head */}
          <ellipse cx="50" cy="46" rx="22" ry="25" fill="#fcd3ad" />
          {/* Soot mark */}
          <circle cx="38" cy="52" r="6" fill="#78350f" opacity="0.3" filter="blur(2px)" />
          {/* Brass Goggles on forehead */}
          <rect x="22" y="24" width="56" height="6" fill="#451a03" />
          <circle cx="36" cy="27" r="11" fill="#ca8a04" stroke="#713f12" strokeWidth="2.5" />
          <circle cx="36" cy="27" r="7" fill="#854d0e" />
          <circle cx="64" cy="27" r="11" fill="#ca8a04" stroke="#713f12" strokeWidth="2.5" />
          <circle cx="64" cy="27" r="7" fill="#854d0e" />
          {/* Eyes & Smirk */}
          <circle cx="42" cy="46" r="2.5" fill="#1e293b" />
          <circle cx="58" cy="46" r="2.5" fill="#1e293b" />
          <path d="M44 58 Q54 62 60 56" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'mage_human':
      // Archmage: mysterious purple hood and glowing runes
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="rounded-xl overflow-hidden shadow-inner">
          <rect width="100" height="100" fill="#1e1035" />
          <circle cx="50" cy="50" r="45" fill="#2d1b4e" />
          <path d="M12 95 L25 65 L50 78 L75 65 L88 95 Z" fill="#581c87" stroke="#3b0764" strokeWidth="2" />
          {/* Pointed Wizard Cowl */}
          <path d="M20 50 C24 16 76 16 80 50 C84 75 75 95 75 95 L25 95 C25 95 16 75 20 50 Z" fill="#6b21a8" />
          {/* Shadowed Face */}
          <ellipse cx="50" cy="48" rx="16" ry="18" fill="#1f1133" />
          {/* Glowing Eyes */}
          <circle cx="43" cy="46" r="3" fill="#c084fc" filter="drop-shadow(0 0 4px #c084fc)" />
          <circle cx="57" cy="46" r="3" fill="#c084fc" filter="drop-shadow(0 0 4px #c084fc)" />
        </svg>
      );

    case 'cyborg_pilot':
    default:
      // Cyborg Mercenary with cyber eye
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="rounded-xl overflow-hidden shadow-inner">
          <rect width="100" height="100" fill="#1e293b" />
          <circle cx="50" cy="50" r="45" fill="#0f172a" />
          {/* Flight jacket */}
          <path d="M14 95 L28 66 L50 78 L72 66 L86 95 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />
          {/* Head with metal plate half */}
          <ellipse cx="50" cy="46" rx="22" ry="25" fill="#fcd3ad" />
          <path d="M50 21 C62 21 72 31 72 46 C72 60 62 70 50 71 Z" fill="#94a3b8" />
          {/* Glowing red cyber eye on right half */}
          <circle cx="40" cy="44" r="2.5" fill="#0f172a" />
          <circle cx="60" cy="44" r="4" fill="#ef4444" filter="drop-shadow(0 0 5px #ef4444)" />
          <circle cx="60" cy="44" r="1.5" fill="#ffffff" />
          {/* Audio earpiece antenna */}
          <rect x="70" y="38" width="5" height="14" rx="2" fill="#0284c7" />
          <line x1="72" y1="38" x2="72" y2="22" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
