// ============================================================
// 商品配置 — 16 种商品，四大品类
// ============================================================

export interface GoodConfig {
  readonly id: string;
  readonly name: string;
  readonly category: GoodCategory;
  readonly basePrice: number;
  readonly volume: number; // 每单位占多少舱容
  readonly tier: number; // 等级要求（MVP 全部为 0）
}

export type GoodCategory = "food" | "textile" | "craft" | "material";

export const CATEGORY_LABEL: Record<GoodCategory, string> = {
  food: "食品",
  textile: "纺织品",
  craft: "工艺",
  material: "原料",
};

export const GOODS: readonly GoodConfig[] = [
  // ---- 食品 ----
  {
    id: "rice",
    name: "粮食",
    category: "food",
    basePrice: 30,
    volume: 4,
    tier: 0,
  },
  {
    id: "tea",
    name: "茶叶",
    category: "food",
    basePrice: 80,
    volume: 2,
    tier: 0,
  },
  {
    id: "jerky",
    name: "肉干",
    category: "food",
    basePrice: 50,
    volume: 3,
    tier: 0,
  },
  {
    id: "dried_fruit",
    name: "干果",
    category: "food",
    basePrice: 60,
    volume: 3,
    tier: 0,
  },
  // ---- 纺织品 ----
  {
    id: "silk",
    name: "丝绸",
    category: "textile",
    basePrice: 120,
    volume: 2,
    tier: 0,
  },
  {
    id: "cotton",
    name: "棉布",
    category: "textile",
    basePrice: 60,
    volume: 3,
    tier: 0,
  },
  {
    id: "wool",
    name: "羊毛",
    category: "textile",
    basePrice: 45,
    volume: 4,
    tier: 0,
  },
  {
    id: "linen",
    name: "亚麻布",
    category: "textile",
    basePrice: 55,
    volume: 3,
    tier: 0,
  },
  // ---- 工艺 ----
  {
    id: "porcelain",
    name: "瓷器",
    category: "craft",
    basePrice: 150,
    volume: 3,
    tier: 0,
  },
  {
    id: "glassware",
    name: "玻璃器皿",
    category: "craft",
    basePrice: 180,
    volume: 2,
    tier: 0,
  },
  {
    id: "jade",
    name: "玉石",
    category: "craft",
    basePrice: 300,
    volume: 1,
    tier: 0,
  },
  {
    id: "ivory",
    name: "象牙",
    category: "craft",
    basePrice: 400,
    volume: 1,
    tier: 0,
  },
  // ---- 原料 ----
  {
    id: "timber",
    name: "木材",
    category: "material",
    basePrice: 40,
    volume: 3,
    tier: 0,
  },
  {
    id: "spice",
    name: "香料",
    category: "material",
    basePrice: 200,
    volume: 1,
    tier: 0,
  },
  {
    id: "pepper",
    name: "胡椒",
    category: "material",
    basePrice: 150,
    volume: 1,
    tier: 0,
  },
  {
    id: "gold",
    name: "黄金",
    category: "material",
    basePrice: 500,
    volume: 1,
    tier: 0,
  },
  {
    id: "tin",
    name: "锡",
    category: "material",
    basePrice: 80,
    volume: 3,
    tier: 0,
  },
  {
    id: "copper",
    name: "铜",
    category: "material",
    basePrice: 90,
    volume: 3,
    tier: 0,
  },
  {
    id: "frankincense",
    name: "乳香",
    category: "material",
    basePrice: 180,
    volume: 1,
    tier: 0,
  },
] as const;
