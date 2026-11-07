/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MaterialItem, FusionRecipe, CustomerOrder, CoolantType, ModuleType, Quest, BlacksmithRankInfo, Achievement, ThiefType, ThiefSpecialDrop, WorldType } from '../types/game';

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 'star_metal',
    name: 'Star-Metal Ingots',
    nameZh: '星金錠 (秘銀)',
    world: 'FANTASY',
    category: 'ingot',
    icon: 'ingot-silver',
    count: 20,
    basePrice: 40,
    descriptionZh: '奇幻世界隕鐵，蘊含微弱星辰引力，抗魔性極高。',
  },
  {
    id: 'mana_crystal',
    name: 'Mana Crystals',
    nameZh: '魔力晶石',
    world: 'FANTASY',
    category: 'crystal',
    icon: 'crystal-blue',
    count: 33,
    basePrice: 25,
    descriptionZh: '高純度元素魔力凝結體，可賦予裝備強效元素附魔。',
  },
  {
    id: 'servo_motor',
    name: 'Servo Motors',
    nameZh: '高能伺服馬達',
    world: 'SCIFI',
    category: 'tech',
    icon: 'motor-cyan',
    count: 4,
    basePrice: 80,
    descriptionZh: '科幻機甲精密部件，提供刀刃超高頻熱震盪動能。',
  },
  {
    id: 'aether_vial',
    name: 'Aether Vials',
    nameZh: '以太靈液',
    world: 'FANTASY',
    category: 'liquid',
    icon: 'potion-purple',
    count: 8,
    basePrice: 50,
    descriptionZh: '提煉自虛空之淚的魔法溶劑，能將異種合金完美黏合。',
  },
  {
    id: 'control_chip',
    name: 'Control Chips',
    nameZh: '微型控制晶片',
    world: 'SCIFI',
    category: 'tech',
    icon: 'chip-green',
    count: 6,
    basePrice: 70,
    descriptionZh: '賽博奈米邏輯電路，可自動調整輸出電漿槍刃相位。',
  },
  {
    id: 'synthetic_leather',
    name: 'Synthetic Leather',
    nameZh: '強化複合皮革',
    world: 'STEAMPUNK',
    category: 'relic',
    icon: 'leather-brown',
    count: 12,
    basePrice: 20,
    descriptionZh: '浸漬耐熱油的耐磨廢土皮革，防震並提供極佳握持感。',
  },
  {
    id: 'clockwork_gear',
    name: 'Clockwork Gears',
    nameZh: '精工齒輪組',
    world: 'STEAMPUNK',
    category: 'tech',
    icon: 'gear-gold',
    count: 10,
    basePrice: 35,
    descriptionZh: '蒸氣工坊精密黃銅齒輪，能蓄力進行重擊連動。',
  },
  {
    id: 'scrap_plate',
    name: 'Scrap Armor Plate',
    nameZh: '廢土合金鋼板',
    world: 'STEAMPUNK',
    category: 'ingot',
    icon: 'plate-rust',
    count: 18,
    basePrice: 15,
    descriptionZh: '末日拾荒搜集的高強度複合廢鋼，堅硬耐酸蝕。',
  },
  {
    id: 'plasma_core_mat',
    name: 'Plasma Energy Cell',
    nameZh: '電漿能源核心',
    world: 'SCIFI',
    category: 'tech',
    icon: 'core-blue',
    count: 3,
    basePrice: 120,
    descriptionZh: '小型冷聚變能源單元，持續散發耀眼的電漿磁場。',
  },
  {
    id: 'master_medallion',
    name: 'Master Medallion',
    nameZh: '宗師勳章',
    world: 'UNIVERSAL',
    category: 'relic',
    icon: 'medal-gold',
    count: 0,
    basePrice: 240,
    descriptionZh: '『極限鐵匠模式』專屬傳奇素材！於顧客耐心翻倍縮減的極限考驗下淬火奪得，象徵頂尖宗師的無上實力與榮耀。',
  },
];

