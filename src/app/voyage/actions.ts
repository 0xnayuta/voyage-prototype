"use server";
import { redirect } from "next/navigation";
import { arriveAtPort } from "../../game/domain/navigation";
import { advanceDay } from "../../game/domain/player";
import { applyVoyageEvents } from "../../game/domain/voyage";
import { buildVoyageView } from "../../game/view-builder/buildGameView";
import { prisma } from "../../lib/prisma";
import { loadWorld, saveWorld } from "../../lib/repository";
import type { VoyageView } from "../../types/game-view";
import type { PrismaTransactionClient } from "../../types/prisma";

export async function loadVoyageView(): Promise<VoyageView> {
  const world = await loadWorld(prisma);
  return buildVoyageView(world);
}

/** 完成航行：推进天数 + 应用事件效果 + 抵达 + 清空航行状态 */
export async function completeVoyage(): Promise<void> {
  await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const world = await loadWorld(tx);
    if (!world.voyage) throw new Error("没有进行中的航行");

    const { toPortId, travelDays, events } = world.voyage;

    // 1. 推进天数（市场价格回归 + 波动）
    const afterDays = advanceDay(world, travelDays);

    // 2. 应用航行事件效果（战斗事件可能触发全损，voyage 置 null）
    const afterEvents = applyVoyageEvents(afterDays, events);

    // 3. 全损：voyage 已置 null，currentPortId 已更新，跳过后续流程
    if (!afterEvents.voyage) {
      await saveWorld(tx, afterEvents);
      return;
    }

    // 4. 正常抵达
    const arrived = arriveAtPort(afterEvents, toPortId, travelDays);

    // 5. 清空航行状态
    const finalWorld: typeof world = {
      ...arrived,
      voyage: null,
    };

    await saveWorld(tx, finalWorld);
  });

  redirect("/");
}
