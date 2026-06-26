// ============================================================
// 公式常量 — 所有可调参数集中在此
// ============================================================

/// 航行天数 = distance / (shipSpeed * SPEED_BASE)
export const SPEED_BASE = 2.0;

/// 每次交易对该商品价格的冲击幅度（百分比）
export const TRADE_IMPACT = 0.05;

/// 每天价格向基础价回归的速度（百分比）
export const PRICE_REGRESSION_RATE = 0.03;

/// 价格随机波动幅度（±百分比）
export const PRICE_VOLATILITY = 0.1;

/// 新增港口时玩家初始金币
export const STARTING_GOLD = 5000;

/// 初始天数
export const STARTING_DAY = 1;

// ============================================================
// 耐久/维修/战斗常量
// ============================================================

/// 维修费用 = repairCostPerHp × REPAIR_COST_MULTIPLIER × 缺失HP
export const REPAIR_COST_MULTIPLIER = 1.0;

/// 风暴事件每次最低 HP 伤害
export const STORM_HP_DAMAGE_MIN = 5;

/// 风暴事件每次最高 HP 伤害
export const STORM_HP_DAMAGE_MAX = 20;

/// 战斗基础伤害（不依赖武装的固定伤害区间）
export const COMBAT_BASE_DAMAGE_MIN = 0;
export const COMBAT_BASE_DAMAGE_MAX = 15;

/// 战斗 cargo 丢失基础量
export const COMBAT_CARGO_LOSS_MIN = 0;
export const COMBAT_CARGO_LOSS_MAX = 8;

/// 全损判定阈值：战斗得分低于此值 = 沉船
export const TOTAL_LOSS_THRESHOLD = 15;
