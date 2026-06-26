"use client"

import { useActionState, useState, useTransition } from "react"
import { Modal } from "../../components/ui/Modal"
import { loadNavigationView } from "./actions"
import { startTravel } from "../actions/travel"
import type { NavigationView, DestinationView } from "../../types/game-view"

export default function NavigationPage() {
  const [view, loadAction, isLoading] = useActionState(loadNavigationView, null)
  const [isTravelPending, startTravelTransition] = useTransition()
  const [selectedDest, setSelectedDest] = useState<DestinationView | null>(null)

  if (!view) {
    return (
      <form action={loadAction} className="flex-1 flex items-center justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-gold-500 px-6 py-3 text-lg font-bold text-ocean-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {isLoading ? "加载中..." : "打开航海图"}
        </button>
      </form>
    )
  }


  return (
    <div className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-4">
      <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 px-4 py-2 text-sm">
        <span className="font-bold text-gold-400">
          航海图 - 当前港口：{view.currentPortName}
        </span>
      </div>

      {/* 目的地列表 */}
      <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 overflow-hidden">
        <div className="grid grid-cols-5 gap-2 border-b border-ocean-600 bg-ocean-700/60 px-4 py-2 text-xs font-semibold text-parchment-dark uppercase tracking-wider">
          <span>目的地</span>
          <span>地区</span>
          <span className="text-right">距离</span>
          <span className="text-right">天数</span>
          <span />
        </div>
        {view.destinations.map((dest) => (
          <div
            key={dest.portId}
            className="grid grid-cols-5 gap-2 items-center border-b border-ocean-700/30 px-4 py-3 text-sm hover:bg-ocean-700/40 transition-colors last:border-b-0"
          >
            <span className="font-medium">{dest.portName}</span>
            <span className="text-xs text-parchment-dark">{dest.region}</span>
            <span className="text-right text-parchment-dark">
              {dest.distance}
            </span>
            <span className="text-right text-gold-400">{dest.travelDays}</span>
            <button
              type="button"
              onClick={() => setSelectedDest(dest)}
              className="rounded bg-gold-500/20 px-2 py-1 text-xs text-gold-400 hover:bg-gold-500/30 transition-colors"
            >
              前往
            </button>
          </div>
        ))}
      </div>

      {/* 确认出航弹窗 */}
      {selectedDest && (
        <Modal
          title="出航确认"
          onClose={() => setSelectedDest(null)}
        >
          <div className="space-y-2 text-sm text-parchment-dark">
            <div className="flex justify-between">
              <span>目的港</span>
              <span className="font-medium text-parchment">
                {selectedDest.portName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>航行天数</span>
              <span className="text-gold-400">{selectedDest.travelDays} 天</span>
            </div>
            {selectedDest.estimatedProfit !== 0 && (
              <div className="flex justify-between">
                <span>预估利润</span>
                <span className={selectedDest.estimatedProfit > 0 ? "text-gold-400" : "text-red-400"}>
                  {selectedDest.estimatedProfit > 0
                    ? `+${selectedDest.estimatedProfit.toLocaleString()}`
                    : selectedDest.estimatedProfit.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <form
            action={async (formData) => {
              startTravelTransition(async () => {
                await startTravel(formData)
                window.location.href = "/voyage"
              })
            }}
            className="mt-4 flex gap-2"
          >
            <input type="hidden" name="portId" value={selectedDest.portId} />
            <button
              type="submit"
              disabled={isTravelPending}
              className="flex-1 rounded bg-gold-500 py-2 text-sm font-bold text-ocean-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
            >
              {isTravelPending ? "出航中..." : "确认出航"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedDest(null)}
              className="rounded bg-ocean-700 px-4 py-2 text-sm hover:bg-ocean-600 transition-colors"
            >
              取消
            </button>
          </form>
        </Modal>
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
  )
}
