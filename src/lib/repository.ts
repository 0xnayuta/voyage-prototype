import { BASE_EXP } from "../data/formulas";
import { SHIPS } from "../data/ships";
import { createDefaultWorld } from "../game/domain/player";
import type { World } from "../game/domain/types";
import type { PrismaTransactionClient } from "../types/prisma";
import { prisma } from "./prisma";

export const AUTO_SAVE_SLOT = 0;
export const MANUAL_SAVE_SLOTS = [1, 2, 3] as const;
export const ALL_SAVE_SLOTS = [0, 1, 2, 3] as const;

function migrateOldShipToFleet(parsed: Record<string, unknown>): World {
  const oldShip = parsed.ship as Record<string, unknown>;
  const player = parsed.player as Record<string, unknown>;
  const shipConfig = SHIPS.find((s) => s.id === (oldShip.typeId as string));

  const hasLevel = (player.level as number) != null;

  return {
    player: {
      name: player.name as string,
      currentPortId: player.currentPortId as string,
      day: (player.day as number) ?? 1,
      level: hasLevel ? ((player.level as number) ?? 1) : 1,
      exp: hasLevel ? ((player.exp as number) ?? 0) : 0,
      expToNext: hasLevel
        ? ((player.expToNext as number) ?? BASE_EXP)
        : BASE_EXP,
    },
    fleet: {
      ships: [
        {
          id: "ship-1",
          typeId: oldShip.typeId as string,
          name: shipConfig?.name ?? "未知",
          equipment: {
            hullLevel: (oldShip.upgradeLevel as number) ?? 0,
            sailLevel: 0,
            armorLevel: 0,
            cannonLevel: 0,
          },
          durability: (oldShip.currentHp as number) ?? 50,
          maxDurability: (oldShip.maxHp as number) ?? 50,
          cargo: (oldShip.cargo ??
            []) as unknown as readonly import("../game/domain/types").CargoItem[],
          armamentLevel: Math.min(
            2,
            Math.max(0, (oldShip.armamentLevel as number) ?? 0),
          ) as 0 | 1 | 2,
          equippedItems: [],
        },
      ],
      activeShipId: "ship-1",
      maxShips: 1,
      crew: shipConfig?.baseCrew ?? 3,
      maxCrew: (shipConfig?.baseCrew ?? 3) * 2,
      gold: (player.gold as number) ?? 5000,
      inventory: [],
    },
    market:
      parsed.market as unknown as import("../game/domain/types").MarketPriceState,
    voyage: (parsed.voyage ?? null) as World["voyage"],
  };
}

/** 解析存档 JSON 数据并执行迁移（旧 ship → fleet、补全 level/inventory） */
function parseSaveData(data: string): World {
  const parsed = JSON.parse(data) as Record<string, unknown>;

  // Phase 2.2: Old save with `ship` → migrate to fleet
  if (parsed.ship != null && parsed.fleet == null) {
    return migrateOldShipToFleet(parsed);
  }

  let result = parsed as unknown as World;

  // Phase 2.1: Complement level fields
  if (result.player.level == null) {
    result = {
      ...result,
      player: { ...result.player, level: 1, exp: 0, expToNext: BASE_EXP },
    };
  }

  // Phase 2.5: Ensure fleet has inventory
  if (result.fleet && result.fleet.inventory == null) {
    result = {
      ...result,
      fleet: {
        ...result.fleet,
        inventory: [],
      },
    };
  }

  return result;
}

/** 从指定槽位加载 World（槽位为空时抛异常） */
export async function loadWorldFromSlot(
  tx: PrismaTransactionClient,
  slot: number,
): Promise<World> {
  const save = await tx.save.findUnique({ where: { slot } });
  if (!save) throw new Error("该存档槽位为空");
  return parseSaveData(save.data);
}

/** 加载自动存档（槽位为空时返回默认 World，用于游戏初始化） */
export async function loadWorld(tx: PrismaTransactionClient): Promise<World> {
  const save = await tx.save.findUnique({ where: { slot: AUTO_SAVE_SLOT } });
  if (!save) return createDefaultWorld();
  try {
    return parseSaveData(save.data);
  } catch {
    return createDefaultWorld();
  }
}

/** 保存 World 到指定槽位 */
export async function saveWorldToSlot(
  tx: PrismaTransactionClient,
  world: World,
  slot: number,
): Promise<void> {
  await tx.save.upsert({
    where: { slot },
    update: { data: JSON.stringify(world) },
    create: { slot, data: JSON.stringify(world) },
  });
}

/** 保存 World 到自动存档槽位 */
export async function saveWorld(
  tx: PrismaTransactionClient,
  world: World,
): Promise<void> {
  await saveWorldToSlot(tx, world, AUTO_SAVE_SLOT);
}

/** 列出所有存档（按槽位升序），供存档列表预览使用 */
export async function listSaves(): Promise<
  { slot: number; data: string; updatedAt: Date }[]
> {
  return prisma.save.findMany({ orderBy: { slot: "asc" } });
}

/** 删除指定槽位的存档（槽位为空时静默忽略） */
export async function deleteSave(slot: number): Promise<void> {
  await prisma.save.delete({ where: { slot } }).catch(() => {});
}
