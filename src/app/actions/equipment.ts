"use server";

import {
  buyEquipment,
  equipItem,
  sellEquipment,
  unequipItem,
} from "../../game/domain/equipment";
import {
  buildMarketView,
  buildShipyardView,
} from "../../game/view-builder/buildGameView";
import { getErrorMessage } from "../../lib/domain-errors";
import { prisma } from "../../lib/prisma";
import { loadWorld, saveWorld } from "../../lib/repository";
import type { MarketView, ShipyardView } from "../../types/game-view";
import type { PrismaTransactionClient } from "../../types/prisma";

export async function buyEquipmentAction(
  formData: FormData,
): Promise<MarketView> {
  const equipmentId = formData.get("equipmentId") as string;
  if (!equipmentId) throw new Error("未选择装备");

  try {
    return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const world = await loadWorld(tx);
      const nextWorld = buyEquipment(world, equipmentId);
      await saveWorld(tx, nextWorld);
      return buildMarketView(nextWorld);
    });
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
}

export async function sellEquipmentAction(
  formData: FormData,
): Promise<MarketView> {
  const equipmentId = formData.get("equipmentId") as string;
  if (!equipmentId) throw new Error("未选择装备");

  try {
    return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const world = await loadWorld(tx);
      const nextWorld = sellEquipment(world, equipmentId);
      await saveWorld(tx, nextWorld);
      return buildMarketView(nextWorld);
    });
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
}

export async function equipItemAction(
  formData: FormData,
): Promise<ShipyardView> {
  const shipId = formData.get("shipId") as string;
  const equipmentId = formData.get("equipmentId") as string;
  if (!shipId || !equipmentId) throw new Error("未指定船只或装备");

  try {
    return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const world = await loadWorld(tx);
      const nextWorld = equipItem(world, shipId, equipmentId);
      await saveWorld(tx, nextWorld);
      return buildShipyardView(nextWorld, shipId);
    });
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
}

export async function unequipItemAction(
  formData: FormData,
): Promise<ShipyardView> {
  const shipId = formData.get("shipId") as string;
  const equipmentId = formData.get("equipmentId") as string;
  if (!shipId || !equipmentId) throw new Error("未指定船只或装备");

  try {
    return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const world = await loadWorld(tx);
      const nextWorld = unequipItem(world, shipId, equipmentId);
      await saveWorld(tx, nextWorld);
      return buildShipyardView(nextWorld, shipId);
    });
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
}
