"use client"

import { useActionState } from "react"
import { loadShipView, upgradeShipAction } from "./actions"

export default function ShipPage() {
  const [view, loadAction, isLoading] = useActionState(loadShipView, null)
  const [afterView, upgradeAction, isUpgrading] = useActionState(
    upgradeShipAction,
    null,
  )

  // 优先展示升级后的视图，否则用加载视图
  const displayView = afterView ?? view

  if (!displayView) {
    return (
      <form action={loadAction} className="flex-1 flex items-center justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-gold-500 px-6 py-3 text-lg font-bold text-ocean-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {isLoading ? "加载中..." : "进入造船厂"}
        </button>
      </form>
    )
  }

  const canUpgrade = displayView.canUpgrade
  const blockedByVoyage = displayView.blockedByVoyage

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
            <span>
              {displayView.upgradeLevel} / {displayView.maxUpgradeLevel}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-parchment-dark">舱容</span>
            <span>{displayView.capacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-parchment-dark">航速</span>
            <span>{displayView.speed}</span>
          </div>
        </div>
      </div>

      {/* 升级区域 */}
      <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 p-4">
        <h4 className="text-sm font-semibold text-gold-400 mb-3">升级</h4>
        {displayView.upgradeCost !== null ? (
          <form action={upgradeAction} className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-parchment-dark">升级费用</span>
              <span className="text-gold-400 font-bold">
                {displayView.upgradeCost.toLocaleString()} 金币
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-parchment-dark">当前持有</span>
              <span
                className={
                  canUpgrade ? "text-green-400" : "text-red-400"
                }
              >
                {displayView.playerGold.toLocaleString()} 金币
              </span>
            </div>
            <button
              type="submit"
              disabled={!canUpgrade || isUpgrading}
              className={`w-full rounded py-2 text-sm font-bold transition-colors ${
                canUpgrade
                  ? "bg-gold-500 text-ocean-900 hover:bg-gold-400"
                  : "bg-ocean-700 text-parchment-dark/50 cursor-not-allowed"
              }`}
            >
              {isUpgrading
                ? "升级中..."
                : canUpgrade
                  ? "升级"
                  : blockedByVoyage
                    ? "航行中无法升级"
                    : "金币不足"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-parchment-dark">已达最高等级</p>
        )}
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
  )
}
