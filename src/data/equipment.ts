// ============================================================
// 装备配置 — 9 装备，各绑定售卖港口
// ============================================================

export interface EquipmentConfig {
  readonly id: string;
  readonly name: string;
  readonly type: "sail" | "cannon" | "armor" | "figurehead" | "special";
  readonly effect: {
    readonly speedBonus?: number; // 速度加成比率，如 0.08 为 +8%
    readonly combatBonus?: number; // 战斗力加成比率，如 0.15 为 +15%
    readonly durabilityBonus?: number; // 耐久加成值，如 20 为 +20
    readonly evasionBonus?: number; // 海盗回避率比率，如 0.10 为 +10%
    readonly capacityBonus?: number; // 舱容加成值，如 10 为 +10
  };
  readonly price: number;
  readonly sellPortIds: readonly string[];
}

export const EQUIPMENTS: readonly EquipmentConfig[] = [
  {
    id: "high_speed_sail",
    name: "高速帆",
    type: "sail",
    effect: { speedBonus: 0.08 },
    price: 5000,
    sellPortIds: ["quanzhou", "malacca", "london"],
  },
  {
    id: "gale_sail",
    name: "疾风帆",
    type: "sail",
    effect: { speedBonus: 0.15 },
    price: 15000,
    sellPortIds: ["nagasaki", "venice"],
  },
  {
    id: "cannon_light",
    name: "轻型火炮",
    type: "cannon",
    effect: { combatBonus: 0.1 },
    price: 4000,
    sellPortIds: ["quanzhou", "goa", "hamburg"],
  },
  {
    id: "cannon_heavy",
    name: "加农炮",
    type: "cannon",
    effect: { combatBonus: 0.15 },
    price: 12000,
    sellPortIds: ["calicut", "alexandria"],
  },
  {
    id: "armor_iron",
    name: "铁甲板",
    type: "armor",
    effect: { durabilityBonus: 20 },
    price: 6000,
    sellPortIds: ["nagasaki", "mombasa", "london"],
  },
  {
    id: "armor_steel",
    name: "钢甲板",
    type: "armor",
    effect: { durabilityBonus: 40 },
    price: 16000,
    sellPortIds: ["venice", "hamburg"],
  },
  {
    id: "figurehead_poseidon",
    name: "海神像",
    type: "figurehead",
    effect: { evasionBonus: 0.1 },
    price: 10000,
    sellPortIds: ["quanzhou", "venice", "aden"],
  },
  {
    id: "cargo_reinforcement",
    name: "货舱加固",
    type: "special",
    effect: { capacityBonus: 10 },
    price: 5000,
    sellPortIds: ["quanzhou", "malacca", "goa", "london"],
  },
  {
    id: "cargo_expander",
    name: "超大货舱",
    type: "special",
    effect: { capacityBonus: 25 },
    price: 14000,
    sellPortIds: ["nagasaki", "calicut", "alexandria"],
  },
] as const;

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentConfig["type"], string> = {
  sail: "帆",
  cannon: "炮",
  armor: "装甲",
  figurehead: "船首像",
  special: "特殊",
};

export function getEquipmentEffectDescription(config: EquipmentConfig): string {
  const parts: string[] = [];
  if (config.effect.speedBonus !== undefined) {
    parts.push(`航行速度 +${Math.round(config.effect.speedBonus * 100)}%`);
  }
  if (config.effect.combatBonus !== undefined) {
    parts.push(`战斗评分 +${Math.round(config.effect.combatBonus * 100)}%`);
  }
  if (config.effect.durabilityBonus !== undefined) {
    parts.push(`耐久上限 +${config.effect.durabilityBonus}`);
  }
  if (config.effect.evasionBonus !== undefined) {
    parts.push(`海盗回避率 +${Math.round(config.effect.evasionBonus * 100)}%`);
  }
  if (config.effect.capacityBonus !== undefined) {
    parts.push(`船只舱容 +${config.effect.capacityBonus}`);
  }
  return parts.join("，");
}
