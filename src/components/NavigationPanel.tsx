"use client";
import { useState, useTransition } from "react";

import { startTravel } from "../app/actions/travel";
import { updateArmamentLevel } from "../app/navigation/actions";
import {
  SURVIVAL_DEFENSE_FACTOR,
  SURVIVAL_HP_PENALTY_FACTOR,
} from "../data/formulas";
import { calcDefenseScore } from "../game/domain/ship";
import type { NavigationView } from "../types/game-view";
import { ArmamentConfig } from "./ArmamentConfig";
import { DepartureConfirmModal } from "./DepartureConfirmModal";
import { DestinationsTable } from "./DestinationsTable";

interface NavigationPanelProps {
  readonly view: NavigationView;
}

export function NavigationPanel({ view }: NavigationPanelProps) {
  const [isTravelPending, startTravelTransition] = useTransition();
  const [selectedDest, setSelectedDest] = useState<{
    portId: string;
    portName: string;
    travelDays: number;
    estimatedProfit: number;
    baseDangerScore: number;
  } | null>(null);

  const [selectedArmament, setSelectedArmament] = useState(
    view.currentArmament,
  );

  const selectedOption = view.armamentOptions[selectedArmament];
  const isOverCargo =
    view.currentCargoCount >
    (selectedOption?.effectiveCapacity ?? view.currentCargoCount);
  const riskLevel = selectedOption?.defenseMultiplier ?? 1;

  function getSurvivalRate(baseDangerScore: number): number {
    const score = calcDefenseScore(
      selectedOption?.defenseMultiplier ?? 1,
      view.hpRatio,
      SURVIVAL_DEFENSE_FACTOR,
      SURVIVAL_HP_PENALTY_FACTOR,
    );
    return Math.min(99, Math.max(5, Math.floor(score - baseDangerScore)));
  }

  return (
    <div className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-4">
      <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 px-4 py-2 text-sm">
        <span className="font-bold text-gold-400">
          航海图 - 当前港口：{view.currentPortName}
        </span>
      </div>

      <ArmamentConfig
        options={view.armamentOptions}
        selectedIndex={selectedArmament}
        isOverCargo={isOverCargo}
        riskLevel={riskLevel}
        currentCargoCount={view.currentCargoCount}
        onChange={(level) => {
          const armLevel = level as 0 | 1 | 2;
          setSelectedArmament(armLevel);
          updateArmamentLevel(armLevel);
        }}
      />

      <DestinationsTable
        destinations={view.destinations}
        getSurvivalRate={getSurvivalRate}
        onSelectDestination={setSelectedDest}
      />

      {selectedDest && (
        <DepartureConfirmModal
          dest={selectedDest}
          isOverCargo={isOverCargo}
          armamentLabel={selectedOption?.label ?? "满载货物"}
          survivalRate={getSurvivalRate(selectedDest.baseDangerScore)}
          isTravelPending={isTravelPending}
          onConfirm={() => {
            startTravelTransition(async () => {
              const fd = new FormData();
              fd.set("portId", selectedDest.portId);
              await startTravel(fd);
            });
          }}
          onClose={() => setSelectedDest(null)}
        />
      )}

      <div className="text-center">
        <a
          href="/"
          className="inline-block rounded border border-ocean-600 px-4 py-2 text-sm text-parchment-dark hover:bg-ocean-700 transition-colors"
        >
          返回港口
        </a>
      </div>
    </div>
  );
}
