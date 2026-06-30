import { describe, expect, it } from "bun:test";
import {
  calcCrewUpkeep,
  calcMinCrewForFleet,
  deductCrewUpkeep,
  fireCrew,
  getMaxCrewCapacity,
  hireCrew,
  recalculateMaxCrew,
} from "../crew";
import { createEmptyWorld, createTestWorld } from "./helpers";

describe("crew domain logic", () => {
  describe("getMaxCrewCapacity", () => {
    it("returns correct crew capacity for a sloop (capacity 35) -> 7", () => {
      const world = createTestWorld();
      const cap = getMaxCrewCapacity(world.fleet.ships);
      expect(cap).toBe(7); // 35 / 5 = 7
    });
    it("returns correct crew capacity for an upgraded sloop (hull level 1 -> capacity 42) -> 8", () => {
      const world = createTestWorld();
      const upgradedShips = [
        {
          ...world.fleet.ships[0],
          equipment: {
            ...world.fleet.ships[0].equipment,
            hullLevel: 1, // 35 * 1.2 = 42 capacity
          },
        },
      ];
      const cap = getMaxCrewCapacity(upgradedShips);
      expect(cap).toBe(8); // Math.floor(42 / 5) = 8
    });
    it("sums capacity of multiple ships correctly", () => {
      const world = createTestWorld();
      const multipleShips = [
        world.fleet.ships[0], // Sloop: capacity 35
        {
          ...world.fleet.ships[0],
          id: "ship-2",
          typeId: "cog", // Cog: capacity 100
        },
      ];
      const cap = getMaxCrewCapacity(multipleShips);
      expect(cap).toBe(27); // (35 + 100) / 5 = 27
    });
  });

  describe("calcMinCrewForFleet", () => {
    it("returns correct min crew for a single sloop -> 3", () => {
      const world = createTestWorld();
      const minCrew = calcMinCrewForFleet(world, ["ship-1"]);
      expect(minCrew).toBe(3);
    });

    it("returns correct min crew for sloop + cog -> 11", () => {
      const world = createTestWorld();
      const customWorld = {
        ...world,
        fleet: {
          ...world.fleet,
          ships: [
            world.fleet.ships[0], // sloop (baseCrew: 3)
            {
              id: "ship-2",
              typeId: "cog", // cog (baseCrew: 8)
              name: "大柯克",
              equipment: {
                hullLevel: 0,
                sailLevel: 0,
                armorLevel: 0,
                cannonLevel: 0,
              },
              durability: 80,
              maxDurability: 80,
              cargo: [],
              armamentLevel: 0,
              equippedItems: [],
            },
          ],
        },
      };
      const minCrew = calcMinCrewForFleet(customWorld, ["ship-1", "ship-2"]);
      expect(minCrew).toBe(11); // 3 + 8 = 11
    });
  });

  describe("hireCrew", () => {
    it("hires successfully and deducts correct gold (with price scaling)", () => {
      const world = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]],
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 3,
          maxCrew: 6,
          gold: 5000,
        },
      });

      // Hiring 1 crew member (current crew: 3)
      // Cost: 20 * (1 + 3 * 0.1) = 26
      const nextWorld = hireCrew(world, 1);
      expect(nextWorld.fleet.crew).toBe(4);
      expect(nextWorld.fleet.gold).toBe(5000 - 26);
    });

    it("hires multiple crew members successfully with cumulative scaling cost", () => {
      const world = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]],
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 3,
          maxCrew: 6,
          gold: 5000,
        },
      });

      // Hiring 2 crew members (current: 3)
      // 1st hire (current 3): 20 * 1.3 = 26
      // 2nd hire (current 4): 20 * 1.4 = 28
      // Total cost = 54
      const nextWorld = hireCrew(world, 2);
      expect(nextWorld.fleet.crew).toBe(5);
      expect(nextWorld.fleet.gold).toBe(5000 - 54);
    });

    it("throws error if hiring exceeds max crew capacity", () => {
      const world = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]],
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 5,
          maxCrew: 6,
          gold: 5000,
        },
      });

      expect(() => hireCrew(world, 2)).toThrow("CREW_EXCEEDS_CAPACITY");
    });

    it("throws error if gold is insufficient", () => {
      const world = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]],
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 3,
          maxCrew: 6,
          gold: 10, // Not enough gold (need 26)
        },
      });

      expect(() => hireCrew(world, 1)).toThrow("INSUFFICIENT_GOLD");
    });

    it("throws error if in voyage", () => {
      const world = createEmptyWorld({
        voyage: {
          fromPortId: "quanzhou",
          toPortId: "malacca",
          departureDay: 1,
          travelDays: 5,
          events: [],
          fleetShipIds: ["ship-1"],
        },
      });

      expect(() => hireCrew(world, 1)).toThrow("IN_VOYAGE");
    });
  });

  describe("fireCrew", () => {
    it("fires crew successfully", () => {
      const world = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]],
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 3,
          maxCrew: 6,
          gold: 5000,
        },
      });

      const nextWorld = fireCrew(world, 1);
      expect(nextWorld.fleet.crew).toBe(2);
    });

    it("throws error if firing more than current crew size", () => {
      const world = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]],
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 3,
          maxCrew: 6,
          gold: 5000,
        },
      });

      expect(() => fireCrew(world, 4)).toThrow("INVALID_QUANTITY");
    });

    it("throws error if in voyage", () => {
      const world = createEmptyWorld({
        voyage: {
          fromPortId: "quanzhou",
          toPortId: "malacca",
          departureDay: 1,
          travelDays: 5,
          events: [],
          fleetShipIds: ["ship-1"],
        },
      });

      expect(() => fireCrew(world, 1)).toThrow("IN_VOYAGE");
    });
  });

  describe("upkeep calculation & deduction", () => {
    it("calculates correct upkeep", () => {
      expect(calcCrewUpkeep(3, 5)).toBe(30); // 3 crew * 5 days * 2 gold/day = 30
      expect(calcCrewUpkeep(0, 5)).toBe(0);
      expect(calcCrewUpkeep(3, 0)).toBe(0);
    });

    it("deducts upkeep from gold and clamps to 0", () => {
      const world1 = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]],
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 3,
          maxCrew: 6,
          gold: 100,
        },
      });
      const nextWorld1 = deductCrewUpkeep(world1, 5);
      expect(nextWorld1.fleet.gold).toBe(70); // 100 - 30 = 70

      const world2 = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]],
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 3,
          maxCrew: 6,
          gold: 10,
        },
      });
      const nextWorld2 = deductCrewUpkeep(world2, 5);
      expect(nextWorld2.fleet.gold).toBe(0); // Clamped to 0
    });
  });

  describe("recalculateMaxCrew", () => {
    it("updates maxCrew and clamps current crew if it exceeds new maxCrew", () => {
      const world = createEmptyWorld({
        fleet: {
          ships: [createEmptyWorld().fleet.ships[0]], // Sloop: capacity 35 -> maxCrew 7
          activeShipId: "ship-1",
          maxShips: 1,
          crew: 7,
          maxCrew: 18, // artificially set high
          gold: 5000,
        },
      });

      const nextWorld = recalculateMaxCrew(world);
      expect(nextWorld.fleet.maxCrew).toBe(7);
      expect(nextWorld.fleet.crew).toBe(7);

      const overWorld = {
        ...world,
        fleet: {
          ...world.fleet,
          crew: 10, // exceeds maxCrew of 7
        },
      };
      const nextOverWorld = recalculateMaxCrew(overWorld);
      expect(nextOverWorld.fleet.maxCrew).toBe(7);
      expect(nextOverWorld.fleet.crew).toBe(7); // Clamped to 7!
    });
  });
});
