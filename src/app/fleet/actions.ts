"use server";

import { getActiveShip, setArmamentLevel } from "../../game/domain/ship";
import { buildFleetView } from "../../game/view-builder/buildGameView";
import { prisma } from "../../lib/prisma";
import { loadWorld, saveWorld } from "../../lib/repository";
import type { FleetView } from "../../types/game-view";
import type { PrismaTransactionClient } from "../../types/prisma";

export async function loadFleetView(): Promise<FleetView> {
  const world = await loadWorld(prisma);
  return buildFleetView(world);
}

export async function switchActiveShipAction(
  formData: FormData,
): Promise<FleetView> {
  const shipId = formData.get("shipId") as string;
  if (!shipId) throw new Error("未指定船只");

  return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    if (world.voyage) throw new Error("航行中无法更换旗舰");
    const shipExists = world.fleet.ships.some((s) => s.id === shipId);
    if (!shipExists) throw new Error("无效船只");
    const newWorld: typeof world = {
      ...world,
      fleet: {
        ...world.fleet,
        activeShipId: shipId,
      },
    };
    await saveWorld(tx, newWorld);
    return buildFleetView(newWorld);
  });
}

export async function setArmamentAction(
  formData: FormData,
): Promise<FleetView> {
  const levelRaw = formData.get("level");
  const level = parseInt(levelRaw as string, 10) as 0 | 1 | 2;
  const shipId = formData.get("shipId") as string;
  if (![0, 1, 2].includes(level)) throw new Error("无效武装等级");

  return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    const targetShipId = shipId || getActiveShip(world).id;
    const shipExists = world.fleet.ships.some((s) => s.id === targetShipId);
    if (!shipExists) throw new Error("无效船只");

    const newWorld = setArmamentLevel(world, targetShipId, level);
    await saveWorld(tx, newWorld);
    return buildFleetView(newWorld);
  });
}
