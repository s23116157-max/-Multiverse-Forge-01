/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WorldType = 'FANTASY' | 'SCIFI' | 'STEAMPUNK';

export type CoolantType = 'holy_water' | 'liquid_nitrogen' | 'motor_oil';

export type ModuleType = 'mana_crystal' | 'control_chip' | 'clockwork_gear' | 'plasma_core';

export type TrapType = 
  | 'spike_trap' 
  | 'stasis_trap' 
  | 'oil_tar_trap' 
  | 'asphalt_trap' 
  | 'tesla_mine'
  | 'cryo_trap'
  | 'vortex_trap';

export interface TrapEngineering {
  spikeDamageLevel: number;    // Lv 1-3: 1.5 -> 2.5 -> 3.5 damage
  spikeKnockbackLevel: number; // Lv 1-3: 5% -> 8% -> 12% knockback
  stasisDurationLevel: number; // Lv 1-3: 6s -> 9s -> 12s slow duration
  stasisSlowRateLevel: number; // Lv 1-3: 65% -> 75% -> 85% speed penalty
  tarLootDropLevel: number;    // Lv 1-3: drops gold bounty 60G -> 120G -> 200G
  rearmSpeedLevel: number;     // Lv 1-3: trap cooldown -20% -> -35% -> -50%
  trapOverchargeLevel: number; // Lv 1-3: 25% -> 40% -> 55% chance for AoE shockwave
  reconDroneLevel: number;     // Lv 0-3: 0 (未部署) -> 1 (光學雷達預警) -> 2 (破除偽裝與隱形) -> 3 (弱點標記+探照燈減速易傷)
  autoCycleReloadLevel: number;// Lv 0-3: 0 (未解鎖需手動補齊) -> 1 (機關自動循環 15G) -> 2 (高壓微型彈匣 10G) -> 3 (萬界量子供彈 5G 且冷卻額外-15%)
  trapChainReactionLevel: number; // Lv 0-3: 0 (未解鎖) -> 1 (35% 鄰近連鎖) -> 2 (60% 連鎖防禦) -> 3 (85% 完美連鎖共鳴)
  unlockedAsphalt: boolean;    // 『黏著瀝青陷阱』(4s 完全定身固化)
  unlockedTeslaMine: boolean;  // 『超導雷暴地雷』(2.5 HP 巨額雷暴引爆)
  unlockedCryo: boolean;       // 『零度霜凍陷阱』(3.5s 深度凍結 + 2x 易傷)
  unlockedVortex: boolean;     // 『次元折疊漩渦』(瞬間彈回門外並奪回贓物)
}

export interface TrapSlot {
  id: string;
  xPercent: number; // placement position near entrance (e.g. 22%, 30%)
  type: TrapType;
  isArmed: boolean;
  cooldownRemaining: number;
  maxCooldown: number;
}

export interface MaterialItem {
  id: string;
  name: string;
  nameZh: string;
  world: WorldType | 'UNIVERSAL';
  category: 'ingot' | 'crystal' | 'tech' | 'relic' | 'liquid' | 'fused';
  icon: string;
  count: number;
  basePrice: number;
  descriptionZh: string;
}

export interface FusionRecipe {
  id: string;
  inputA: string;
  inputB: string;
  outputId: string;
  nameZh: string;
  descriptionZh: string;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerRoleZh: string;
  world: WorldType;
  portrait: string;
  dialogueZh: string;
  weaponNameZh: string;
  weaponType: 'sword' | 'axe' | 'gun' | 'staff' | 'shield' | 'blade';
  requiredMaterials: { materialId: string; count: number }[];
  requiredCoolant: CoolantType;
  requiredModule: ModuleType;
  timeRemaining: number;
  maxTime: number;
  baseGold: number;
  baseReputation: number;
}

export type ThiefType = 'goblin' | 'hacker' | 'rat';

export interface ThiefSpecialDrop {
  materialId: string;
  materialNameZh: string;
  icon: string;
  count: number;
  world: WorldType;
  rarity: 'rare' | 'epic' | 'legendary';
}

export interface FlyingLootEffect {
  id: string;
  startX: number;
  startY: number;
  icon: string;
  materialNameZh: string;
  count: number;
  world: WorldType;
  thiefNameZh: string;
  timestamp: number;
}

