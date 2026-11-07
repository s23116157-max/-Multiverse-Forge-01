/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  WorldType,
  CustomerOrder,
  MaterialItem,
  ThiefEntity,
  FacilityUpgrades,
  Quest,
  DailySummary,
  FusionRecipe,
  TrapSlot,
  TrapType,
  TrapEngineering,
  BlacksmithRankInfo,
  Achievement,
  EquippedTitleBadge,
  FlyingLootEffect,
} from './types/game';
import {
  INITIAL_MATERIALS,
  SAMPLE_ORDERS_POOL,
  INITIAL_QUESTS,
  getBlacksmithRank,
  getNextBlacksmithRank,
  INITIAL_ACHIEVEMENTS,
  generateThiefSpecialDrop,
} from './data/gameData';
import { ForgeScene } from './components/ForgeScene';
import { UpgradesModal } from './components/UpgradesModal';
import { DailySettlementModal } from './components/DailySettlementModal';
import { WarehouseModal } from './components/WarehouseModal';
import { ShopModal } from './components/ShopModal';
import { QuestsModal } from './components/QuestsModal';
import { DesignReferenceModal } from './components/DesignReferenceModal';
import { BlacksmithRankModal } from './components/BlacksmithRankModal';
import { AchievementsModal } from './components/AchievementsModal';
import { sound } from './audio/soundManager';

