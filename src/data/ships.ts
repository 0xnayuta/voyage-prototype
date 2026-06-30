// ============================================================
// 船只配置 — 8 船只，各绑定出售港口
// ============================================================

export interface ShipConfig {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
  readonly speed: number;
  readonly basePrice: number;
  /** 可购买该船只的港口 ID 列表（空数组 = 不可购买，如初始船） */
  readonly sellPortIds: readonly string[];
  readonly maxComponentLevel: number;
  readonly upgradeCosts: {
    readonly hull: readonly number[];
    readonly sail: readonly number[];
    readonly armor: readonly number[];
    readonly cannon: readonly number[];
  };
  readonly baseDurability: number;
  readonly repairCostPerDurability: number;
  readonly armamentTiers: readonly [
    [cargoRatio: number, defenseMultiplier: number],
    [cargoRatio: number, defenseMultiplier: number],
    [cargoRatio: number, defenseMultiplier: number],
  ];
  readonly baseCrew: number;
}

export const SHIPS: readonly ShipConfig[] = [
  // ---- 轻型 ----
  {
    id: "light-sailboat",
    name: "轻木帆船",
    capacity: 20,
    speed: 1.2,
    basePrice: 800,
    sellPortIds: ["venice"],
    maxComponentLevel: 2,
    upgradeCosts: {
      hull: [300, 800],
      sail: [200, 600],
      armor: [250, 700],
      cannon: [400, 1000],
    },
    baseDurability: 35,
    repairCostPerDurability: 3,
    armamentTiers: [
      [1.0, 1.0],
      [0.8, 1.3],
      [0.6, 2.0],
    ],
    baseCrew: 2,
  },
  {
    id: "sloop",
    name: "单桅帆船",
    capacity: 35,
    speed: 1.0,
    basePrice: 0,
    sellPortIds: ["venice"],
    maxComponentLevel: 3,
    upgradeCosts: {
      hull: [500, 1200, 3000],
      sail: [300, 800, 2000],
      armor: [400, 1000, 2500],
      cannon: [600, 1500, 3500],
    },
    baseDurability: 50,
    repairCostPerDurability: 5,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
    baseCrew: 3,
  },
  // ---- 中型 ----
  {
    id: "lateen",
    name: "单桅三角帆船",
    capacity: 50,
    speed: 0.9,
    basePrice: 2500,
    sellPortIds: ["london"],
    maxComponentLevel: 3,
    upgradeCosts: {
      hull: [800, 2000, 4500],
      sail: [600, 1500, 3500],
      armor: [700, 1800, 4000],
      cannon: [1000, 2500, 5000],
    },
    baseDurability: 60,
    repairCostPerDurability: 6,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
    baseCrew: 4,
  },
  {
    id: "caravel",
    name: "中型帆船",
    capacity: 80,
    speed: 0.8,
    basePrice: 5000,
    sellPortIds: ["london"],
    maxComponentLevel: 4,
    upgradeCosts: {
      hull: [1200, 3000, 5500, 9000],
      sail: [900, 2200, 4000, 7000],
      armor: [1000, 2500, 4500, 8000],
      cannon: [1500, 3500, 6000, 10000],
    },
    baseDurability: 80,
    repairCostPerDurability: 8,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
    baseCrew: 6,
  },
  // ---- 大型远洋 ----
  {
    id: "cog",
    name: "多桅小型帆船",
    capacity: 100,
    speed: 0.7,
    basePrice: 8000,
    sellPortIds: ["sofala", "goa"],
    maxComponentLevel: 4,
    upgradeCosts: {
      hull: [2000, 4500, 8000, 13000],
      sail: [1500, 3500, 6500, 11000],
      armor: [1800, 4000, 7000, 12000],
      cannon: [2500, 5500, 9000, 15000],
    },
    baseDurability: 90,
    repairCostPerDurability: 10,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
    baseCrew: 8,
  },
  {
    id: "fluyt",
    name: "佛兰德帆船",
    capacity: 90,
    speed: 0.85,
    basePrice: 10000,
    sellPortIds: ["sofala", "goa"],
    maxComponentLevel: 4,
    upgradeCosts: {
      hull: [2200, 5000, 9000, 14000],
      sail: [1800, 4000, 7500, 12000],
      armor: [2000, 4500, 8000, 13000],
      cannon: [2800, 6000, 10000, 16000],
    },
    baseDurability: 85,
    repairCostPerDurability: 12,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
    baseCrew: 10,
  },
  {
    id: "barque",
    name: "三桅帆船",
    capacity: 120,
    speed: 0.6,
    basePrice: 12000,
    sellPortIds: ["quanzhou"],
    maxComponentLevel: 5,
    upgradeCosts: {
      hull: [2500, 5500, 10000, 16000, 24000],
      sail: [2000, 4500, 8000, 13000, 20000],
      armor: [2200, 5000, 9000, 15000, 22000],
      cannon: [3000, 6500, 11000, 18000, 26000],
    },
    baseDurability: 100,
    repairCostPerDurability: 14,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
    baseCrew: 12,
  },
  {
    id: "galleon",
    name: "三桅大型帆船",
    capacity: 150,
    speed: 0.55,
    basePrice: 18000,
    sellPortIds: ["quanzhou"],
    maxComponentLevel: 5,
    upgradeCosts: {
      hull: [3500, 7500, 13000, 20000, 30000],
      sail: [2800, 6000, 10500, 17000, 25000],
      armor: [3000, 6500, 12000, 19000, 28000],
      cannon: [4000, 8500, 15000, 23000, 34000],
    },
    baseDurability: 120,
    repairCostPerDurability: 16,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
    baseCrew: 15,
  },
] as const;
