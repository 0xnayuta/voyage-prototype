"use client";

import { useActionState } from "react";
import { loadShipView, repairShipAction, upgradeShipAction } from "./actions";

export default function ShipPage() {
  const [view, loadAction, isLoading] = useActionState(loadShipView, null);
  const [afterUpgrade, doUpgrade] = useActionState(upgradeShipAction, null);
  const [afterRepair, doRepair] = useActionState(repairShipAction, null);

  const displayView = afterUpgrade ?? afterRepair ?? view;

  if (!displayView) {
    return (
      <form
        action={loadAction}
        className="flex-1 flex items-center justify-center"
      >
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-gold-500 px-6 py-3 text-lg font-bold text-ocean-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {isLoading ? "加载中..." : "进入造船厂"}
        </button>
      </form>
    );
  }

  const canUpgrade = displayView.canUpgrade;
  const blockedByVoyage = displayView.blockedByVoyage;
  const hpPercent =
    displayView.maxHp > 0
      ? Math.round((displayView.currentHp / displayView.maxHp) * 100)
      : 0;

  const hpColor =
    hpPercent > 60
      ? "bg-green-500"
      : hpPercent > 30
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-4">
      <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 px-4 py-2 text-sm">
        <span className="font-bold text-gold-400">造船厂</span>
      </div>

      {/* 当前船只 */}
      <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 p-4">
        <h3 className="text-lg font-semibold text-gold-400">
          {displayView.shipName}
        </h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-parchment-dark">等级</span>
            <span className="text-parchment">
              Lv.{displayView.upgradeLevel}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-parchment-dark">舱容</span>
            <span className="text-parchment">{displayView.capacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-parchment-dark">航速</span>
            <span className="text-parchment">{displayView.speed}</span>
          </div>

          {/* HP 条 */}
          <div className="pt-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-parchment-dark">船体耐久</span>
              <span
                className={
                  hpPercent > 60
                    ? "text-green-400"
                    : hpPercent > 30
                      ? "text-yellow-400"
                      : "text-red-400"
                }
              >
                {displayView.currentHp} / {displayView.maxHp}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ocean-700">
              <div
                className={`h-full rounded-full transition-all ${hpColor}`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 维修区域 */}
      {displayView.currentHp < displayView.maxHp && !blockedByVoyage && (
        <form
          action={doRepair}
          className="rounded-lg border border-ocean-600 bg-ocean-800/80 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-parchment-dark">维修船体</span>
              <p className="text-xs text-parchment-dark mt-1">
                费用：{displayView.repairCost} 金币
              </p>
            </div>
            <button
              type="submit"
              disabled={!displayView.canRepair}
              className="rounded bg-gold-500 px-4 py-2 text-sm font-bold text-ocean-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
            >
              维修
            </button>
          </div>
        </form>
      )}

      {/* 升级区域 */}
      <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-parchment-dark">
              升级船只
              {displayView.upgradeCost !== null && (
                <span className="ml-2 text-xs text-gold-400">
                  费用：{displayView.upgradeCost.toLocaleString()} 金币
                </span>
              )}
            </span>
            <p className="text-xs text-parchment-dark mt-1">
              升级后舱容扩大，耐久提升
            </p>
          </div>
          <form action={doUpgrade}>
            <button
              type="submit"
              disabled={!canUpgrade}
              className="rounded bg-gold-500 px-4 py-2 text-sm font-bold text-ocean-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
            >
              {blockedByVoyage
                ? "航行中"
                : displayView.upgradeCost === null
                  ? "已达最高"
                  : "升级"}
            </button>
          </form>
        </div>
      </div>

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
