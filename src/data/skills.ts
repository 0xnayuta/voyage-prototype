// ============================================================
// 武器技能配置 - 武器关联的技能表
// ============================================================

export interface SkillConfig {
  readonly id: string;
  readonly name: string;
  readonly mpCost: number;
  readonly type: "physical" | "magical" | "status" | "heal";
  readonly power: number; // 威力系数
  readonly statusEffect?: {
    readonly type:
      | "poison"
      | "bleed"
      | "burn"
      | "freeze"
      | "sleep"
      | "silence"
      | "blind";
    readonly chance: number; // 0.0 - 1.0
    readonly duration: number; // 回合数
  };
  readonly description: string;
}

export const SKILLS: readonly SkillConfig[] = [
  {
    id: "heavy_strike",
    name: "重击",
    mpCost: 5,
    type: "physical",
    power: 1.3,
    description: "势大力沉的斩击，造成 1.3 倍物理伤害。",
  },
  {
    id: "pierce",
    name: "贯穿",
    mpCost: 8,
    type: "physical",
    power: 1.5,
    description: "寻找防具缝隙的突刺，造成 1.5 倍物理伤害。",
  },
  {
    id: "bloody_thrust",
    name: "流血突刺",
    mpCost: 15,
    type: "physical",
    power: 1.2,
    statusEffect: { type: "bleed", chance: 0.8, duration: 3 },
    description: "精准的刺击，造成 1.2 倍物理伤害，80% 几率附加出血状态。",
  },
  {
    id: "fireball",
    name: "火球术",
    mpCost: 10,
    type: "magical",
    power: 1.5,
    statusEffect: { type: "burn", chance: 0.5, duration: 3 },
    description: "凝聚火元素攻击，造成 1.5 倍魔法伤害，50% 几率附加燃烧状态。",
  },
  {
    id: "freeze_lance",
    name: "冰枪术",
    mpCost: 15,
    type: "magical",
    power: 1.2,
    statusEffect: { type: "freeze", chance: 0.5, duration: 2 },
    description: "寒冰长枪射击，造成 1.2 倍魔法伤害，50% 几率附加冰冻状态。",
  },
  {
    id: "heal_light",
    name: "圣光治疗",
    mpCost: 12,
    type: "heal",
    power: 1.5,
    description: "祈祷圣光，根据魔力恢复 1.5 倍的生命值。",
  },
  {
    id: "holy_strike",
    name: "圣光击",
    mpCost: 10,
    type: "physical",
    power: 1.4,
    description: "灌注信仰的一击，造成 1.4 倍物理伤害。",
  },
  {
    id: "flurry",
    name: "乱斩",
    mpCost: 12,
    type: "physical",
    power: 1.7,
    description: "疯狂地快速挥砍，造成 1.7 倍物理伤害。",
  },
  {
    id: "poison_blade",
    name: "剧毒刃",
    mpCost: 10,
    type: "physical",
    power: 1.1,
    statusEffect: { type: "poison", chance: 0.8, duration: 4 },
    description: "刀刃涂毒攻击，造成 1.1 倍物理伤害，80% 几率附加中毒状态。",
  },
  {
    id: "thunder_spear",
    name: "雷霆穿刺",
    mpCost: 20,
    type: "magical",
    power: 2.2,
    statusEffect: { type: "blind", chance: 0.4, duration: 2 },
    description:
      "风暴雷霆之怒的投掷，造成 2.2 倍魔法伤害，40% 几率附加致盲状态。",
  },
] as const;

export const STATUS_EFFECT_LABELS: Record<string, string> = {
  poison: "中毒",
  bleed: "出血",
  burn: "燃烧",
  freeze: "冰冻",
  sleep: "睡眠",
  silence: "沉默",
  blind: "暗闇",
};
