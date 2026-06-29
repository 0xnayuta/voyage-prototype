"use client";

import { Modal } from "./ui/Modal";

interface DepartureConfirmModalProps {
  readonly dest: {
    portId: string;
    portName: string;
    travelDays: number;
    estimatedProfit: number;
  };
  readonly armamentLabel: string;
  readonly survivalRate: number;
  readonly isTravelPending: boolean;
  readonly isOverCargo: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
}

export function DepartureConfirmModal({
  dest,
  armamentLabel,
  survivalRate,
  isTravelPending,
  isOverCargo,
  onConfirm,
  onClose,
}: DepartureConfirmModalProps) {
  return (
    <Modal title="出航确认" onClose={onClose}>
      <div className="space-y-2 text-sm text-parchment-dark">
        <div className="flex justify-between">
          <span>目的港</span>
          <span className="font-medium text-parchment">{dest.portName}</span>
        </div>
        <div className="flex justify-between">
          <span>航行天数</span>
          <span className="text-gold-400">{dest.travelDays} 天</span>
        </div>
        <div className="flex justify-between">
          <span>出航配置</span>
          <span className="text-parchment">{armamentLabel}</span>
        </div>
        <div className="flex justify-between">
          <span>生存率</span>
          <span className="text-green-400">{survivalRate}%</span>
        </div>
        {dest.estimatedProfit !== 0 && (
          <div className="flex justify-between">
            <span>预估利润</span>
            <span
              className={
                dest.estimatedProfit > 0 ? "text-gold-400" : "text-red-400"
              }
            >
              {dest.estimatedProfit > 0
                ? `+${dest.estimatedProfit.toLocaleString()}`
                : dest.estimatedProfit.toLocaleString()}
            </span>
          </div>
        )}
        {isOverCargo && (
          <div className="rounded border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400 text-center">
            ⚠ 当前货物量超出有效舱容，请卸货或换装满载配置
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isTravelPending || isOverCargo}
          className="flex-1 rounded bg-gold-500 py-2 text-sm font-bold text-ocean-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {isTravelPending ? "出航中..." : "确认出航"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-ocean-700 px-4 py-2 text-sm hover:bg-ocean-600 transition-colors"
        >
          取消
        </button>
      </div>
    </Modal>
  );
}
