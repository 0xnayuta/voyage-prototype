import { SHIPS } from "../../data/ships";
import type { World } from "./types";
import { DomainError } from "./types";

// ============================================================
// 船只逻辑 — 纯函数
// ============================================================

/** 升级船只：扣金币 + 提升等级。返回新 World 或抛出错误。 */
export function upgradeShip(world: World): World {
  const shipConfig = SHIPS.find((s) => s.id === world.ship.typeId);
  if (!shipConfig) throw new DomainError("INVALID_SHIP");

  const level = world.ship.upgradeLevel;
  if (level >= shipConfig.maxUpgradeLevel)
    throw new DomainError("MAX_LEVEL_REACHED");

  const cost = shipConfig.upgradeCosts[level];
  if (world.player.gold < cost) throw new DomainError("INSUFFICIENT_GOLD");

  if (world.voyage) throw new DomainError("IN_VOYAGE");

  return {
    ...world,
    player: {
      ...world.player,
      gold: world.player.gold - cost,
    },
    ship: {
      ...world.ship,
      upgradeLevel: level + 1,
    },
  };
}
