"use client";

import type { NavigationView } from "../types/game-view";

interface ArmamentConfigProps {
  readonly options: NavigationView["armamentOptions"];
  readonly selectedIndex: number;
  readonly isOverCargo: boolean;
  readonly riskLevel: number;
  readonly currentCargoCount: number;
  readonly onChange: (index: number) => void;
}

export function ArmamentConfig({
  options,
  selectedIndex,
  isOverCargo,
  riskLevel,
  currentCargoCount,
  onChange,
}: ArmamentConfigProps) {
  return (
    <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 p-4">
      <h3 className="text-sm font-semibold text-gold-400 mb-3">出航配置</h3>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.level}
            className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
              selectedIndex === opt.level
                ? "border-gold-500 bg-gold-500/10"
                : "border-ocean-600 hover:border-ocean-500"
            }`}
          >
            <input
              type="radio"
              name="armamentLevel"
              value={opt.level}
              checked={selectedIndex === opt.level}
              onChange={() => onChange(opt.level)}
              className="mt-0.5 accent-gold-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-parchment">
                  {opt.label}
                </span>
              </div>
              <div className="mt-1 flex gap-3 text-xs text-parchment-dark">
                <span>舱容 {opt.effectiveCapacity}</span>
                <span>{Math.round(opt.cargoRatio * 100)}%</span>
                <span>防御 {opt.defenseMultiplier.toFixed(1)}x</span>
              </div>
            </div>
          </label>
        ))}
      </div>

      {riskLevel < 1.5 && currentCargoCount > 0 && (
        <div className="mt-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          ⚠ 当前配置防御较低，高价值货物面临较高风险
        </div>
      )}
      {isOverCargo && (
        <div className="mt-2 rounded border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
          ⚠ 当前货物量超出该配置有效舱容，建议换装满载
        </div>
      )}
    </div>
  );
}