export const FUSION_RECIPES: FusionRecipe[] = [
  {
    id: 'fuse_plasma_axe',
    inputA: 'star_metal',
    inputB: 'servo_motor',
    outputId: 'fused_plasma_alloy',
    nameZh: '電漿超導合金錠',
    descriptionZh: '星金與高能馬達融合的高頻震盪合金，無堅不摧。',
  },
  {
    id: 'fuse_runic_core',
    inputA: 'mana_crystal',
    inputB: 'control_chip',
    outputId: 'fused_runic_chip',
    nameZh: '符文生化微晶片',
    descriptionZh: '魔法共振與晶片邏輯結合，能自動導引魔法攻擊。',
  },
  {
    id: 'fuse_steam_aether',
    inputA: 'aether_vial',
    inputB: 'clockwork_gear',
    outputId: 'fused_chrono_gear',
    nameZh: '時空發條軸心',
    descriptionZh: '以太靈液潤滑的時鐘機構，揮舞時伴隨時空波紋。',
  },
  {
    id: 'fuse_master_crest',
    inputA: 'master_medallion',
    inputB: 'star_metal',
    outputId: 'fused_master_aegis',
    nameZh: '宗師神諭秘銀徽記',
    descriptionZh: '宗師勳章與星金秘銀融合淬煉的神諭徽記，價值連城，尊享至高工匠榮耀。',
  },
  {
    id: 'fuse_nanoleather',
    inputA: 'synthetic_leather',
    inputB: 'control_chip',
    outputId: 'fused_nano_wrap',
    nameZh: '生化肌電護手革',
    descriptionZh: '嵌入神經感應點的皮套，使用者能意念拔刀。',
  },
];

export const COOLANTS: { id: CoolantType; nameZh: string; world: string; bonusDesc: string }[] = [
  {
    id: 'holy_water',
    nameZh: '大教堂聖水 (Holy Water)',
    world: '奇幻世界首選',
    bonusDesc: '淬火產生神聖輝光，奇幻武器額外 +20% 附魔評分',
  },
  {
    id: 'liquid_nitrogen',
    nameZh: '液態氮極速冷卻液 (Liquid N₂)',
    world: '科幻世界首選',
    bonusDesc: '瞬間超導固化，科幻武器硬度 +25% 評分',
  },
  {
    id: 'motor_oil',
    nameZh: '重型機油 (Heavy Mineral Oil)',
    world: '廢土 / 蒸氣朋克首選',
    bonusDesc: '深層滲透潤滑，蒸氣武器耐磨度 +20% 評分',
  },
];

export const MODULES: { id: ModuleType; nameZh: string; world: string; effectZh: string }[] = [
  {
    id: 'mana_crystal',
    nameZh: '魔晶鑲嵌槽',
    world: '奇幻',
    effectZh: '賦予冰霜 / 烈焰元素打擊屬性',
  },
  {
    id: 'control_chip',
    nameZh: '電子瞄準晶片',
    world: '科幻',
    effectZh: '智慧輔助弱點鎖定',
  },
  {
    id: 'clockwork_gear',
    nameZh: '加壓齒輪連動組',
    world: '蒸氣朋克',
    effectZh: '連續揮擊積累高壓蒸氣衝擊波',
  },
  {
    id: 'plasma_core',
    nameZh: '電漿增幅電容',
    world: '科幻 / 跨界',
    effectZh: '刀刃覆蓋高溫離子等離子層',
  },
];

