import type { World } from "./types"
import { SHIPS } from "../../data/ships"

// ============================================================
// 船只逻辑 — 纯函数
// ============================================================

/** 升级船只：扣金币 + 提升等级。返回新 World 或抛出错误。 */
export function upgradeShip(world: World): World {
  const shipConfig = SHIPS.find((s) => s.id === world.ship.typeId)
  if (!shipConfig) throw new Error("无效船只")

  const level = world.ship.upgradeLevel
  if (level >= shipConfig.maxUpgradeLevel) throw new Error("已达最高等级")

  const cost = shipConfig.upgradeCosts[level]
  if (world.player.gold < cost) throw new Error("金币不足")

  if (world.voyage) throw new Error("航行中无法升级")

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
  }
}
