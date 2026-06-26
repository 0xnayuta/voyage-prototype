---
status: draft
last_verified: 2026-06-26
---

# 舰队系统演进路径（Fleet Evolution Path）

**关联规则：** R1, R2, R8

---

## 动机

参考 `docs/reference/deep-research-report-gemini.md` §12 的核心发现：

原版《纵横四海》最深的策略层来自 **「货舱 vs 战力」的取舍博弈**——玩家必须在舰队中决定牺牲多少货舱位置来配置武装战船以保障安全，还是全堆货舱赌一路顺风。

这种博弈是文字航海游戏的核心策略深度来源。当前 Phase 1 不做战斗系统，但架构应保留向该方向平滑扩展的能力。

---

## 当前架构（Phase 1）

```typescript
// src/game/domain/types.ts
interface ShipState {
  readonly typeId: string;
  readonly upgradeLevel: number;
  readonly cargo: readonly CargoItem[];
}

interface World {
  readonly player: PlayerState;
  readonly ship: ShipState;          // 单船
  readonly market: MarketPriceState;
  readonly voyage: VoyageState | null;
}
```

当前是 **单船 + 全局升级** 模式：
- 一次只能拥有一艘船
- 升级提升全局容量（固定比例）
- 无耐久 / 攻防属性
- 无舰队概念

---

## 演进路径

### Phase 2：部件级升级（不涉及舰队重构）

在现有单船架构下，将 `upgradeLevel` 从单一数值拆分为**部件升级**：

```typescript
interface ShipEquipment {
  readonly hullLevel: number;       // 容量
  readonly sailLevel: number;       // 速度
  readonly armorLevel: number;      // 耐久（预留）
  readonly cannonLevel: number;     // 攻击（预留）
}
```

**变化范围：**
- `src/data/ships.ts` — 每部件独立升级费用配置
- `src/game/domain/ship.ts` — `upgradeShip` 接受部件参数
- `src/game/domain/types.ts` — `ShipState` 新增 `equipment` 字段
- `src/game/domain/types.ts` — `ShipState` 新增 `durability` / `maxDurability` 字段
- `src/game/domain/voyage.ts` — 随机事件影响耐久
- UI `/ship` — 升级界面改为部件选择

**不涉及：**
- 舰队 / 多船
- 战斗系统
- 数据结构根级变更

### Phase 3：引入舰队 + 战斗

将 `ship: ShipState` 重构为 `fleet: ShipInstance[]`：

```typescript
interface ShipInstance {
  readonly typeId: string;
  readonly name: string;            // 玩家可命名
  readonly equipment: ShipEquipment;
  readonly durability: number;
  readonly maxDurability: number;
  readonly cargo: readonly CargoItem[];
}

interface FleetState {
  readonly ships: readonly ShipInstance[];
  readonly maxShips: number;        // 由玩家等级/声望决定
}

interface World {
  readonly player: PlayerState;
  readonly fleet: FleetState;       // 替换 ship
  readonly market: MarketPriceState;
  readonly voyage: VoyageState | null;
}
```

**战斗系统简化设计**（沿用原版模式）：

```typescript
interface CombatResult {
  readonly rounds: readonly CombatRound[];
  readonly won: boolean;
  readonly playerDamage: number;    // 舰队总耐久损失
  readonly cargoLost: number;       // 战败时丢失货物单位
  readonly lootGold: number;
  readonly lootItems: readonly string[];
}
```

纯数值对撞 + 文字战报体，不需要复杂的战斗引擎。

---

## 决策原则

|原则|说明|
|---|---|
|**Phase 1 不动 ship 结构**|当前单船足够跑通核心循环|
|**Phase 2 做增量扩展**|部件升级和耐久系统在现有 `ShipState` 内扩展，不重构为 `fleet`|
|**Phase 3 再重构**|只有明确需要舰队编队时才将 `ship` 改为 `fleet`|
|**禁止提前抽象**|不为「以后可能需要的舰队」预先设计接口|

---

## World 向后兼容

每次架构变更必须确保旧存档可迁移：

|阶段|迁移方式|
|---|---|
|Phase 2 (部件升级)|`upgradeLevel` → 拆为各部件等级，容量用公式映射|
|Phase 3 (舰队)|`ShipState` → 包装为 `FleetState` 中的单船数组|

迁移逻辑在 `lib/repository.ts` 的 `loadWorld` 中实现，检查旧结构并升级。

---

## 当前不需要的行动

- ❌ 不改 `World` 类型
- ❌ 不加战斗属性
- ❌ 不加多船配置
- ❌ 不加 `fleet` 概念

本文档仅为**演进方向记录**，不改变当前实现。