export const SAMPLE_ORDERS_POOL: Omit<CustomerOrder, 'id' | 'timeRemaining'>[] = [
  {
    customerName: '巴隆·鐵錘 (Baron Ironbeard)',
    customerRoleZh: '賽博重裝矮人 (Cyber Dwarf)',
    world: 'SCIFI',
    portrait: 'dwarf_cyber',
    dialogueZh: '嘿鐵匠！我需要一把注入電漿的重型戰斧（Plasma-Infused Battleaxe）！快點，機甲競技場快開打了！',
    weaponNameZh: '電漿高頻戰斧',
    weaponType: 'axe',
    requiredMaterials: [
      { materialId: 'star_metal', count: 2 },
      { materialId: 'servo_motor', count: 1 },
    ],
    requiredCoolant: 'liquid_nitrogen',
    requiredModule: 'plasma_core',
    maxTime: 45,
    baseGold: 380,
    baseReputation: 35,
  },
  {
    customerName: '艾莉西亞 (Aelicia Swiftarrow)',
    customerRoleZh: '精靈遊俠 (Elven Ranger)',
    world: 'FANTASY',
    portrait: 'elf_archer',
    dialogueZh: '願微風指引你，鐵匠大師。我需要一把輕盈且具破邪之力的「耐熱秘銀細劍」，林地正遭受侵蝕。',
    weaponNameZh: '月影秘銀細劍',
    weaponType: 'sword',
    requiredMaterials: [
      { materialId: 'star_metal', count: 2 },
      { materialId: 'mana_crystal', count: 2 },
    ],
    requiredCoolant: 'holy_water',
    requiredModule: 'mana_crystal',
    maxTime: 40,
    baseGold: 320,
    baseReputation: 30,
  },
  {
    customerName: '狂怒者·傑克 (Mad Jack)',
    customerRoleZh: '廢土齒輪技師 (Wasteland Mechanic)',
    world: 'STEAMPUNK',
    portrait: 'steampunk_mechanic',
    dialogueZh: '呼哈哈！給我打造一把「高壓蒸氣鋸齒切削刃」！用最厚實的鋼板和齒輪，外頭的掠奪者要來了！',
    weaponNameZh: '蒸氣超載切削刃',
    weaponType: 'blade',
    requiredMaterials: [
      { materialId: 'scrap_plate', count: 3 },
      { materialId: 'clockwork_gear', count: 2 },
    ],
    requiredCoolant: 'motor_oil',
    requiredModule: 'clockwork_gear',
    maxTime: 42,
    baseGold: 290,
    baseReputation: 28,
  },
  {
    customerName: '賽拉菲娜 (Seraphina Voidgazer)',
    customerRoleZh: '星海魔導主教 (Starfield Archmage)',
    world: 'FANTASY',
    portrait: 'mage_human',
    dialogueZh: '時空的樞紐在震顫。我需要一支「以太共鳴魔導權杖」，並以聖水粹冷以承載純粹奧術！',
    weaponNameZh: '以太星輝法杖',
    weaponType: 'staff',
    requiredMaterials: [
      { materialId: 'aether_vial', count: 2 },
      { materialId: 'mana_crystal', count: 3 },
    ],
    requiredCoolant: 'holy_water',
    requiredModule: 'mana_crystal',
    maxTime: 38,
    baseGold: 450,
    baseReputation: 40,
  },
  {
    customerName: '雷克斯 (V-87 Rex)',
    customerRoleZh: '星際生化義體獵人 (Cyborg Mercenary)',
    world: 'SCIFI',
    portrait: 'cyborg_pilot',
    dialogueZh: '目標懸賞極度危險。替我整備「超導電漿破甲手槍」，加裝微型晶片校準，別耽誤我的獵殺！',
    weaponNameZh: '極光電漿破甲槍',
    weaponType: 'gun',
    requiredMaterials: [
      { materialId: 'star_metal', count: 1 },
      { materialId: 'control_chip', count: 1 },
      { materialId: 'servo_motor', count: 1 },
    ],
    requiredCoolant: 'liquid_nitrogen',
    requiredModule: 'control_chip',
    maxTime: 36,
    baseGold: 420,
    baseReputation: 38,
  },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    titleZh: '初涉萬界：完成 3 筆異界委託',
    descriptionZh: '透過時空門滿足不同世界的顧客需求，證明萬界鐵匠鋪的工藝實力。',
    world: 'UNIVERSAL',
    rewardGold: 250,
    rewardRep: 20,
    isCompleted: false,
    progress: 0,
    target: 3,
  },
  {
    id: 'q2',
    titleZh: '銅牆鐵壁：擊退 2 名潛入小偷',
    descriptionZh: '在鍛造過程中敏銳察覺小偷動靜，守護完成品與貴重材料倉庫！',
    world: 'UNIVERSAL',
    rewardGold: 300,
    rewardRep: 25,
    isCompleted: false,
    progress: 0,
    target: 2,
  },
  {
    id: 'q3',
    titleZh: '神乎其技：達成 5 次 Perfect 敲擊',
    descriptionZh: '掌握砧上節奏，精準命中極限綠色判定區間。',
    world: 'FANTASY',
    rewardGold: 200,
    rewardRep: 15,
    isCompleted: false,
    progress: 0,
    target: 5,
  },
  {
    id: 'q4',
    titleZh: '工欲善其事：升級任一鍛造設備',
    descriptionZh: '前往升級面板，升級熔爐、鐵砧或保全系統以因應高難度訂單。',
    world: 'UNIVERSAL',
    rewardGold: 350,
    rewardRep: 30,
    isCompleted: false,
    progress: 0,
    target: 1,
  },
];

