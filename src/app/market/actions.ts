"use server";

import { buildMarketView } from "../../game/view-builder/buildGameView";
import { prisma } from "../../lib/prisma";
import { loadWorld } from "../../lib/repository";
import type { MarketView } from "../../types/game-view";

export async function loadMarketView(): Promise<MarketView> {
  const world = await loadWorld(prisma);
  return buildMarketView(world);
}
