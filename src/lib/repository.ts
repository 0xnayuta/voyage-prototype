import type { PrismaTransactionClient } from "../types/prisma"
import type { World } from "../game/domain/types"
import { createDefaultWorld } from "../game/domain/player"
import { initMarketPrices } from "../game/domain/market"

// ============================================================
// Repository — 数据读写层
// 只做 CRUD，不含业务逻辑
// ============================================================

const AUTO_SAVE_SLOT = 0

/** 从 SQLite 读档，无存档则创建默认 World */
export async function loadWorld(
  tx: PrismaTransactionClient,
): Promise<World> {
  const save = await tx.save.findUnique({
    where: { slot: AUTO_SAVE_SLOT },
  })
  if (!save) return createDefaultWorld()

  const world = JSON.parse(save.data) as World

  // 迁移：旧存档没有 market 字段 → 初始化价格
  if (!world.market) {
    return {
      ...world,
      market: initMarketPrices(),
    }
  }

  return world
}

/** 保存 World 到 SQLite（upsert） */
export async function saveWorld(
  tx: PrismaTransactionClient,
  world: World,
): Promise<void> {
  await tx.save.upsert({
    where: { slot: AUTO_SAVE_SLOT },
    update: { data: JSON.stringify(world) },
    create: { slot: AUTO_SAVE_SLOT, data: JSON.stringify(world) },
  })
}