export const BLACKSMITH_RANKS: BlacksmithRankInfo[] = [
  {
    id: 'apprentice',
    level: 1,
    titleZh: '初級學徒 (Apprentice)',
    badgeIcon: '🔨',
    requiredExp: 0,
    bonusTitle: '工藝學徒',
    perksZh: [
      '熟習熔煉、鐵砧錘打與急速淬火流程',
      '常規萬界顧客接單與基礎收益',
    ],
    colorClass: 'text-stone-300',
    borderClass: 'border-stone-600',
    bgGradient: 'from-[#1c130c] to-[#2c1a0e]',
  },
  {
    id: 'journeyman',
    level: 2,
    titleZh: '熟練工匠 (Journeyman)',
    badgeIcon: '⚒️',
    requiredExp: 250,
    bonusTitle: '鍛造能手',
    perksZh: [
      '所有訂單金幣收益額外 +10%',
      '顧客初始耐心倒數時間 +4 秒 (寬裕操作)',
    ],
    colorClass: 'text-emerald-300',
    borderClass: 'border-emerald-500',
    bgGradient: 'from-[#0b1f14] via-[#102d1d] to-[#0b1f14]',
  },
  {
    id: 'artisan',
    level: 3,
    titleZh: '精鋼名匠 (Artisan Master)',
    badgeIcon: '⚔️',
    requiredExp: 650,
    bonusTitle: '精銳巨匠',
    perksZh: [
      '鐵砧 QTE 完美 (Perfect) 綠色判定區間寬度 +15%',
      '投擲鐵鎚打擊傷害 +1.0 HP (強效制敵防盜)',
    ],
    colorClass: 'text-cyan-300',
    borderClass: 'border-cyan-400',
    bgGradient: 'from-[#081e28] via-[#0f2e3d] to-[#081e28]',
  },
  {
    id: 'grandmaster',
    level: 4,
    titleZh: '萬界宗師 (Multiverse Grandmaster)',
    badgeIcon: '🔮',
    requiredExp: 1350,
    bonusTitle: '無上宗師',
    perksZh: [
      '全武器訂單基礎金幣收益額外 +25%',
      '極限鐵匠模式下必定額外贈送 1 枚【宗師勳章】',
    ],
    colorClass: 'text-purple-300',
    borderClass: 'border-purple-400',
    bgGradient: 'from-[#1e0a29] via-[#321344] to-[#1e0a29]',
  },
  {
    id: 'godsmith',
    level: 5,
    titleZh: '神鑄聖匠 (Mythic Godsmith)',
    badgeIcon: '👑',
    requiredExp: 2400,
    bonusTitle: '造物聖匠',
    perksZh: [
      '聖匠神威：所有顧客基礎小費與獎賞 +35%',
      '威壓領域：小偷潛入與逃跑移速降低 20%',
      '啟動神曜金光光環，受萬界顧客敬仰膜拜',
    ],
    colorClass: 'text-amber-300',
    borderClass: 'border-yellow-400',
    bgGradient: 'from-[#2e1d08] via-[#4d300d] to-[#2e1d08]',
  },
];

export function getBlacksmithRank(exp: number): BlacksmithRankInfo {
  for (let i = BLACKSMITH_RANKS.length - 1; i >= 0; i--) {
    if (exp >= BLACKSMITH_RANKS[i].requiredExp) {
      return BLACKSMITH_RANKS[i];
    }
  }
  return BLACKSMITH_RANKS[0];
}

