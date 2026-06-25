"use server"

import { prisma } from "../../lib/prisma"
import { loadWorld } from "../../lib/repository"
import { buildNavigationView } from "../../game/view-builder/buildGameView"
import type { NavigationView } from "../../types/game-view"

export async function loadNavigationView(): Promise<NavigationView> {
  const world = await loadWorld(prisma)
  return buildNavigationView(world)
}
