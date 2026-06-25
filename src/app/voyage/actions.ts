"use server"

import { prisma } from "../../lib/prisma"
import { loadWorld, saveWorld } from "../../lib/repository"
import { advanceDay } from "../../game/domain/player"
import { arriveAtPort } from "../../game/domain/navigation"
import { applyVoyageEvents } from "../../game/domain/voyage"
import { buildVoyageView, buildHarborView } from "../../game/view-builder/buildGameView"
import type { VoyageView, HarborView } from "../../types/game-view"

export async function loadVoyageView(): Promise<VoyageView> {
  const world = await loadWorld(prisma)
  return buildVoyageView(world)
}

/** 完成航行：推进天数 + 应用事件效果 + 抵达 + 清空航行状态 */
export async function completeVoyage(): Promise<HarborView> {
  return await prisma.$transaction(async (tx) => {
    const world = await loadWorld(tx)
    if (!world.voyage) throw new Error("没有进行中的航行")

    const { toPortId, travelDays, events } = world.voyage

    // 1. 推进天数（市场价格回归 + 波动）
    const afterDays = advanceDay(world, travelDays)

    // 2. 应用航行事件效果
    const afterEvents = applyVoyageEvents(afterDays, events)

    // 3. 抵达目的港
    const arrived = arriveAtPort(afterEvents, toPortId, travelDays)

    // 4. 清空航行状态
    const finalWorld: typeof world = {
      ...arrived,
      voyage: null,
    }

    await saveWorld(tx, finalWorld)
    return buildHarborView(finalWorld)
  })
}