export function getNextBlacksmithRank(exp: number): BlacksmithRankInfo | null {
  for (let i = 0; i < BLACKSMITH_RANKS.length; i++) {
    if (exp < BLACKSMITH_RANKS[i].requiredExp) {
      return BLACKSMITH_RANKS[i];
    }
  }
  return null;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_forge_50',
    titleZh: '萬界兵鑑 · 百鍊神兵',
    descriptionZh: '累計為跨維度顧客成功鍛造完成 50 把神兵武器。',
    category: 'forge',
    progress: 0,
    target: 50,
    isUnlocked: false,
    unlockedTitleZh: '神鑄不朽者 (Mythic Forger)',
    badgeIcon: '⚒️',
    badgeColorClass: 'text-amber-300 border-amber-500 bg-amber-950/80 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    rewardGold: 1200,
  },
  {
    id: 'ach_defense_5_days',
    titleZh: '銅牆鐵壁 · 零失竊傳奇',
    descriptionZh: '在每日結算中累計達成連續 5 天無任何材料被盜（連續 5 天保衛成功）。',
    category: 'defense',
    progress: 0,
    target: 5,
    isUnlocked: false,
    unlockedTitleZh: '絕對鐵壁守護者 (Iron Aegis)',
    badgeIcon: '🛡️',
    badgeColorClass: 'text-emerald-300 border-emerald-500 bg-emerald-950/80 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    rewardGold: 1000,
  },
  {
    id: 'ach_thief_slayer_30',
    titleZh: '玄關夢魘 · 盜賊剋星',
    descriptionZh: '親自揮動重鎚或藉由玄關機關累計擊倒 30 名潛入店內的盜賊。',
    category: 'defense',
    progress: 0,
    target: 30,
    isUnlocked: false,
    unlockedTitleZh: '獵影裁決官 (Shadow Bane)',
    badgeIcon: '⚡',
    badgeColorClass: 'text-cyan-300 border-cyan-500 bg-cyan-950/80 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    rewardGold: 800,
  },
  {
    id: 'ach_wealth_10k',
    titleZh: '萬界金庫 · 富可敵國',
    descriptionZh: '店鋪金幣儲備或累計獲取突破 10,000 Gold。',
    category: 'wealth',
    progress: 0,
    target: 10000,
    isUnlocked: false,
    unlockedTitleZh: '萬界金庫領主 (Gold Sovereign)',
    badgeIcon: '💰',
    badgeColorClass: 'text-yellow-300 border-yellow-400 bg-yellow-950/80 shadow-[0_0_12px_rgba(250,204,21,0.5)]',
    rewardGold: 1500,
  },
  {
    id: 'ach_extreme_10',
    titleZh: '生死淬火 · 極限宗師',
    descriptionZh: '在『極限鐵匠模式』（雙倍顧客耐心流失）下成功完成 10 份訂單。',
    category: 'extreme',
    progress: 0,
    target: 10,
    isUnlocked: false,
    unlockedTitleZh: '極限天工宗師 (Apex Grandmaster)',
    badgeIcon: '🔥',
    badgeColorClass: 'text-red-400 border-red-500 bg-red-950/80 shadow-[0_0_12px_rgba(239,68,68,0.5)]',
    rewardGold: 1800,
  },
  {
    id: 'ach_perfect_rhythm',
    titleZh: '神之節律 · 靈動天籟',
    descriptionZh: '在鐵砧鍛打 QTE 中累計敲出 50 次 Perfect 完美節奏。',
    category: 'mastery',
    progress: 0,
    target: 50,
    isUnlocked: false,
    unlockedTitleZh: '萬籟天音律匠 (Rhythm Maestro)',
    badgeIcon: '🎵',
    badgeColorClass: 'text-purple-300 border-purple-400 bg-purple-950/80 shadow-[0_0_12px_rgba(192,132,252,0.5)]',
    rewardGold: 900,
  },
  {
    id: 'ach_godsmith_tier',
    titleZh: '造物聖殿 · 萬界神皇',
    descriptionZh: '鐵匠造詣達到頂峰，晉升至第五階【神鑄聖匠 (Mythic Godsmith)】。',
    category: 'mastery',
    progress: 0,
    target: 5,
    isUnlocked: false,
    unlockedTitleZh: '造物聖匠帝皇 (Godsmith Emperor)',
    badgeIcon: '👑',
    badgeColorClass: 'text-amber-200 border-yellow-300 bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.6)]',
    rewardGold: 2500,
  },
];

