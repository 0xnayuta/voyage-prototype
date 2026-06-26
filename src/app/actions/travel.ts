"use server";
import { ROUTES } from "../../data/ports";
import { calcTravelDays } from "../../game/domain/navigation";
import { startVoyage } from "../../game/domain/voyage";
import { buildVoyageView } from "../../game/view-builder/buildGameView";
import { prisma } from "../../lib/prisma";
import { loadWorld, saveWorld } from "../../lib/repository";
import type { VoyageView } from "../../types/game-view";
import type { PrismaTransactionClient } from "../../types/prisma";

export async function startTravel(formData: FormData): Promise<VoyageView> {
  const targetPortId = formData.get("portId") as string;
  if (!targetPortId) throw new Error("未选择目的港");

  return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    if (world.voyage) throw new Error("航行中，无法再次出航");

    // 查找航路
    const route = ROUTES.find(
      (r) => r.from === world.player.currentPortId && r.to === targetPortId,
    );
    if (!route) throw new Error("无法到达该港口");

    // 计算航行天数
    const travelDays = calcTravelDays(route.distance, world);

    // 创建航行状态（含预生成事件）
    const voyage = startVoyage(
      world,
      world.player.currentPortId,
      targetPortId,
      travelDays,
    );

    const newWorld: typeof world = {
      ...world,
      voyage,
    };

    await saveWorld(tx, newWorld);
    return buildVoyageView(newWorld);
  });
}
