// ============================================================
// Domain Types — 游戏事实（World）
// 所有类型定义在 src/game/domain/，不依赖 React / Next.js / Prisma
// ============================================================

// ---- 商品 ----

export interface GoodId {
  readonly id: string
}

export interface CargoItem {
  readonly goodId: string
  readonly quantity: number
  readonly buyPrice: number // 每单位买入价
}

// ---- 船只 ----

export interface ShipState {
  readonly typeId: string
  readonly upgradeLevel: number
  readonly cargo: readonly CargoItem[]
}

// ---- 市场 ----

/** 每个港口每种商品的当前价格 */
export interface MarketPriceState {
  /** portId → goodId → 当前价格 */
  readonly prices: Record<string, Record<string, number>>
}

// ---- 航行 ----

export interface VoyageEvent {
  readonly day: number     // 航行第几天触发
  readonly description: string
  readonly goldChange: number // 负=损失，0=无变化
  readonly cargoLoss: number  // 随机丢失货物单位数，0=不丢失
}

export interface VoyageState {
  readonly fromPortId: string
  readonly toPortId: string
  readonly departureDay: number
  readonly travelDays: number
  readonly events: readonly VoyageEvent[]
}

// ---- 玩家 ----

export interface PlayerState {
  readonly name: string
  readonly gold: number
  readonly currentPortId: string
  readonly day: number
}

// ---- World（事实集合） ----

export interface World {
  readonly player: PlayerState
  readonly ship: ShipState
  readonly market: MarketPriceState
  readonly voyage: VoyageState | null
  // 后续 Phase 增加：
  // quests: QuestState[]
  // worldEvents: WorldEventState[]
}
