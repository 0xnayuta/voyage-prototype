"use client";

import type { DestinationView } from "../types/game-view";
import { useSort } from "./ui/useSort";

interface DestinationsTableProps {
  readonly destinations: DestinationView[];
  readonly getSurvivalRate: (baseDangerScore: number) => number;
  readonly onSelectDestination: (dest: DestinationView) => void;
}

export function DestinationsTable({
  destinations,
  getSurvivalRate,
  onSelectDestination,
}: DestinationsTableProps) {
  const { sortColumn, sortDir, toggleSort, sortIndicator } = useSort();

  const sortedDestinations = [...destinations].sort((a, b) => {
    if (!sortColumn || !sortDir) return 0;
    let cmp = 0;
    switch (sortColumn) {
      case "portName":
        cmp = a.portName.localeCompare(b.portName);
        break;
      case "region":
        cmp = a.region.localeCompare(b.region);
        break;
      case "distance":
        cmp = a.distance - b.distance;
        break;
      case "travelDays":
        cmp = a.travelDays - b.travelDays;
        break;
      case "survivalRate":
        cmp = a.baseDangerScore - b.baseDangerScore;
        break;
      case "estimatedProfit":
        cmp = a.estimatedProfit - b.estimatedProfit;
        break;
    }
    return sortDir === "desc" ? -cmp : cmp;
  });

  return (
    <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 overflow-hidden">
      <div className="grid grid-cols-8 gap-2 border-b border-ocean-600 bg-ocean-700/60 px-4 py-2 text-xs font-semibold text-parchment-dark uppercase tracking-wider">
        <button
          type="button"
          onClick={() => toggleSort("portName")}
          className="col-span-2 text-left cursor-pointer hover:text-gold-400 transition-colors"
        >
          目的地{sortIndicator("portName")}
        </button>
        <button
          type="button"
          onClick={() => toggleSort("region")}
          className="text-left cursor-pointer hover:text-gold-400 transition-colors"
        >
          地区{sortIndicator("region")}
        </button>
        <button
          type="button"
          onClick={() => toggleSort("distance")}
          className="text-center cursor-pointer hover:text-gold-400 transition-colors"
        >
          距离{sortIndicator("distance")}
        </button>
        <button
          type="button"
          onClick={() => toggleSort("travelDays")}
          className="text-center cursor-pointer hover:text-gold-400 transition-colors"
        >
          天数{sortIndicator("travelDays")}
        </button>
        <button
          type="button"
          onClick={() => toggleSort("survivalRate")}
          className="text-center cursor-pointer hover:text-gold-400 transition-colors"
        >
          生存率{sortIndicator("survivalRate")}
        </button>
        <button
          type="button"
          onClick={() => toggleSort("estimatedProfit")}
          className="text-center cursor-pointer hover:text-gold-400 transition-colors"
        >
          预估利润{sortIndicator("estimatedProfit")}
        </button>
        <span />
      </div>
      {sortedDestinations.map((dest) => (
        <div
          key={dest.portId}
          className="grid grid-cols-8 gap-2 items-center border-b border-ocean-700/30 px-4 py-3 text-sm hover:bg-ocean-700/40 transition-colors last:border-b-0"
        >
          <span className="col-span-2 font-medium">{dest.portName}</span>
          <span className="text-xs text-parchment-dark">{dest.region}</span>
          <span className="text-center text-parchment-dark">
            {dest.distance}
          </span>
          <span className="text-center text-gold-400">{dest.travelDays}</span>
          <span
            className={`text-center ${
              getSurvivalRate(dest.baseDangerScore) >= 70
                ? "text-green-400"
                : getSurvivalRate(dest.baseDangerScore) >= 40
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {getSurvivalRate(dest.baseDangerScore)}%
          </span>
          <span
            className={`text-center ${
              dest.estimatedProfit > 0
                ? "text-green-400"
                : dest.estimatedProfit < 0
                  ? "text-red-400"
                  : "text-parchment-dark"
            }`}
          >
            {dest.estimatedProfit > 0
              ? `+${dest.estimatedProfit.toLocaleString()}`
              : dest.estimatedProfit.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={() => onSelectDestination(dest)}
            className="rounded bg-gold-500/20 px-2 py-1 text-xs text-gold-400 hover:bg-gold-500/30 transition-colors"
          >
            前往
          </button>
        </div>
      ))}
    </div>
  );
}
