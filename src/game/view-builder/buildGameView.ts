// ============================================================
// View Builder — World → GameView 转换器
// 纯函数，无副作用，不调用数据库
// ============================================================

import { CATEGORY_LABEL, GOODS } from "../../data/goods";
import { PORTS } from "../../data/ports";
import { SHIPS } from "../../data/ships";
import type {
  CargoItemView,
  CargoView,
  DestinationView,
  GoodView,
  HarborView,
  MarketView,
  NavigationView,
  ShipView,
  VoyageEventView,
  VoyageView,
} from "../../types/game-view";
import { getPortGoods, getSellPrice } from "../domain/market";
import { getReachablePorts } from "../domain/navigation";
import { getMaxCapacity, getUsedCapacity } from "../domain/trade";
import type { World } from "../domain/types";

// ============================================================
// 主入口
// ============================================================

export function buildHarborView(world: World): HarborView {
  const port = PORTS.find((p) => p.id === world.player.currentPortId);
  const ship = SHIPS.find((s) => s.id === world.ship.typeId);

  return {
    portName: port?.name ?? "未知",
    portDescription: port?.description ?? "",
    region: port?.region ?? "",
    playerGold: world.player.gold,
    cargoCount: getUsedCapacity(world),
    cargoCapacity: getMaxCapacity(world),
    currentDay: world.player.day,
    shipName: ship?.name ?? "未知",
  };
}

export function buildMarketView(world: World): MarketView {
  const port = PORTS.find((p) => p.id === world.player.currentPortId);
  const portGoods = getPortGoods(world.player.currentPortId, world);

  const goods: GoodView[] = portGoods.map(({ good, buyPrice }) => {
    const cargo = world.ship.cargo.find((c) => c.goodId === good.id);
    const inCargo = cargo?.quantity ?? 0;

    return {
      id: good.id,
      name: good.name,
      category: CATEGORY_LABEL[good.category],
      buyPrice,
      sellPrice: getSellPrice(good.id, world.player.currentPortId, world),
      inCargo,
      canAfford: world.player.gold >= buyPrice,
    };
  });

  return {
    portName: port?.name ?? "未知",
    goods,
    playerGold: world.player.gold,
    cargoCount: getUsedCapacity(world),
    cargoCapacity: getMaxCapacity(world),
  };
}

export function buildNavigationView(world: World): NavigationView {
  const port = PORTS.find((p) => p.id === world.player.currentPortId);
  const reachable = getReachablePorts(world);

  const destinations: DestinationView[] = reachable.map((r) => {
    // 预估利润 = 当前 cargo 到目标港预估
    const estimatedProfit = world.ship.cargo.reduce((sum, c) => {
      const targetPrice = getSellPrice(c.goodId, r.port.id, world);
      return sum + (targetPrice - c.buyPrice) * c.quantity;
    }, 0);

    return {
      portId: r.port.id,
      portName: r.port.name,
      region: r.port.region,
      distance: r.distance,
      travelDays: r.travelDays,
      estimatedProfit,
    };
  });

  return {
    currentPortName: port?.name ?? "未知",
    destinations,
  };
}

export function buildCargoView(world: World): CargoView {
  const ship = SHIPS.find((s) => s.id === world.ship.typeId);

  const items: CargoItemView[] = world.ship.cargo.map((c) => {
    const good = GOODS.find((g) => g.id === c.goodId);
    const sellPrice = getSellPrice(c.goodId, world.player.currentPortId, world);
    return {
      goodId: c.goodId,
      goodName: good?.name ?? "未知",
      quantity: c.quantity,
      buyPrice: c.buyPrice,
      sellPrice,
      estimatedProfit: (sellPrice - c.buyPrice) * c.quantity,
    };
  });

  return {
    shipName: ship?.name ?? "未知",
    usedCapacity: getUsedCapacity(world),
    maxCapacity: getMaxCapacity(world),
    items,
  };
}

export function buildShipView(world: World): ShipView {
  const shipConfig = SHIPS.find((s) => s.id === world.ship.typeId);
  if (!shipConfig) throw new Error("无效船只");

  const level = world.ship.upgradeLevel;
  const canUpgrade = level < shipConfig.maxUpgradeLevel;
  const upgradeCost = canUpgrade ? shipConfig.upgradeCosts[level] : null;

  return {
    shipName: shipConfig.name,
    upgradeLevel: level,
    maxUpgradeLevel: shipConfig.maxUpgradeLevel,
    capacity: getMaxCapacity(world),
    speed: shipConfig.speed,
    playerGold: world.player.gold,
    upgradeCost,
    blockedByVoyage: !!world.voyage,
    canUpgrade:
      canUpgrade &&
      world.player.gold >= (upgradeCost ?? Infinity) &&
      !world.voyage,
  };
}

export function buildVoyageView(world: World): VoyageView {
  const voyage = world.voyage;
  if (!voyage) {
    return {
      fromPortName: "未知",
      toPortName: "未知",
      travelDays: 0,
      isUnderway: false,
      events: [],
    };
  }

  const fromPort = PORTS.find((p) => p.id === voyage.fromPortId);
  const toPort = PORTS.find((p) => p.id === voyage.toPortId);

  const events: VoyageEventView[] = voyage.events.map((e) => {
    const parts: string[] = [];
    if (e.goldChange > 0) {
      parts.push(`获得 ${e.goldChange} 金币`);
    } else if (e.goldChange < 0) {
      parts.push(`损失 ${Math.abs(e.goldChange)} 金币`);
    }
    if (e.cargoLoss > 0) {
      parts.push(`丢失 ${e.cargoLoss} 单位货物`);
    }
    return {
      day: e.day,
      description: e.description,
      effect: parts.length > 0 ? parts.join("，") : "无影响",
    };
  });

  return {
    fromPortName: fromPort?.name ?? "未知",
    toPortName: toPort?.name ?? "未知",
    travelDays: voyage.travelDays,
    isUnderway: true,
    events,
  };
}