export function generateThiefSpecialDrop(thiefType: ThiefType): { world: WorldType; drop: ThiefSpecialDrop } {
  if (thiefType === 'goblin') {
    // 哥布林 (Goblin · 奇幻/FANTASY): 魔力晶石 (mana_crystal), 星金錠 (star_metal), 以太靈液 (aether_vial)
    const options: Array<{ materialId: string; materialNameZh: string; icon: string; count: number; rarity: 'rare' | 'epic' | 'legendary' }> = [
      { materialId: 'mana_crystal', materialNameZh: '魔力晶石', icon: '💎', count: Math.floor(Math.random() * 2) + 2, rarity: 'rare' },
      { materialId: 'star_metal', materialNameZh: '星金錠 (秘銀)', icon: '✨', count: Math.floor(Math.random() * 2) + 1, rarity: 'rare' },
      { materialId: 'aether_vial', materialNameZh: '以太靈液', icon: '🧪', count: 1, rarity: 'epic' },
    ];
    const picked = options[Math.floor(Math.random() * options.length)];
    return {
      world: 'FANTASY',
      drop: {
        materialId: picked.materialId,
        materialNameZh: picked.materialNameZh,
        icon: picked.icon,
        count: picked.count,
        world: 'FANTASY',
        rarity: picked.rarity,
      },
    };
  } else if (thiefType === 'hacker') {
    // 駭客 (Hacker · 科幻/SCIFI): 微型控制晶片 (control_chip), 高能伺服馬達 (servo_motor), 電漿能源核心 (plasma_core_mat)
    const options: Array<{ materialId: string; materialNameZh: string; icon: string; count: number; rarity: 'rare' | 'epic' | 'legendary' }> = [
      { materialId: 'control_chip', materialNameZh: '微型控制晶片', icon: '💾', count: Math.floor(Math.random() * 2) + 1, rarity: 'rare' },
      { materialId: 'servo_motor', materialNameZh: '高能伺服馬達', icon: '⚡', count: Math.floor(Math.random() * 2) + 1, rarity: 'epic' },
      { materialId: 'plasma_core_mat', materialNameZh: '電漿能源核心', icon: '🔮', count: 1, rarity: 'legendary' },
    ];
    const picked = options[Math.floor(Math.random() * options.length)];
    return {
      world: 'SCIFI',
      drop: {
        materialId: picked.materialId,
        materialNameZh: picked.materialNameZh,
        icon: picked.icon,
        count: picked.count,
        world: 'SCIFI',
        rarity: picked.rarity,
      },
    };
  } else {
    // 拾荒老鼠 (Rat · 廢土/STEAMPUNK): 廢土合金鋼板 (scrap_plate), 精工齒輪組 (clockwork_gear), 強化複合皮革 (synthetic_leather)
    const options: Array<{ materialId: string; materialNameZh: string; icon: string; count: number; rarity: 'rare' | 'epic' | 'legendary' }> = [
      { materialId: 'scrap_plate', materialNameZh: '廢土合金鋼板', icon: '🛡️', count: Math.floor(Math.random() * 2) + 2, rarity: 'rare' },
      { materialId: 'clockwork_gear', materialNameZh: '精工齒輪組', icon: '⚙️', count: Math.floor(Math.random() * 2) + 1, rarity: 'rare' },
      { materialId: 'synthetic_leather', materialNameZh: '強化複合皮革', icon: '📦', count: Math.floor(Math.random() * 2) + 2, rarity: 'rare' },
    ];
    const picked = options[Math.floor(Math.random() * options.length)];
    return {
      world: 'STEAMPUNK',
      drop: {
        materialId: picked.materialId,
        materialNameZh: picked.materialNameZh,
        icon: picked.icon,
        count: picked.count,
        world: 'STEAMPUNK',
        rarity: picked.rarity,
      },
    };
  }
}