export default function App() {
  // Game state matching the mockups (Day 3, Gold 1,500, Reputation 4 Stars)
  const [day, setDay] = useState<number>(3);
  const [gold, setGold] = useState<number>(1500);
  const [reputation, setReputation] = useState<number>(4);
  const [activeWorld, setActiveWorld] = useState<WorldType>('SCIFI');

  // Materials inventory
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);

  // Facility and Skill Upgrades (matching Image 2 initial states + Trap Level 1 unlocked)
  const [upgrades, setUpgrades] = useState<FacilityUpgrades>({
    furnaceLevel: 3,
    anvilLevel: 2,
    bellowsPowerLevel: 1,
    quenchTankLevel: 1,
    securityScanLevel: 0,
    trapLevel: 1,
    sentryGolemLevel: 0,
    flyingHammerMastery: 1,
    warehouseLevel: 1,
    portalStabilizerLevel: 1,
    guildCharmLevel: 0,
    skillPrecision: 2,
    skillHaste: 1,
    comboArtisanLevel: 1,
  });

  // Entrance Traps Configuration
  const [traps, setTraps] = useState<TrapSlot[]>([
    {
      id: 'trap_slot_1',
      xPercent: 22,
      type: 'spike_trap',
      isArmed: true,
      cooldownRemaining: 0,
      maxCooldown: 7,
    },
    {
      id: 'trap_slot_2',
      xPercent: 30,
      type: 'stasis_trap',
      isArmed: true,
      cooldownRemaining: 0,
      maxCooldown: 6,
    },
  ]);

  // Trap Engineering & Crafting Upgrades
  const [engineering, setEngineering] = useState<TrapEngineering>({
    spikeDamageLevel: 1,    // Lv 1-3: 1.5 -> 2.5 -> 3.5 damage
    spikeKnockbackLevel: 1, // Lv 1-3: 5% -> 9% -> 14% knockback
    stasisDurationLevel: 1, // Lv 1-3: 6s -> 9s -> 12s duration
    stasisSlowRateLevel: 1, // Lv 1-3: -65% -> -75% -> -85% speed penalty
    tarLootDropLevel: 1,    // Lv 1-3: drops gold bounty 60G -> 120G -> 180G
    rearmSpeedLevel: 1,     // Lv 1-3: -20% -> -35% -> -50% cooldown
    trapOverchargeLevel: 1, // Lv 1-3: 25% -> 40% -> 55% chance for AoE shockwave
    reconDroneLevel: 0,     // Lv 0-3: 0 (未部署) -> 1 (光學雷達預警) -> 2 (破除偽裝與隱形) -> 3 (弱點標記+探照燈減速易傷)
    autoCycleReloadLevel: 0,// Lv 0-3: 0 (未解鎖需手動補齊) -> 1 (機關自動循環 15G) -> 2 (高壓微型彈匣 10G) -> 3 (萬界量子供彈 5G 且冷卻額外-15%)
    trapChainReactionLevel: 0, // Lv 0-3: 0 (未解鎖) -> 1 (35% 鄰近連鎖) -> 2 (60% 連鎖防禦) -> 3 (85% 完美連鎖共鳴)
    unlockedAsphalt: false, // 『黏著瀝青陷阱』(可於工藝研發解鎖)
    unlockedTeslaMine: false, // 『超導雷暴地雷』
    unlockedCryo: false,    // 『零度霜凍陷阱』
    unlockedVortex: false,  // 『次元折疊漩渦』
  });

  // Autonomous Recon Drone Early Warning Alert
  const [reconDroneAlert, setReconDroneAlert] = useState<{
    active: boolean;
    message: string;
  } | null>(null);

  // Automated Trap Cycle Reload Notification
  const [autoReloadNotice, setAutoReloadNotice] = useState<{
    trapId: string;
    cost: number;
    timestamp: number;
  } | null>(null);

  // Trap Chain Reaction Alert
  const [chainReactionAlert, setChainReactionAlert] = useState<{
    active: boolean;
    count: number;
    timestamp: number;
  } | null>(null);

  // Blacksmith Rank & Forge Mastery Experience
  const [forgeExp, setForgeExp] = useState<number>(120);
  const [isRankModalOpen, setIsRankModalOpen] = useState<boolean>(false);
  const [rankUpAlert, setRankUpAlert] = useState<{
    oldRank: BlacksmithRankInfo;
    newRank: BlacksmithRankInfo;
    timestamp: number;
  } | null>(null);

  // Auto-dismiss chainReactionAlert after 2.5 seconds
  useEffect(() => {
    if (!chainReactionAlert) return;
    const t = setTimeout(() => setChainReactionAlert(null), 2500);
    return () => clearTimeout(t);
  }, [chainReactionAlert]);

  // Auto-dismiss rankUpAlert after 4.5 seconds
  useEffect(() => {
    if (!rankUpAlert) return;
    const t = setTimeout(() => setRankUpAlert(null), 4500);
    return () => clearTimeout(t);
  }, [rankUpAlert]);

  // Long-term Achievements System
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [equippedTitleBadge, setEquippedTitleBadge] = useState<EquippedTitleBadge | null>({
    id: 'init_apprentice',
    titleZh: '萬界初階學徒',
    badgeIcon: '⚒️',
    badgeColorClass: 'text-amber-300 border-amber-600 bg-amber-950/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]',
  });
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [newAchievementAlert, setNewAchievementAlert] = useState<{
    achievement: Achievement;
    timestamp: number;
  } | null>(null);

  // Cumulative Lifetime Stats Tracking (Day 3 start)
  const [lifetimeStats, setLifetimeStats] = useState({
    ordersForged: 8,
    consecutiveDefenseDays: 2,
    thievesDefeated: 5,
    extremeOrders: 0,
    perfectStrikes: 14,
  });

  // Auto-dismiss newAchievementAlert after 5.5 seconds
  useEffect(() => {
    if (!newAchievementAlert) return;
    const t = setTimeout(() => setNewAchievementAlert(null), 5500);
    return () => clearTimeout(t);
  }, [newAchievementAlert]);

  // Method to check and update achievement progress
  const updateAchievementProgress = (
    key: 'forge' | 'defense_days' | 'thief' | 'wealth' | 'extreme' | 'rhythm' | 'godsmith',
    value: number
  ) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        let currentProg = ach.progress;
        let shouldCheck = false;

        if (key === 'forge' && ach.id === 'ach_forge_50') {
          currentProg = value;
          shouldCheck = true;
        } else if (key === 'defense_days' && ach.id === 'ach_defense_5_days') {
          currentProg = Math.max(ach.progress, value);
          shouldCheck = true;
        } else if (key === 'thief' && ach.id === 'ach_thief_slayer_30') {
          currentProg = value;
          shouldCheck = true;
        } else if (key === 'wealth' && ach.id === 'ach_wealth_10k') {
          currentProg = Math.max(ach.progress, value);
          shouldCheck = true;
        } else if (key === 'extreme' && ach.id === 'ach_extreme_10') {
          currentProg = value;
          shouldCheck = true;
        } else if (key === 'rhythm' && ach.id === 'ach_perfect_rhythm') {
          currentProg = value;
          shouldCheck = true;
        } else if (key === 'godsmith' && ach.id === 'ach_godsmith_tier') {
          currentProg = value;
          shouldCheck = true;
        }

        if (shouldCheck) {
          const reached = currentProg >= ach.target;
          if (reached && !ach.isUnlocked) {
            sound.playMultiverseSurge();
            sound.playCoins();
            setGold((g) => g + ach.rewardGold);
            const unlockedAch: Achievement = {
              ...ach,
              progress: currentProg,
              isUnlocked: true,
              unlockedAt: `Day ${day}`,
            };
            setNewAchievementAlert({
              achievement: unlockedAch,
              timestamp: Date.now(),
            });

            // Automatically equip new title & badge
            setEquippedTitleBadge({
              id: ach.id,
              titleZh: ach.unlockedTitleZh,
              badgeIcon: ach.badgeIcon,
              badgeColorClass: ach.badgeColorClass,
            });

            return unlockedAch;
          }
          return { ...ach, progress: currentProg };
        }

        return ach;
      })
    );
  };

  // Sync initial achievement progress on mount
  useEffect(() => {
    updateAchievementProgress('forge', lifetimeStats.ordersForged);
    updateAchievementProgress('defense_days', lifetimeStats.consecutiveDefenseDays);
    updateAchievementProgress('thief', lifetimeStats.thievesDefeated);
    updateAchievementProgress('wealth', gold);
    updateAchievementProgress('rhythm', lifetimeStats.perfectStrikes);
  }, []);

  const handleEquipTitleBadge = (achievement: Achievement | null) => {
    if (!achievement) {
      setEquippedTitleBadge(null);
      return;
    }
    setEquippedTitleBadge({
      id: achievement.id,
      titleZh: achievement.unlockedTitleZh,
      badgeIcon: achievement.badgeIcon,
      badgeColorClass: achievement.badgeColorClass,
    });
  };

  // Current customer order
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder | null>(null);

  // Active thieves in shop
  const [thieves, setThieves] = useState<ThiefEntity[]>([]);

  // Special loot floating animation icons
  const [flyingLoots, setFlyingLoots] = useState<FlyingLootEffect[]>([]);

  // Quests
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  // Customer order history log
  const [customerHistory, setCustomerHistory] = useState<
    { name: string; weapon: string; gold: number; time: string }[]
  >([
    {
      name: '巴隆·鐵錘 (Baron Ironbeard)',
      weapon: '黑曜電漿重錘',
      gold: 380,
      time: 'Day 2 · 18:30',
    },
    {
      name: '艾莉西亞 (Aelicia Swiftarrow)',
      weapon: '月光精靈長弓',
      gold: 310,
      time: 'Day 2 · 14:15',
    },
  ]);

  // Daily statistics for GDD settlement
  const [dailyStats, setDailyStats] = useState<{
    ordersCompleted: number;
    ordersFailed: number;
    thievesDefeated: number;
    itemsStolen: number;
    trapsTriggered: number;
    totalGoldEarned: number;
    masterMedallionsEarned: number;
  }>({
    ordersCompleted: 0,
    ordersFailed: 0,
    thievesDefeated: 0,
    itemsStolen: 0,
    trapsTriggered: 0,
    totalGoldEarned: 0,
    masterMedallionsEarned: 0,
  });

  // Extreme Forge Mode State
  const [isExtremeMode, setIsExtremeMode] = useState<boolean>(false);
  const [extremeRewardNotice, setExtremeRewardNotice] = useState<{
    rep: number;
    medallions: number;
    timestamp: number;
  } | null>(null);

  // Modals state
  const [isUpgradesOpen, setIsUpgradesOpen] = useState<boolean>(false);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState<boolean>(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState<boolean>(false);
  const [settlementSummary, setSettlementSummary] = useState<DailySummary | null>(null);

  // Order Pool Index Tracker
  const orderIndexRef = useRef<number>(0);
  const goldRef = useRef<number>(gold);
  goldRef.current = gold;
  const engineeringRef = useRef<TrapEngineering>(engineering);
  engineeringRef.current = engineering;

  // Spawn Next Customer Order
  const spawnNextOrder = useCallback(() => {
    // Filter matching world if possible, or fallback to any
    const candidates = SAMPLE_ORDERS_POOL.filter((o) => o.world === activeWorld);
    const pool = candidates.length > 0 ? candidates : SAMPLE_ORDERS_POOL;

    const template = pool[orderIndexRef.current % pool.length];
    orderIndexRef.current++;

    const currentRank = getBlacksmithRank(forgeExp);
    const extraPatience = currentRank.level >= 2 ? 4 : 0; // Rank 2+ patience perk (+4s)

    const newOrder: CustomerOrder = {
      ...template,
      id: `order_${Date.now()}`,
      timeRemaining: template.maxTime + extraPatience,
      maxTime: template.maxTime + extraPatience,
    };

    setCurrentOrder(newOrder);
  }, [activeWorld, forgeExp]);

  // Special Drop Delivery on Thief Defeat (各世界專屬稀有合成材料掉落機制)
  const triggerThiefSpecialDrop = useCallback((thief: ThiefEntity) => {
    if (!thief.specialDrop) return;
    const drop = thief.specialDrop;

    // 1. Credit directly into player's inventory
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === drop.materialId
          ? { ...m, count: m.count + drop.count }
          : m
      )
    );

    // 2. Sound effect
    sound.playSpecialDrop();

    // 3. Add to flying loots animated overlay
    const newLoot: FlyingLootEffect = {
      id: `loot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      startX: thief.xPercent || 25,
      startY: thief.yPercent || 15,
      icon: drop.icon,
      materialNameZh: drop.materialNameZh,
      count: drop.count,
      world: drop.world,
      thiefNameZh: thief.nameZh,
      timestamp: Date.now(),
    };

    setFlyingLoots((prev) => [...prev, newLoot]);

    // 4. Auto-dismiss after 2.3 seconds
    setTimeout(() => {
      setFlyingLoots((prev) => prev.filter((l) => l.id !== newLoot.id));
    }, 2300);
  }, []);

  // Initial order spawn on mount
  useEffect(() => {
    if (!currentOrder) {
      spawnNextOrder();
    }
  }, [spawnNextOrder, currentOrder]);

  // Customer Patience Timer Loop (Extreme Mode doubles decay rate)
  useEffect(() => {
    if (!currentOrder || isSettlementOpen) return;

    const timer = setInterval(() => {
      setCurrentOrder((prev) => {
        if (!prev) return null;
        // In Extreme Mode, customer patience depletes 2x as fast!
        const decay = (1 - upgrades.skillHaste * 0.05) * (isExtremeMode ? 2.0 : 1.0);
        const remaining = prev.timeRemaining - decay;

        if (remaining <= 0) {
          // Customer impatient and stormed out
          sound.playHammerHit('MISS');
          setDailyStats((s) => ({ ...s, ordersFailed: s.ordersFailed + 1 }));
          setReputation((r) => Math.max(1, r - 1));

          // Spawn next customer after delay
          setTimeout(() => spawnNextOrder(), 1200);
          return null;
        }

        return { ...prev, timeRemaining: remaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentOrder, isSettlementOpen, upgrades.skillHaste, spawnNextOrder, isExtremeMode]);

  // Dismiss extremeRewardNotice after 3.5 seconds
  useEffect(() => {
    if (!extremeRewardNotice) return;
    const t = setTimeout(() => setExtremeRewardNotice(null), 3500);
    return () => clearTimeout(t);
  }, [extremeRewardNotice]);

  // Thief Spawn Loop
  useEffect(() => {
    if (isSettlementOpen) return;

    const thiefTimer = setInterval(() => {
      // Small chance to spawn thief if none currently sneaking
      if (Math.random() < 0.6 && thieves.length === 0) {
        // Check Security System Auto-Deterrence
        if (upgrades.securityScanLevel > 0) {
          const deterChance = upgrades.securityScanLevel * 0.25;
          if (Math.random() < deterChance) {
            // Deterred!
            sound.playThiefAlert();
            return;
          }
        }

        // Determine if incoming thief is cloaked/disguised
        const isDisguised = Math.random() < 0.55;
        const thiefTypes: ThiefEntity['type'][] = ['goblin', 'hacker', 'rat'];
        const chosenType = thiefTypes[Math.floor(Math.random() * thiefTypes.length)];

        const namesByType: Record<ThiefEntity['type'], { normal: string; disguised: string }> = {
          goblin: {
            normal: '貪婪哥布林盜賊 (Greedy Goblin)',
            disguised: '隱身哥布林密探 (Cloaked Goblin)',
          },
          hacker: {
            normal: '流浪賽博盜客 (Cyber Hacker)',
            disguised: '虛空幽靈駭客 (Ghost Hacker)',
          },
          rat: {
            normal: '廢土拾荒老鼠 (Wasteland Rat)',
            disguised: '擬態拾荒鼠輩 (Camouflage Rat)',
          },
        };

        const chosenName = isDisguised ? namesByType[chosenType].disguised : namesByType[chosenType].normal;
        const { world: dropWorld, drop: specialDrop } = generateThiefSpecialDrop(chosenType);

        let isRevealed = false;
        let disguised = isDisguised;
        let isSlowed = false;
        let slowDuration = 0;

        // Autonomous Recon Patrol Drone Scanner Trigger
        if (engineering.reconDroneLevel > 0) {
          isRevealed = true;
          sound.playDroneRadar();
          sound.playAlarmAlert();

          if (engineering.reconDroneLevel >= 2) {
            disguised = false; // anti-stealth spotlight breaks camouflage!
          }
          if (engineering.reconDroneLevel >= 3) {
            isSlowed = true;
            slowDuration = 8.0; // spotlight stasis
          }

          setReconDroneAlert({
            active: true,
            message: isDisguised
              ? '🚨【巡邏偵察機】雷達鎖定外圍入侵！全光譜探照已強制破除隱身偽裝！'
              : '🚨【巡邏偵察機】雷達警報：偵測到外圍盜賊！已標記弱點鎖定！',
          });
          setTimeout(() => setReconDroneAlert(null), 3800);
        } else {
          sound.playThiefAlert();
        }

        const newThief: ThiefEntity = {
          id: `thief_${Date.now()}`,
          type: chosenType,
          world: dropWorld,
          specialDrop,
          nameZh: chosenName,
          hp: 2,
          maxHp: 2,
          xPercent: 16,
          yPercent: 12,
          direction: 'in',
          state: 'sneaking',
          speed: 1.5,
          isDisguised: disguised,
          isRevealed,
          isSlowed,
          slowDuration,
        };

        setThieves([newThief]);
      }
    }, 14000);

    return () => clearInterval(thiefTimer);
  }, [thieves.length, upgrades.securityScanLevel, engineering.reconDroneLevel, isSettlementOpen]);

  // Trap Cooldown / Automated Cycle Reload Loop
  useEffect(() => {
    const trapCdTimer = setInterval(() => {
      const currentEng = engineeringRef.current;
      const autoReloadLevel = currentEng.autoCycleReloadLevel || 0;

      setTraps((prev) =>
        prev.map((t) => {
          // If trap is disarmed and cooling down
          if (!t.isArmed && t.cooldownRemaining > 0) {
            const nextRemaining = Math.max(0, t.cooldownRemaining - 0.2);

            // Did cooldown just finish?
            if (nextRemaining <= 0) {
              if (autoReloadLevel > 0) {
                const reloadCost = autoReloadLevel === 1 ? 15 : autoReloadLevel === 2 ? 10 : 5;
                if (goldRef.current >= reloadCost) {
                  // Sufficient resources: deduct gold and automatically cycle reload!
                  goldRef.current -= reloadCost;
                  setGold((g) => Math.max(0, g - reloadCost));
                  sound.playAutoReload();
                  setAutoReloadNotice({
                    trapId: t.id,
                    cost: reloadCost,
                    timestamp: Date.now(),
                  });
                  return {
                    ...t,
                    cooldownRemaining: 0,
                    isArmed: true,
                  };
                } else {
                  // Gold insufficient: wait for gold or manual reload
                  return {
                    ...t,
                    cooldownRemaining: 0,
                    isArmed: false,
                  };
                }
              } else {
                // No auto-cycle reload: requires manual rearm
                return {
                  ...t,
                  cooldownRemaining: 0,
                  isArmed: false,
                };
              }
            }

            return {
              ...t,
              cooldownRemaining: nextRemaining,
              isArmed: false,
            };
          }

          // If trap was disarmed at 0 cooldown (e.g. from insufficient gold previously) and player now has gold & autoReload
          if (!t.isArmed && t.cooldownRemaining <= 0 && autoReloadLevel > 0) {
            const reloadCost = autoReloadLevel === 1 ? 15 : autoReloadLevel === 2 ? 10 : 5;
            if (goldRef.current >= reloadCost) {
              goldRef.current -= reloadCost;
              setGold((g) => Math.max(0, g - reloadCost));
              sound.playAutoReload();
              setAutoReloadNotice({
                trapId: t.id,
                cost: reloadCost,
                timestamp: Date.now(),
              });
              return {
                ...t,
                cooldownRemaining: 0,
                isArmed: true,
              };
            }
          }

          return t;
        })
      );
    }, 200);

    return () => clearInterval(trapCdTimer);
  }, []);

  // Dismiss autoReloadNotice after 2.2 seconds
  useEffect(() => {
    if (!autoReloadNotice) return;
    const t = setTimeout(() => setAutoReloadNotice(null), 2200);
    return () => clearTimeout(t);
  }, [autoReloadNotice]);

  // Autonomous Sentry Golem Defense Loop (Attacks thieves automatically)
  useEffect(() => {
    if ((upgrades.sentryGolemLevel || 0) <= 0 || thieves.length === 0 || isSettlementOpen) return;

    const fireInterval = Math.max(2500, 5000 - (upgrades.sentryGolemLevel || 0) * 800);
    const golemTimer = setInterval(() => {
      setThieves((prev) => {
        const target = prev.find((t) => t.state !== 'defeated' && t.xPercent >= 16);
        if (!target) return prev;

        sound.playGolemZap();
        const golemDmg = 1.0 + ((upgrades.sentryGolemLevel || 0) - 1) * 0.5;

        return prev
          .map((t) => {
            if (t.id !== target.id) return t;
            const nextHp = t.hp - golemDmg;
            if (nextHp <= 0) {
              sound.playThiefDefeated();
              sound.playCoins();
              triggerThiefSpecialDrop(t);
              const bounty = 180 + day * 30 + ((upgrades.guildCharmLevel || 0) * 80);
              setGold((g) => g + bounty);
              setDailyStats((s) => ({
                ...s,
                thievesDefeated: s.thievesDefeated + 1,
                totalGoldEarned: s.totalGoldEarned + bounty,
              }));
              updateQuestProgress('q2', 1);
              return null;
            }
            return {
              ...t,
              hp: nextHp,
              xPercent: Math.max(10, t.xPercent - 7),
              state: 'stunned' as const,
            };
          })
          .filter(Boolean) as ThiefEntity[];
      });
    }, fireInterval);

    return () => clearInterval(golemTimer);
  }, [upgrades.sentryGolemLevel, upgrades.guildCharmLevel, thieves.length, isSettlementOpen, day]);

  // Thief Movement AI & Trap Collision Loop
  useEffect(() => {
    if (thieves.length === 0 || isSettlementOpen) return;

    const moveTimer = setInterval(() => {
      setThieves((prev) => {
        return prev
          .map((thief) => {
            if (thief.state === 'defeated') return null;

            // Handle Stunned state decay
            if (thief.state === 'stunned') {
              return {
                ...thief,
                state: thief.direction === 'out' ? 'fleeing' : 'sneaking',
              };
            }

            // Handle Frozen state decay (Cryo Freeze Trap effect)
            let isFrozen = thief.isFrozen;
            let freezeDuration = thief.freezeDuration;
            if (isFrozen && freezeDuration !== undefined) {
              freezeDuration -= 0.15;
              if (freezeDuration <= 0) {
                isFrozen = false;
              }
            }

            // Handle Immobilized state decay (Asphalt Trap effect)
            let isImmobilized = thief.isImmobilized;
            let immobilizeDuration = thief.immobilizeDuration;
            if (isImmobilized && immobilizeDuration !== undefined) {
              immobilizeDuration -= 0.15;
              if (immobilizeDuration <= 0) {
                isImmobilized = false;
              }
            }

            // Handle Slowed state decay
            let isSlowed = thief.isSlowed;
            let slowDuration = thief.slowDuration;
            if (isSlowed && slowDuration !== undefined) {
              slowDuration -= 0.15;
              if (slowDuration <= 0) {
                isSlowed = false;
              }
            }

            let x = thief.xPercent;
            let dir = thief.direction;
            let state: ThiefEntity['state'] = thief.state;
            let hp = thief.hp;
            let isDisguised = thief.isDisguised;
            let isRevealed = thief.isRevealed;

            // Autonomous Recon Drone in-flight detection
            if ((engineering.reconDroneLevel || 0) > 0 && !isRevealed && x <= 28) {
              isRevealed = true;
              sound.playDroneRadar();
              sound.playAlarmAlert();
              if ((engineering.reconDroneLevel || 0) >= 2) {
                isDisguised = false; // anti-stealth spotlight
              }
              setReconDroneAlert({
                active: true,
                message: '🚨【巡邏偵察機】雷達鎖定外圍入侵！全光譜探照已強制破除隱身偽裝！',
              });
              setTimeout(() => setReconDroneAlert(null), 3500);
            }

            // Calculate effective movement speed based on engineering slow rate
            const slowMultiplier = engineering.stasisSlowRateLevel === 1 ? 0.35 : engineering.stasisSlowRateLevel === 2 ? 0.25 : 0.15;
            let baseSpeed = dir === 'in' ? 1.8 : 2.2;
            if ((engineering.reconDroneLevel || 0) >= 3 && isRevealed) {
              baseSpeed *= 0.75; // Drone level 3 spotlight pressure slow
            }
            const currentSmithRank = getBlacksmithRank(forgeExp);
            if (currentSmithRank.level >= 5) {
              baseSpeed *= 0.8; // Rank 5 Godsmith Aura slows thieves by 20%!
            }
            const effectiveSpeed = (isImmobilized || isFrozen) ? 0 : isSlowed ? baseSpeed * slowMultiplier : baseSpeed;

            if (dir === 'in') {
              x += effectiveSpeed;

              // Check Collision with Armed Entrance Traps
              const activeTrapCount = upgrades.trapLevel >= 2 ? 2 : upgrades.trapLevel >= 1 ? 1 : 0;
              for (let i = 0; i < activeTrapCount; i++) {
                const trap = traps[i];
                if (trap && trap.isArmed && Math.abs(x - trap.xPercent) <= 3.8) {
                  // Trigger Trap! Apply rearm speed accelerator upgrade and quantum cycle reload bonus
                  let rearmFactor = 1 - ((engineering.rearmSpeedLevel || 1) - 1) * 0.15;
                  if ((engineering.autoCycleReloadLevel || 0) >= 3) {
                    rearmFactor *= 0.85; // Lv 3 quantum cycle bonus: -15% extra cooldown
                  }
                  const trapBaseCd = upgrades.trapLevel >= 3 ? trap.maxCooldown * 0.6 : trap.maxCooldown;
                  const trapCd = Math.max(1.8, trapBaseCd * rearmFactor);

                  setTraps((currTraps) =>
                    currTraps.map((t) =>
                      t.id === trap.id ? { ...t, isArmed: false, cooldownRemaining: trapCd } : t
                    )
                  );

                  setDailyStats((s) => ({
                    ...s,
                    trapsTriggered: s.trapsTriggered + 1,
                  }));

                  // Trap Specific Effects with Engineering Stats
                  if (trap.type === 'spike_trap') {
                    sound.playTrapSnap();
                    const dmg = engineering.spikeDamageLevel === 1 ? 1.5 : engineering.spikeDamageLevel === 2 ? 2.5 : 3.5;
                    const kb = engineering.spikeKnockbackLevel === 1 ? 5 : engineering.spikeKnockbackLevel === 2 ? 9 : 14;
                    hp -= dmg;
                    x = Math.max(8, x - kb);
                  } else if (trap.type === 'stasis_trap') {
                    sound.playTrapShock();
                    hp -= 0.5;
                    isSlowed = true;
                    slowDuration = engineering.stasisDurationLevel === 1 ? 6.0 : engineering.stasisDurationLevel === 2 ? 9.0 : 12.0;
                  } else if (trap.type === 'oil_tar_trap') {
                    sound.playTrapSplash();
                    state = 'stunned';
                    x = Math.max(10, x - 7);
                    // Loot drop + bonus bounty from engineering
                    const extraBounty = engineering.tarLootDropLevel * 60;
                    setGold((g) => g + extraBounty);
                    sound.playCoins();
                    thief.stolenGold = 0;
                  } else if (trap.type === 'asphalt_trap') {
                    // 『黏著瀝青陷阱』: 100% 完全定身固化 4 秒
                    sound.playTrapAsphalt();
                    isImmobilized = true;
                    immobilizeDuration = 4.0;
                    hp -= 0.5;
                  } else if (trap.type === 'tesla_mine') {
                    // 『超導雷暴地雷』: 2.5 HP 巨額雷暴打擊 + 炸退
                    sound.playTrapTeslaExplode();
                    hp -= 2.5;
                    state = 'stunned';
                    x = Math.max(8, x - 10);
                  } else if (trap.type === 'cryo_trap') {
                    // 『零度霜凍陷阱』: 3.5 秒完全凍結 + 易傷
                    sound.playFreeze();
                    isFrozen = true;
                    freezeDuration = 3.5;
                    hp -= 1.0;
                  } else if (trap.type === 'vortex_trap') {
                    // 『次元折疊漩渦』: 彈回玄關大門外並擊落贓物
                    sound.playVortex();
                    x = 14;
                    state = 'stunned';
                    thief.stolenGold = 0;
                    hp -= 1.0;
                  }

                  // Trap Overcharge Shockwave
                  if (Math.random() < 0.25 + ((engineering.trapOverchargeLevel || 1) - 1) * 0.15) {
                    sound.playTrapShock();
                  }

                  // Trap Chain Reaction (連鎖啟動)
                  if ((engineering.trapChainReactionLevel || 0) > 0) {
                    const chainChance = (engineering.trapChainReactionLevel || 0) === 1 ? 0.35 : (engineering.trapChainReactionLevel || 0) === 2 ? 0.60 : 0.85;
                    if (Math.random() < chainChance) {
                      const companionTraps = traps.filter((ct) => ct.id !== trap.id && ct.isArmed);
                      if (companionTraps.length > 0) {
                        sound.playTrapShock();
                        hp -= 1.0;
                        x = Math.max(6, x - 8);
                        setChainReactionAlert({
                          active: true,
                          count: companionTraps.length,
                          timestamp: Date.now(),
                        });
                        setTraps((currTraps) =>
                          currTraps.map((t) =>
                            companionTraps.some((ct) => ct.id === t.id)
                              ? { ...t, isArmed: false, cooldownRemaining: Math.max(2, t.maxCooldown * 0.7) }
                              : t
                          )
                        );
                      }
                    }
                  }

                  break; // only trigger 1 trap at a time
                }
              }

              // Check if thief reached inventory target
              if (x >= 42) {
                dir = 'out';
                state = 'fleeing';
                thief.stolenGold = 120;
              }
            } else {
              x -= effectiveSpeed;
              if (x <= 6) {
                // Escaped!
                setDailyStats((s) => ({
                  ...s,
                  itemsStolen: s.itemsStolen + 1,
                }));
                setGold((g) => Math.max(0, g - (thief.stolenGold || 100)));
                setReputation((r) => Math.max(1, r - 1));
                return null;
              }
            }

            // Check if trap defeated thief
            if (hp <= 0) {
              sound.playThiefDefeated();
              sound.playCoins();
              triggerThiefSpecialDrop({ ...thief, xPercent: x });
              const bounty = 200 + day * 35;
              setGold((g) => g + bounty);
              setDailyStats((s) => ({
                ...s,
                thievesDefeated: s.thievesDefeated + 1,
                totalGoldEarned: s.totalGoldEarned + bounty,
              }));
              updateQuestProgress('q2', 1);
              return null;
            }

            return {
              ...thief,
              xPercent: x,
              direction: dir,
              state,
              hp,
              isDisguised,
              isRevealed,
              isSlowed,
              slowDuration,
              isImmobilized,
              immobilizeDuration,
            };
          })
          .filter(Boolean) as ThiefEntity[];
      });
    }, 150);

    return () => clearInterval(moveTimer);
  }, [thieves, traps, upgrades.trapLevel, engineering, isSettlementOpen, day]);

  // Handle Player Whacking Thief with Hammer
  const handleWhackThief = (thiefId: string) => {
    sound.playThiefHit();

    setThieves((prev) =>
      prev
        .map((t) => {
          if (t.id !== thiefId) return t;
          // Cryo Freeze Vulnerability: 2x damage, and Drone Lv 3 Weakness Mark: +1.0 dmg!
          let dmg = t.isFrozen ? 2 : 1;
          if ((engineering.reconDroneLevel || 0) >= 3 && t.isRevealed) {
            dmg += 1.0;
          }
          const nextHp = t.hp - dmg;

          if (nextHp <= 0) {
            // Defeated!
            sound.playThiefDefeated();
            sound.playCoins();
            triggerThiefSpecialDrop(t);

            const bounty = 180 + day * 30 + ((upgrades.guildCharmLevel || 0) * 80);
            setGold((g) => g + bounty);
            setDailyStats((s) => ({
              ...s,
              thievesDefeated: s.thievesDefeated + 1,
              totalGoldEarned: s.totalGoldEarned + bounty,
            }));

            // Lifetime Stats & Achievement progress
            setLifetimeStats((prev) => {
              const nextThieves = prev.thievesDefeated + 1;
              updateAchievementProgress('thief', nextThieves);
              updateAchievementProgress('wealth', gold + bounty);
              return { ...prev, thievesDefeated: nextThieves };
            });

            // Quest progress for defeating thieves
            updateQuestProgress('q2', 1);

            return null;
          }

          return {
            ...t,
            hp: nextHp,
            isRevealed: true,
            isDisguised: false,
            xPercent: Math.max(10, t.xPercent - 6), // knockback
            state: 'stunned' as const,
          };
        })
        .filter(Boolean) as ThiefEntity[]
    );
  };

  // Handle Throwing Hammer at Thief (Flying Hammer Mastery)
  const handleThrowHammer = (thiefId: string) => {
    sound.playHammerHit('PERFECT');

    setThieves((prev) =>
      prev
        .map((t) => {
          if (t.id !== thiefId) return t;
          let dmg = 1.0 + (upgrades.flyingHammerMastery || 0) * 0.7;
          if (t.isFrozen) dmg *= 2; // Frozen vulnerability!
          if ((engineering.reconDroneLevel || 0) >= 3 && t.isRevealed) {
            dmg += 1.0; // Drone Lv 3 Weakness Mark
          }

          const nextHp = t.hp - dmg;
          if (nextHp <= 0) {
            sound.playThiefDefeated();
            sound.playCoins();
            triggerThiefSpecialDrop(t);
            const bounty = 180 + day * 30 + ((upgrades.guildCharmLevel || 0) * 80);
            setGold((g) => g + bounty);
            setDailyStats((s) => ({
              ...s,
              thievesDefeated: s.thievesDefeated + 1,
              totalGoldEarned: s.totalGoldEarned + bounty,
            }));

            // Lifetime Stats & Achievement progress
            setLifetimeStats((prev) => {
              const nextThieves = prev.thievesDefeated + 1;
              updateAchievementProgress('thief', nextThieves);
              updateAchievementProgress('wealth', gold + bounty);
              return { ...prev, thievesDefeated: nextThieves };
            });

            updateQuestProgress('q2', 1);
            return null;
          }

          const knockbackDist = 6 + (upgrades.flyingHammerMastery || 0) * 4;
          return {
            ...t,
            hp: nextHp,
            isRevealed: true,
            isDisguised: false,
            xPercent: Math.max(8, t.xPercent - knockbackDist),
            state: 'stunned' as const,
          };
        })
        .filter(Boolean) as ThiefEntity[]
    );
  };

  // Update Quest Progress Helper
  const updateQuestProgress = (questId: string, amount: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.isCompleted) {
          return { ...q, progress: Math.min(q.target, q.progress + amount) };
        }
        return q;
      })
    );
  };

  // Claim Quest Reward
  const handleClaimQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.isCompleted) {
          setGold((g) => g + q.rewardGold);
          setReputation((r) => Math.min(5, r + 1));
          return { ...q, isCompleted: true };
        }
        return q;
      })
    );
  };

  // Toggle Connected World Portal
  const handleToggleWorld = () => {
    setActiveWorld((prev) => {
      if (prev === 'SCIFI') return 'FANTASY';
      if (prev === 'FANTASY') return 'STEAMPUNK';
      return 'SCIFI';
    });
  };

  // Complete Forging Session & Evaluate Score
  const handleCompleteForging = (qualityScore: number, matchBonus: number, perfectCount: number = 0) => {
    if (!currentOrder) return;

    // Deduct materials from inventory
    setMaterials((prev) =>
      prev.map((m) => {
        const req = currentOrder.requiredMaterials.find((r) => r.materialId === m.id);
        if (req) {
          return { ...m, count: Math.max(0, m.count - req.count) };
        }
        return m;
      })
    );

    // Blacksmith Rank Gold Multiplier & Perks
    const currentSmithRank = getBlacksmithRank(forgeExp);
    let rankGoldMultiplier = 1.0;
    if (currentSmithRank.level === 2) rankGoldMultiplier = 1.10;
    else if (currentSmithRank.level === 3) rankGoldMultiplier = 1.15;
    else if (currentSmithRank.level === 4) rankGoldMultiplier = 1.35;
    else if (currentSmithRank.level >= 5) rankGoldMultiplier = 1.60;

    const speedBonusRatio = currentOrder.timeRemaining / currentOrder.maxTime;
    const speedBonusGold = Math.round(currentOrder.baseGold * 0.25 * speedBonusRatio);

    const baseEarned = Math.round(currentOrder.baseGold * qualityScore * matchBonus + speedBonusGold);
    const guildTipMultiplier = 1 + ((upgrades.guildCharmLevel || 0) * 0.25);
    const earned = Math.round(baseEarned * guildTipMultiplier * rankGoldMultiplier);

    // Calculate Blacksmith EXP
    const expGained = Math.round(
      (currentOrder.baseGold * 0.65) * qualityScore * (isExtremeMode ? 1.5 : 1.0) +
      (qualityScore >= 1.3 ? 40 : 15)
    );
    const prevRank = getBlacksmithRank(forgeExp);
    const newTotalExp = forgeExp + expGained;
    setForgeExp(newTotalExp);
    const newRank = getBlacksmithRank(newTotalExp);

    if (newRank.level > prevRank.level) {
      sound.playMultiverseSurge();
      setRankUpAlert({
        oldRank: prevRank,
        newRank,
        timestamp: Date.now(),
      });
      updateAchievementProgress('godsmith', newRank.level);
    }

    setGold((g) => g + earned);

    // Update Lifetime Stats & Achievements
    setLifetimeStats((prev) => {
      const nextOrders = prev.ordersForged + 1;
      const nextExtreme = isExtremeMode ? prev.extremeOrders + 1 : prev.extremeOrders;
      const nextPerfect = prev.perfectStrikes + perfectCount;

      updateAchievementProgress('forge', nextOrders);
      if (isExtremeMode) {
        updateAchievementProgress('extreme', nextExtreme);
      }
      if (perfectCount > 0) {
        updateAchievementProgress('rhythm', nextPerfect);
      }
      updateAchievementProgress('wealth', gold + earned);

      return {
        ...prev,
        ordersForged: nextOrders,
        extremeOrders: nextExtreme,
        perfectStrikes: nextPerfect,
      };
    });
    // Extreme Mode: Double reputation gain (+2 stars instead of +1)!
    const repGain = isExtremeMode ? 2 : 1;
    setReputation((r) => Math.min(5, r + repGain));

    // Extreme Mode Reward: Exclusive 'Master Medallion' (宗師勳章) Material!
    // Grandmaster (Rank 4+) grants +1 extra medallion!
    let medallionsAwarded = 0;
    if (isExtremeMode) {
      medallionsAwarded = (qualityScore >= 1.3 ? 2 : 1) + (currentSmithRank.level >= 4 ? 1 : 0);
      setMaterials((prev) => {
        const exists = prev.find((m) => m.id === 'master_medallion');
        if (exists) {
          return prev.map((m) => (m.id === 'master_medallion' ? { ...m, count: m.count + medallionsAwarded } : m));
        }
        const newMedallion: MaterialItem = {
          id: 'master_medallion',
          name: 'Master Medallion',
          nameZh: '宗師勳章',
          world: 'UNIVERSAL',
          category: 'relic',
          icon: 'medal-gold',
          count: medallionsAwarded,
          basePrice: 240,
          descriptionZh: '『極限鐵匠模式』專屬傳奇素材！於顧客耐心翻倍縮減的極限考驗下淬火奪得，象徵頂尖宗師的無上實力與榮耀。',
        };
        return [...prev, newMedallion];
      });

      sound.playMultiverseSurge();
      setExtremeRewardNotice({
        rep: repGain,
        medallions: medallionsAwarded,
        timestamp: Date.now(),
      });
    }

    // Update Daily Stats
    const newCompletedCount = dailyStats.ordersCompleted + 1;
    setDailyStats((s) => ({
      ...s,
      ordersCompleted: newCompletedCount,
      totalGoldEarned: s.totalGoldEarned + earned,
      masterMedallionsEarned: s.masterMedallionsEarned + medallionsAwarded,
    }));

    // Add to Customer History Log
    setCustomerHistory((prev) => [
      {
        name: currentOrder.customerName,
        weapon: currentOrder.weaponNameZh,
        gold: earned,
        time: `Day ${day} · 剛剛${isExtremeMode ? ' (極限挑戰)' : ''}`,
      },
      ...prev.slice(0, 15),
    ]);

    // Update Quests
    updateQuestProgress('q1', 1);
    if (qualityScore >= 1.3) {
      updateQuestProgress('q3', 1);
    }

    // Check if daily quota (3 orders) reached for Daily Settlement!
    if (newCompletedCount >= 3) {
      setTimeout(() => {
        triggerDailySettlement(newCompletedCount);
      }, 1000);
    } else {
      setTimeout(() => spawnNextOrder(), 1200);
    }

    setCurrentOrder(null);
  };

  // Trigger End of Day Settlement Modal
  const triggerDailySettlement = (completedCount: number) => {
    // S grade condition from GDD: 0 stolen + all completed
    let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'B';
    if (dailyStats.itemsStolen === 0 && completedCount >= 3) {
      grade = 'S';
    } else if (dailyStats.itemsStolen <= 1) {
      grade = 'A';
    } else if (dailyStats.itemsStolen > 3) {
      grade = 'C';
    }

    const summary: DailySummary = {
      day,
      ordersCompleted: completedCount,
      ordersFailed: dailyStats.ordersFailed,
      thievesDefeated: dailyStats.thievesDefeated,
      itemsStolen: dailyStats.itemsStolen,
      trapsTriggered: dailyStats.trapsTriggered,
      totalGoldEarned: dailyStats.totalGoldEarned,
      totalReputationChange: isExtremeMode ? 2 : 1,
      grade,
      isExtremeMode,
      masterMedallionsEarned: dailyStats.masterMedallionsEarned,
    };

    setSettlementSummary(summary);
    setIsSettlementOpen(true);
  };

  // Advance to Next Day
  const handleNextDay = () => {
    // Update Consecutive Defense Days Achievement
    if (dailyStats.itemsStolen === 0) {
      setLifetimeStats((prev) => {
        const nextStreak = prev.consecutiveDefenseDays + 1;
        updateAchievementProgress('defense_days', nextStreak);
        return { ...prev, consecutiveDefenseDays: nextStreak };
      });
    } else {
      setLifetimeStats((prev) => ({ ...prev, consecutiveDefenseDays: 0 }));
    }

    setDay((d) => d + 1);
    setDailyStats({
      ordersCompleted: 0,
      ordersFailed: 0,
      thievesDefeated: 0,
      itemsStolen: 0,
      trapsTriggered: 0,
      totalGoldEarned: 0,
      masterMedallionsEarned: 0,
    });
    setIsSettlementOpen(false);

    // Rearm all traps for the new day
    setTraps((prev) =>
      prev.map((t) => ({
        ...t,
        isArmed: true,
        cooldownRemaining: 0,
      }))
    );

    // Replenish a few raw materials for next day
    setMaterials((prev) =>
      prev.map((m) => ({
        ...m,
        count: m.count + 2,
      }))
    );

    // Multiverse Guild Charm Daily Subsidy
    const dailySubsidy = (upgrades.guildCharmLevel || 0) * 120;
    if (dailySubsidy > 0) {
      setGold((g) => g + dailySubsidy);
      sound.playCoins();
    }

    spawnNextOrder();
  };

  // Upgrade Facility or Skill
  const handleUpgradeFacility = (key: keyof FacilityUpgrades, cost: number) => {
    if (gold < cost) return;

    sound.playCoins();
    sound.playHammerHit('PERFECT');

    setGold((g) => g - cost);
    setUpgrades((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));

    updateQuestProgress('q4', 1);
  };

  // Manual Adjust Material Count (+ / - buttons in image 2)
  const handleUpdateMaterialCount = (id: string, delta: number) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, count: Math.max(0, m.count + delta) } : m))
    );
  };

  // Melt Down Material for Ingot Scrap
  const handleMeltDownMaterial = (id: string) => {
    sound.playBellows();
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id && m.count > 0) {
          return { ...m, count: m.count - 1 };
        }
        if (m.id === 'star_metal') {
          return { ...m, count: m.count + 1 };
        }
        return m;
      })
    );
  };

  // Fusion Mixer Execution
  const handleFuseMaterials = (recipe: FusionRecipe) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === recipe.inputA || m.id === recipe.inputB) {
          return { ...m, count: Math.max(0, m.count - 1) };
        }
        return m;
      })
    );

    // Check if output material already exists or add it
    setMaterials((prev) => {
      const exists = prev.find((m) => m.id === recipe.outputId);
      if (exists) {
        return prev.map((m) => (m.id === recipe.outputId ? { ...m, count: m.count + 1 } : m));
      }
      const newFusedItem: MaterialItem = {
        id: recipe.outputId,
        name: recipe.nameZh,
        nameZh: recipe.nameZh,
        world: 'UNIVERSAL',
        category: 'fused',
        icon: 'core-blue',
        count: 1,
        basePrice: 160,
        descriptionZh: recipe.descriptionZh,
      };
      return [...prev, newFusedItem];
    });
  };

  // Buy Goods in Shop
  const handleBuyMaterial = (materialId: string, quantity: number, totalCost: number) => {
    if (gold < totalCost) return;
    setGold((g) => g - totalCost);
    setMaterials((prev) =>
      prev.map((m) => (m.id === materialId ? { ...m, count: m.count + quantity } : m))
    );
  };

  // Switch Trap Type on Slot
  const handleSelectTrapType = (slotId: string, newType: TrapType) => {
    sound.playCoins();
    setTraps((prev) =>
      prev.map((t) => (t.id === slotId ? { ...t, type: newType } : t))
    );
  };

  // Manually rearm or refresh trap slot
  const handleManualRearm = (slotId: string) => {
    sound.playCoins();
    setTraps((prev) =>
      prev.map((t) => (t.id === slotId ? { ...t, isArmed: true, cooldownRemaining: 0 } : t))
    );
  };

  // Upgrade Trap Engineering performance stats
  const handleUpgradeEngineering = (field: keyof TrapEngineering, cost: number) => {
    if (gold < cost) return;
    sound.playCoins();
    sound.playHammerHit('PERFECT');
    if (field === 'reconDroneLevel') {
      sound.playDroneRadar();
    }
    if (field === 'autoCycleReloadLevel') {
      sound.playAutoReload();
    }
    setGold((g) => g - cost);
    setEngineering((prev) => ({
      ...prev,
      [field]: (prev[field] as number) + 1,
    }));
  };

  // Unlock Advanced Trap types (Asphalt / Tesla Mine / Cryo / Vortex)
  const handleUnlockTrapType = (type: 'asphalt' | 'tesla' | 'cryo' | 'vortex', cost: number) => {
    if (gold < cost) return;
    sound.playCoins();
    sound.playHammerHit('PERFECT');
    setGold((g) => g - cost);
    setEngineering((prev) => ({
      ...prev,
      unlockedAsphalt: type === 'asphalt' ? true : prev.unlockedAsphalt,
      unlockedTeslaMine: type === 'tesla' ? true : prev.unlockedTeslaMine,
      unlockedCryo: type === 'cryo' ? true : prev.unlockedCryo,
      unlockedVortex: type === 'vortex' ? true : prev.unlockedVortex,
    }));
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-stone-950 font-sans">
      {/* Active Forge Scene */}
      <ForgeScene
        currentOrder={currentOrder}
        day={day}
        gold={gold}
        reputation={reputation}
        activeWorld={activeWorld}
        materials={materials}
        thieves={thieves}
        flyingLoots={flyingLoots}
        traps={traps}
        upgrades={upgrades}
        engineering={engineering}
        reconDroneAlert={reconDroneAlert}
        autoReloadNotice={autoReloadNotice}
        chainReactionAlert={chainReactionAlert}
        rankUpAlert={rankUpAlert}
        newAchievementAlert={newAchievementAlert}
        equippedTitleBadge={equippedTitleBadge}
        forgeExp={forgeExp}
        onOpenRankModal={() => setIsRankModalOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        isExtremeMode={isExtremeMode}
        onToggleExtremeMode={() => {
          sound.playCoins();
          setIsExtremeMode((prev) => !prev);
        }}
        extremeRewardNotice={extremeRewardNotice}
        onToggleWorld={handleToggleWorld}
        onWhackThief={handleWhackThief}
        onThrowHammer={handleThrowHammer}
        onSelectTrapType={handleSelectTrapType}
        onManualRearm={handleManualRearm}
        onCompleteForging={handleCompleteForging}
        onOpenUpgrades={() => setIsUpgradesOpen(true)}
        onOpenWarehouse={() => setIsWarehouseOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenQuests={() => setIsQuestsOpen(true)}
        onOpenReference={() => setIsReferenceOpen(true)}
      />

      {/* Long-Term Achievements & Special Blacksmith Titles Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
        equippedTitleBadge={equippedTitleBadge}
        onEquipTitleBadge={handleEquipTitleBadge}
      />

      {/* Blacksmith Rank Progression Modal */}
      <BlacksmithRankModal
        isOpen={isRankModalOpen}
        onClose={() => setIsRankModalOpen(false)}
        forgeExp={forgeExp}
        totalOrdersCompleted={dailyStats.ordersCompleted}
        masterMedallionsCount={materials.find((m) => m.id === 'master_medallion')?.count || 0}
      />

      {/* Upgrades & Fusion Modal (Matches Image 2 + Trap Engineering Tab) */}
      <UpgradesModal
        isOpen={isUpgradesOpen}
        onClose={() => setIsUpgradesOpen(false)}
        day={day}
        gold={gold}
        reputation={reputation}
        materials={materials}
        upgrades={upgrades}
        engineering={engineering}
        onUpgradeFacility={handleUpgradeFacility}
        onUpgradeEngineering={handleUpgradeEngineering}
        onUnlockTrapType={handleUnlockTrapType}
        onUpdateMaterialCount={handleUpdateMaterialCount}
        onMeltDownMaterial={handleMeltDownMaterial}
        onFuseMaterials={handleFuseMaterials}
      />

      {/* Warehouse Modal */}
      <WarehouseModal
        isOpen={isWarehouseOpen}
        onClose={() => setIsWarehouseOpen(false)}
        materials={materials}
        upgrades={upgrades}
        customerHistory={customerHistory}
      />

      {/* Shop Modal */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        gold={gold}
        materials={materials}
        onBuyMaterial={handleBuyMaterial}
      />

      {/* Quests Modal */}
      <QuestsModal
        isOpen={isQuestsOpen}
        onClose={() => setIsQuestsOpen(false)}
        quests={quests}
        onClaimReward={handleClaimQuest}
      />

      {/* Daily Settlement Modal */}
      {settlementSummary && (
        <DailySettlementModal
          isOpen={isSettlementOpen}
          summary={settlementSummary}
          onNextDay={handleNextDay}
        />
      )}

      {/* Original Design Reference & GDD Modal */}
      <DesignReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />
    </div>
  );
}
