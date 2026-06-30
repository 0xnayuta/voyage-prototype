"use server";

import { fireCrew, hireCrew } from "../../game/domain/crew";
import { buildTavernView } from "../../game/view-builder/buildGameView";
import { getErrorMessage } from "../../lib/domain-errors";
import { prisma } from "../../lib/prisma";
import { loadWorld, saveWorld } from "../../lib/repository";
import type { TavernView } from "../../types/game-view";
import type { PrismaTransactionClient } from "../../types/prisma";

export async function hireCrewAction(formData: FormData): Promise<TavernView> {
  const quantity = Number(formData.get("quantity"));
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("请输入招募船员的数量");
  }

  try {
    return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const world = await loadWorld(tx);
      const newWorld = hireCrew(world, quantity);
      await saveWorld(tx, newWorld);
      return buildTavernView(newWorld);
    });
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
}

export async function fireCrewAction(formData: FormData): Promise<TavernView> {
  const quantity = Number(formData.get("quantity"));
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("请输入解雇船员的数量");
  }

  try {
    return await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      const world = await loadWorld(tx);
      const newWorld = fireCrew(world, quantity);
      await saveWorld(tx, newWorld);
      return buildTavernView(newWorld);
    });
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
}
