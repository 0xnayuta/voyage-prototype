import { afterEach, describe, expect, it, vi } from "bun:test";
import { GOODS } from "../../../data/goods";
import {
  applyDayPass,
  applyTradeImpact,
  getBuyPrice,
  getCurrentPrice,
  getPortGoods,
  getSellPrice,
} from "../market";
import { createTestWorld } from "./helpers";

describe("market pure functions", () => {
  describe("getCurrentPrice", () => {
    it("reads stored price for silk in quanzhou", () => {
      const world = createTestWorld();
      // east_asia textile=0.8 × quanzhou local=0.85 = 0.68 × 120 → 82
      expect(getCurrentPrice("silk", "quanzhou", world)).toBe(82);
    });

    it("reads stored price for spice in quanzhou", () => {
      const world = createTestWorld();
      // east_asia material=1.15 × quanzhou local=1.0 = 1.15 × 200 → 230
      expect(getCurrentPrice("spice", "quanzhou", world)).toBe(230);
    });

    it("throws for unknown port", () => {
      const world = createTestWorld();
      expect(() => getCurrentPrice("silk", "atlantis", world)).toThrow(
        "UNKNOWN_PORT",
      );
    });

    it("throws for unknown good", () => {
      const world = createTestWorld();
      expect(() => getCurrentPrice("unicorn", "quanzhou", world)).toThrow(
        "NO_PRICE_DATA",
      );
    });
  });

  describe("getBuyPrice", () => {
    it("equals current price", () => {
      const world = createTestWorld();
      const price = getCurrentPrice("silk", "quanzhou", world);
      expect(getBuyPrice("silk", "quanzhou", world)).toBe(price);
    });
  });

  describe("getSellPrice", () => {
    it("equals current price", () => {
      const world = createTestWorld();
      const price = getCurrentPrice("silk", "quanzhou", world);
      expect(getSellPrice("silk", "quanzhou", world)).toBe(price);
    });
  });

  describe("getPortGoods", () => {
    it(`returns all ${GOODS.length} goods with computed prices for quanzhou`, () => {
      const world = createTestWorld();
      const goods = getPortGoods("quanzhou", world);

      expect(goods).toHaveLength(GOODS.length);

      const silk = goods.find((g) => g.good.id === "silk");
      expect(silk).toBeDefined();
      expect(silk?.buyPrice).toBe(82);
      const spice = goods.find((g) => g.good.id === "spice");
      expect(spice).toBeDefined();
      expect(spice?.buyPrice).toBe(230);
    });

    it("returns correct prices for a different port", () => {
      const world = createTestWorld();
      const goods = getPortGoods("malacca", world);

      expect(goods).toHaveLength(GOODS.length);
      for (const entry of goods) {
        expect(entry.buyPrice).toBeGreaterThan(0);
        expect(entry.good.id).toBeTruthy();
      }
    });
  });

  describe("applyTradeImpact", () => {
    it("buy 10 silk in quanzhou increases price (TRADE_IMPACT=0.05)", () => {
      const world = createTestWorld();
      // 82 × (1 + 10 × 0.05) = 82 × 1.5 = 123
      const updated = applyTradeImpact(world, "quanzhou", "silk", 10, true);
      expect(getCurrentPrice("silk", "quanzhou", updated)).toBe(123);
    });

    it("sell 10 silk decreases price", () => {
      const world = createTestWorld();
      // 82 × (1 - 10 × 0.05) = 82 × 0.5 = 41
      const updated = applyTradeImpact(world, "quanzhou", "silk", 10, false);
      expect(getCurrentPrice("silk", "quanzhou", updated)).toBe(41);
    });

    it("quantity 0 returns original world unchanged", () => {
      const world = createTestWorld();
      const updated = applyTradeImpact(world, "quanzhou", "silk", 0, true);
      expect(updated).toBe(world);
      expect(getCurrentPrice("silk", "quanzhou", updated)).toBe(82);
    });

    it("price never drops below 1 after large sell", () => {
      const world = createTestWorld();
      const updated = applyTradeImpact(world, "quanzhou", "silk", 1000, false);
      expect(getCurrentPrice("silk", "quanzhou", updated)).toBe(1);
    });

    it("does not mutate original world", () => {
      const world = createTestWorld();
      const originalPrice = getCurrentPrice("silk", "quanzhou", world);
      applyTradeImpact(world, "quanzhou", "silk", 10, true);
      expect(getCurrentPrice("silk", "quanzhou", world)).toBe(originalPrice);
    });
  });

  describe("applyDayPass", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("does not throw", () => {
      const world = createTestWorld();
      expect(() => applyDayPass(world)).not.toThrow();
    });

    it("all prices stay >= 1", () => {
      const world = createTestWorld();
      const updated = applyDayPass(world);
      const allPrices = Object.values(updated.market.prices).flatMap(
        Object.values,
      );
      for (const price of allPrices) {
        expect(price).toBeGreaterThanOrEqual(1);
      }
    });

    it("prices regress toward base after trade shock (zero noise)", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);

      const world = createTestWorld();
      // shock: buy 10 silk in quanzhou → 82 × 1.5 = 123
      const shocked = applyTradeImpact(world, "quanzhou", "silk", 10, true);
      expect(getCurrentPrice("silk", "quanzhou", shocked)).toBe(123);
      // day pass: regressed = 123 + (82-123)×0.03 = 123 - 1.23 = 121.77 → round 122
      const dayPassed = applyDayPass(shocked);
      expect(getCurrentPrice("silk", "quanzhou", dayPassed)).toBe(122);
    });

    it("sell shock price regresses upward toward base (zero noise)", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);

      const world = createTestWorld();
      // shock: sell 10 silk → 82 × 0.5 = 41
      const shocked = applyTradeImpact(world, "quanzhou", "silk", 10, false);
      expect(getCurrentPrice("silk", "quanzhou", shocked)).toBe(41);
      // day pass: regressed = 41 + (82-41)×0.03 = 41 + 1.23 = 42.23 → round 42
      const dayPassed = applyDayPass(shocked);
      expect(getCurrentPrice("silk", "quanzhou", dayPassed)).toBe(42);
    });

    it("does not mutate original world", () => {
      const world = createTestWorld();
      const snapshot = structuredClone(world);
      applyDayPass(world);
      expect(world).toEqual(snapshot);
    });
  });
});