export interface ThiefEntity {
  id: string;
  type: ThiefType;
  world?: WorldType;
  nameZh: string;
  hp: number;
  maxHp: number;
  xPercent: number; // 0 to 100% position on screen
  yPercent: number;
  direction: 'in' | 'out';
  state: 'sneaking' | 'stealing' | 'fleeing' | 'stunned' | 'defeated';
  stolenItemName?: string;
  stolenGold?: number;
  speed: number;
  isDisguised?: boolean;      // Stealth cloaked or disguised
  isRevealed?: boolean;       // Revealed by recon patrol drone
  revealDuration?: number;    // Spotlight tracking timer
  isSlowed?: boolean;
  slowDuration?: number;
  isImmobilized?: boolean;
  immobilizeDuration?: number;
  isFrozen?: boolean;
  freezeDuration?: number;
  specialDrop?: ThiefSpecialDrop; // 『特殊掉落物』機制
}

export interface FacilityUpgrades {
  // 🔨 FORGE 鍛造設施
  furnaceLevel: number;        // 1 to 4: heating speed & multi-world melt
  anvilLevel: number;          // 1 to 4: wider perfect/great hit zone
  bellowsPowerLevel: number;   // 0 to 3: Master Bellows - +35% heating efficiency & thermal barrier
  quenchTankLevel: number;     // 1 to 3: faster cooling & bonus score

  // 🛡️ DEFENSE & SECURITY 保全與防衛
  securityScanLevel: number;   // 0 to 3: auto detects & deters thieves
  trapLevel: number;           // 0 to 3: unlocks static traps at entrance (Spike, EMP, Tar, etc.)
  sentryGolemLevel: number;    // 0 to 3: Autonomous Sentry Golem auto-shoots bolts at thieves
  flyingHammerMastery: number; // 0 to 3: Hammer throw +damage, piercing, and lightning stun

  // 📦 MANAGEMENT & COMMERCE 店面與商會
  warehouseLevel: number;      // 1 to 3: +capacity & customer logs
  portalStabilizerLevel: number; // 0 to 3: Portal Stabilizer - +25% patience & rare VIP orders
  guildCharmLevel: number;     // 0 to 3: Multiverse Guild Charm - +25% tips & daily 120G subsidy

  // 🗡️ MASTERY SKILLS 匠師專屬技藝
  skillPrecision: number;      // 1 to 3: Great area +10%
  skillHaste: number;          // 1 to 3: -1s forge time / patience preservation
  comboArtisanLevel: number;   // 0 to 3: Combo Artisan - consecutive Perfect hits trigger bonus gold & slow-motion
}

export type ForgeStep = 
  | 'STANDBY' 
  | 'MELT' 
  | 'HAMMER_QTE' 
  | 'QUENCH_ASSEMBLE' 
  | 'FINISHED';

export type QteHitRating = 'PERFECT' | 'GREAT' | 'PASS' | 'MISS';

export interface DailySummary {
  day: number;
  ordersCompleted: number;
  ordersFailed: number;
  thievesDefeated: number;
  itemsStolen: number;
  trapsTriggered: number;
  totalGoldEarned: number;
  totalReputationChange: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  isExtremeMode?: boolean;
  masterMedallionsEarned?: number;
}

export interface Quest {
  id: string;
  titleZh: string;
  descriptionZh: string;
  world: WorldType | 'UNIVERSAL';
  rewardGold: number;
  rewardRep: number;
  isCompleted: boolean;
  progress: number;
  target: number;
}

export type BlacksmithRankId = 'apprentice' | 'journeyman' | 'artisan' | 'grandmaster' | 'godsmith';

export interface BlacksmithRankInfo {
  id: BlacksmithRankId;
  level: number;
  titleZh: string;
  badgeIcon: string;
  requiredExp: number;
  perksZh: string[];
  colorClass: string;
  borderClass: string;
  bgGradient: string;
  bonusTitle: string;
}

export type AchievementCategory = 'all' | 'forge' | 'defense' | 'wealth' | 'extreme' | 'mastery';

export interface Achievement {
  id: string;
  titleZh: string;
  descriptionZh: string;
  category: 'forge' | 'defense' | 'wealth' | 'extreme' | 'mastery';
  progress: number;
  target: number;
  isUnlocked: boolean;
  unlockedTitleZh: string; // 特殊的鐵匠稱號
  badgeIcon: string;       // 對應徽章
  badgeColorClass: string;
  rewardGold: number;
  unlockedAt?: string;
}

export interface EquippedTitleBadge {
  id: string;
  titleZh: string;
  badgeIcon: string;
  badgeColorClass: string;
}
