"use server"

import { prisma } from "../../lib/prisma"
import { loadWorld, saveWorld } from "../../lib/repository"
import { upgradeShip } from "../../game/domain/ship"
import { buildShipView } from "../../game/view-builder/buildGameView"
import type { ShipView } from "../../types/game-view"

export async function loadShipView(): Promise<ShipView> {
  return await prisma.$transaction(async (tx) => {
    const world = await loadWorld(tx)
    return buildShipView(world)
  })
}

export async function upgradeShipAction(
  _prev: ShipView | null,
): Promise<ShipView> {
  return await prisma.$transaction(async (tx) => {
    const world = await loadWorld(tx)
    const newWorld = upgradeShip(world)
    await saveWorld(tx, newWorld)
    return buildShipView(newWorld)
  })
}
