// ============================================================
// 称号配置 — 6 个初始称号
// ============================================================

export type TitleEffectType =
  | "cargoCapacity" // 舱容 +N
  | "speedPercent" // 速度 +N%
  | "defensePercent"; // 防御 +N%

export interface TitleEffect {
  readonly type: TitleEffectType;
  readonly value: number;
}

export type TitleConditionType =
  | "level" // 等级 ≥ N
  | "totalSalesRevenue" // 累计贸易额 ≥ N
  | "bestSingleProfit" // 单次利润 ≥ N
  | "totalMileage" // 航行里程 ≥ N
  | "combatWins" // 战斗胜利 ≥ N
  | "voyagesCompleted"; // 完成航行次数 ≥ N

export interface TitleCondition {
  readonly type: TitleConditionType;
  readonly threshold: number;
}

export interface TitleConfig {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly condition: TitleCondition;
  readonly effects: readonly TitleEffect[];
}

export const TITLES: readonly TitleConfig[] = [
  {
    id: "first_voyage",
    name: "初出茅庐",
    description: "完成第一次航行",
    condition: { type: "voyagesCompleted", threshold: 1 },
    effects: [],
  },
  {
    id: "small_savings",
    name: "小有积蓄",
    description: "累计贸易额 ≥ 10,000",
    condition: { type: "totalSalesRevenue", threshold: 10000 },
    effects: [{ type: "cargoCapacity", value: 3 }],
  },
  {
    id: "overnight_rich",
    name: "一夜暴富",
    description: "单次利润 ≥ 5,000",
    condition: { type: "bestSingleProfit", threshold: 5000 },
    effects: [{ type: "speedPercent", value: 2 }],
  },
  {
    id: "pirate_bane",
    name: "海盗克星",
    description: "战斗胜利 ≥ 10 次",
    condition: { type: "combatWins", threshold: 10 },
    effects: [{ type: "defensePercent", value: 5 }],
  },
  {
    id: "pacific_master",
    name: "太平洋主宰",
    description: "航行里程 ≥ 10,000 海里",
    condition: { type: "totalMileage", threshold: 10000 },
    effects: [{ type: "speedPercent", value: 5 }],
  },
  {
    id: "pirate_king",
    name: "航海王",
    description: "等级 ≥ 50",
    condition: { type: "level", threshold: 50 },
    effects: [
      { type: "cargoCapacity", value: 10 },
      { type: "speedPercent", value: 3 },
    ],
  },
];
