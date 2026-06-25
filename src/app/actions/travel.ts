"use server"

import { prisma } from "../../lib/prisma"
import { loadWorld, saveWorld } from "../../lib/repository"
import { arriveAtPort, calcTravelDays } from "../../game/domain/navigation"
import { ROUTES } from "../../data/ports"
import { advanceDay } from "../../game/domain/player"
import { buildHarborView } from "../../game/view-builder/buildGameView"
import type { HarborView, NavigationView } from "../../types/game-view"

export async function startTravel(
  _prev: NavigationView | null,
  formData: FormData,
): Promise<HarborView> {
  const targetPortId = formData.get("portId") as string
  if (!targetPortId) throw new Error("未选择目的港")

  return await prisma.$transaction(async (tx) => {
    const world = await loadWorld(tx)

    // 查找航路
    const route = ROUTES.find(
      (r) => r.from === world.player.currentPortId && r.to === targetPortId,
    )
    if (!route) throw new Error("无法到达该港口")

    // 计算航行天数
    const days = calcTravelDays(route.distance, world)

    // 推进天数（含市场价格回归 + 波动）
    const afterDays = advanceDay(world, days)

    // 执行抵达（更新 currentPortId + 天数）
    const arrived = arriveAtPort(afterDays, targetPortId, days)

    await saveWorld(tx, arrived)
    return buildHarborView(arrived)
  })
}
