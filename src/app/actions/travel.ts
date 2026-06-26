"use server";
import { PORTS } from "../../data/ports";
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

  const armamentStr = formData.get("armamentLevel") as string;
  const armamentLevel = (armamentStr ? parseInt(armamentStr, 10) : 0) as
    | 0
    | 1
    | 2;

  return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    if (world.voyage) throw new Error("航行中，无法再次出航");

    // 查找目标港口，计算航线距离
    const fromPort = PORTS.find((p) => p.id === world.player.currentPortId);
    const toPort = PORTS.find((p) => p.id === targetPortId);
    if (!fromPort || !toPort) throw new Error("无法到达该港口");
    const dx = fromPort.x - toPort.x;
    const dy = fromPort.y - toPort.y;
    const distance = Math.round(Math.sqrt(dx * dx + dy * dy));

    // 检查 HP（HP 为 0 不能出航）
    if (world.ship.currentHp <= 0) throw new Error("船体严重损坏，无法出航");

    // 计算航行天数
    const travelDays = calcTravelDays(distance, world);

    // 创建航行状态（含预生成事件 + 武装配置）
    const voyage = startVoyage(
      world,
      world.player.currentPortId,
      targetPortId,
      travelDays,
      armamentLevel,
    );

    const newWorld: typeof world = {
      ...world,
      voyage,
    };

    await saveWorld(tx, newWorld);
    return buildVoyageView(newWorld);
  });
}
