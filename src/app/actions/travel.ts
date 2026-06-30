"use server";
import { redirect } from "next/navigation";
import { PORTS } from "../../data/ports";
import { calcFleetTravelDays } from "../../game/domain/navigation";
import { getActiveShip } from "../../game/domain/ship";
import { startVoyage } from "../../game/domain/voyage";
import { prisma } from "../../lib/prisma";
import { loadWorld, saveWorld } from "../../lib/repository";
import type { PrismaTransactionClient } from "../../types/prisma";

export async function startTravel(formData: FormData): Promise<void> {
  const targetPortId = formData.get("portId") as string;
  if (!targetPortId) throw new Error("未选择目的港");

  const shipIdsRaw = formData.get("shipIds") as string | null;
  let shipIds: string[];

  await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    if (world.voyage) throw new Error("航行中，无法再次出航");

    // 解析舰队船只选择
    if (shipIdsRaw) {
      try {
        shipIds = JSON.parse(shipIdsRaw) as string[];
      } catch {
        shipIds = [getActiveShip(world).id];
      }
    } else {
      shipIds = [getActiveShip(world).id];
    }

    if (shipIds.length === 0) throw new Error("请至少选择一艘船出航");

    // 验证所有选中的船只都存在且耐久度 > 0
    for (const id of shipIds) {
      const ship = world.fleet.ships.find((s) => s.id === id);
      if (!ship) throw new Error("无效船只");
      if (ship.durability <= 0) throw new Error("船体严重损坏，无法出航");
    }

    // 查找目标港口，计算航线距离
    const fromPort = PORTS.find((p) => p.id === world.player.currentPortId);
    const toPort = PORTS.find((p) => p.id === targetPortId);
    if (!fromPort || !toPort) throw new Error("无法到达该港口");
    const dx = fromPort.x - toPort.x;
    const dy = fromPort.y - toPort.y;
    const distance = Math.round(Math.sqrt(dx * dx + dy * dy));

    // 计算航行天数（以舰队中最慢船为准）
    const travelDays = calcFleetTravelDays(distance, world, shipIds);

    const voyage = startVoyage(world, {
      fromPortId: world.player.currentPortId,
      toPortId: targetPortId,
      travelDays,
      fleetShipIds: shipIds,
    });

    const newWorld: typeof world = {
      ...world,
      voyage,
    };

    await saveWorld(tx, newWorld);
  });

  redirect("/voyage");
}
