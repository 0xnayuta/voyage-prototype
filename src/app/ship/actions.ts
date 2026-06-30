"use server";

import type { ComponentType } from "../../game/domain/ship";
import {
  buyShip,
  repairShip,
  sellShip,
  upgradeComponent,
} from "../../game/domain/ship";
import { buildShipyardView } from "../../game/view-builder/buildGameView";
import { prisma } from "../../lib/prisma";
import { loadWorld, saveWorld } from "../../lib/repository";
import type { ShipyardView } from "../../types/game-view";
import type { PrismaTransactionClient } from "../../types/prisma";

export async function loadShipyardView(
  selectedShipId?: string,
): Promise<ShipyardView> {
  const world = await loadWorld(prisma);
  return buildShipyardView(world, selectedShipId);
}

export async function buyShipAction(formData: FormData): Promise<ShipyardView> {
  const typeId = formData.get("typeId") as string;
  if (!typeId) throw new Error("未选择船只类型");

  return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    const newWorld = buyShip(world, typeId);
    await saveWorld(tx, newWorld);
    return buildShipyardView(newWorld, newWorld.fleet.activeShipId);
  });
}

export async function sellShipAction(
  formData: FormData,
): Promise<ShipyardView> {
  const shipId = formData.get("shipId") as string;
  if (!shipId) throw new Error("未指定船只");

  return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    const newWorld = sellShip(world, shipId);
    await saveWorld(tx, newWorld);
    return buildShipyardView(newWorld, newWorld.fleet.activeShipId);
  });
}

export async function upgradeComponentAction(
  _prev: ShipyardView | null,
  formData: FormData,
): Promise<ShipyardView> {
  const component = formData.get("component") as ComponentType;
  const shipId = formData.get("shipId") as string;
  if (!shipId) throw new Error("未指定船只");

  return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    const newWorld = upgradeComponent(world, shipId, component);
    await saveWorld(tx, newWorld);
    return buildShipyardView(newWorld, shipId);
  });
}

export async function repairShipAction(
  _prev: ShipyardView | null,
  formData: FormData,
): Promise<ShipyardView> {
  const shipId = formData.get("shipId") as string;
  if (!shipId) throw new Error("未指定船只");

  return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    const newWorld = repairShip(world, shipId);
    await saveWorld(tx, newWorld);
    return buildShipyardView(newWorld, shipId);
  });
}
