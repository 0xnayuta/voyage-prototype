"use server";

import { redirect } from "next/navigation";
import { createDefaultWorld } from "../../game/domain/player";
import { prisma } from "../../lib/prisma";
import { saveWorld } from "../../lib/repository";

/**
 * 创建新游戏存档并跳转到港口页
 */
export async function createNewGame() {
  const world = createDefaultWorld();

  await prisma.$transaction(async (tx) => {
    await saveWorld(tx, world);
  });

  redirect("/");
}
