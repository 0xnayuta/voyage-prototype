"use client"
import type { ReactNode } from "react"

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** 通用弹窗 — 半透明遮罩 + 居中面板 */
export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-80 rounded-lg border border-ocean-600 bg-ocean-800 p-6 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gold-400">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-parchment-dark hover:text-parchment text-lg leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
