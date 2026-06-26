// ============================================================
// 船只配置
// ============================================================

export interface ShipConfig {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
  readonly speed: number;
  readonly basePrice: number;
  readonly maxUpgradeLevel: number;
  readonly upgradeCosts: readonly number[];
  readonly baseHp: number;
  readonly repairCostPerHp: number;
  readonly armamentTiers: readonly [
    [cargoRatio: number, defenseMultiplier: number],
    [cargoRatio: number, defenseMultiplier: number],
    [cargoRatio: number, defenseMultiplier: number],
  ];
}

export const SHIPS: readonly ShipConfig[] = [
  {
    id: "sloop",
    name: "单桅帆船",
    capacity: 30,
    speed: 1.0,
    basePrice: 0,
    maxUpgradeLevel: 3,
    upgradeCosts: [500, 1200, 3000],
    baseHp: 50,
    repairCostPerHp: 5,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
  },
  {
    id: "cog",
    name: "柯克帆船",
    capacity: 60,
    speed: 0.8,
    basePrice: 3000,
    maxUpgradeLevel: 3,
    upgradeCosts: [1500, 3500, 6000],
    baseHp: 80,
    repairCostPerHp: 8,
    armamentTiers: [
      [1.0, 1.0],
      [0.75, 1.5],
      [0.5, 2.5],
    ],
  },
] as const;
