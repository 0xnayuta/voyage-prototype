"use server";

import { buildTavernView } from "../../game/view-builder/buildGameView";
import { prisma } from "../../lib/prisma";
import { loadWorld } from "../../lib/repository";
import type { TavernView } from "../../types/game-view";

export async function loadTavernView(): Promise<TavernView> {
  const world = await loadWorld(prisma);
  return buildTavernView(world);
}
