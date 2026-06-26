import { GOODS } from "../../data/goods";
import { SHIPS } from "../../data/ships";
import { applyTradeImpact, getBuyPrice, getSellPrice } from "./market";
import type { CargoItem, World } from "./types";
import { DomainError } from "./types";

// ============================================================
// 买卖逻辑 — 纯函数
// ============================================================

// ---- 容量计算 ----

export function getUsedCapacity(world: World): number {
  return world.ship.cargo.reduce((total, item) => {
    const good = GOODS.find((g) => g.id === item.goodId);
    return total + (good?.volume ?? 0) * item.quantity;
  }, 0);
}

export function getMaxCapacity(world: World): number {
  const ship = SHIPS.find((s) => s.id === world.ship.typeId);
  if (!ship) return 0;
  // 每升一级 +20% 容量
  return Math.floor(ship.capacity * (1 + world.ship.upgradeLevel * 0.2));
}

// ---- 买入 ----

export interface BuyInput {
  readonly goodId: string;
  readonly quantity: number;
}

export interface BuyResult {
  readonly world: World;
  readonly totalCost: number;
}

export function executeBuy(world: World, input: BuyInput): BuyResult {
  const { goodId, quantity } = input;
  if (quantity <= 0) throw new DomainError("INVALID_QUANTITY");

  const price = getBuyPrice(goodId, world.player.currentPortId, world);
  const totalCost = price * quantity;

  if (world.player.gold < totalCost) throw new DomainError("INSUFFICIENT_GOLD");

  const good = GOODS.find((g) => g.id === goodId);
  if (!good) throw new DomainError("GOOD_NOT_FOUND");

  const usedCapacity = getUsedCapacity(world);
  const maxCapacity = getMaxCapacity(world);
  const neededVolume = good.volume * quantity;
  if (usedCapacity + neededVolume > maxCapacity)
    throw new DomainError("INSUFFICIENT_CARGO");

  const existingIndex = world.ship.cargo.findIndex((c) => c.goodId === goodId);

  let newCargo: CargoItem[];
  if (existingIndex >= 0) {
    newCargo = world.ship.cargo.map((c, i) =>
      i === existingIndex
        ? {
            ...c,
            quantity: c.quantity + quantity,
            // 加权平均买入价
            buyPrice: Math.round(
              (c.buyPrice * c.quantity + price * quantity) /
                (c.quantity + quantity),
            ),
          }
        : c,
    );
  } else {
    newCargo = [
      ...world.ship.cargo,
      {
        goodId,
        quantity,
        buyPrice: price,
      },
    ];
  }

  // 买入后冲击价格（需求增加 → 涨价）
  const worldAfterTrade = applyTradeImpact(
    {
      ...world,
      ship: { ...world.ship, cargo: newCargo },
      player: { ...world.player, gold: world.player.gold - totalCost },
    },
    world.player.currentPortId,
    goodId,
    quantity,
    true, // isBuy
  );

  return {
    world: worldAfterTrade,
    totalCost,
  };
}

// ---- 卖出 ----

export interface SellInput {
  readonly goodId: string;
  readonly quantity: number;
}

export interface SellResult {
  readonly world: World;
  readonly totalRevenue: number;
  readonly profit: number;
}

export function executeSell(world: World, input: SellInput): SellResult {
  const { goodId, quantity } = input;
  if (quantity <= 0) throw new DomainError("INVALID_QUANTITY");

  const cargo = world.ship.cargo.find((c) => c.goodId === goodId);
  if (!cargo || cargo.quantity < quantity)
    throw new DomainError("CARGO_NOT_FOUND");

  const price = getSellPrice(goodId, world.player.currentPortId, world);
  const totalRevenue = price * quantity;

  // 先进先出：用已有的 buyPrice 计算利润
  const profit = (price - cargo.buyPrice) * quantity;

  const remaining = cargo.quantity - quantity;
  const newCargo =
    remaining > 0
      ? world.ship.cargo.map((c) =>
          c.goodId === goodId ? { ...c, quantity: remaining } : c,
        )
      : world.ship.cargo.filter((c) => c.goodId !== goodId);

  // 卖出后冲击价格（供应增加 → 降价）
  const worldAfterTrade = applyTradeImpact(
    {
      ...world,
      ship: { ...world.ship, cargo: newCargo },
      player: { ...world.player, gold: world.player.gold + totalRevenue },
    },
    world.player.currentPortId,
    goodId,
    quantity,
    false, // isBuy
  );

  return {
    world: worldAfterTrade,
    totalRevenue,
    profit,
  };
}
