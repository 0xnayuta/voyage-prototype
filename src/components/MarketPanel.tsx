"use client";

import { useState } from "react";
import {
  buyEquipmentAction,
  sellEquipmentAction,
} from "../app/actions/equipment";
import { buyGoods, sellGoods } from "../app/actions/trade";
import {
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENTS,
  getEquipmentEffectDescription,
} from "../data/equipment";
import type { MarketView } from "../types/game-view";
import { BuyModal } from "./BuyModal";
import { GoodsTable } from "./GoodsTable";
import { SellModal } from "./SellModal";

interface MarketPanelProps {
  readonly view: MarketView;
  readonly loadView: () => Promise<MarketView>;
}

export function MarketPanel({ view: initialView, loadView }: MarketPanelProps) {
  const [view, setView] = useState(initialView);
  const [buyingGoodId, setBuyingGoodId] = useState<string | null>(null);
  const [sellingGoodId, setSellingGoodId] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [isEquipmentPending, setIsEquipmentPending] = useState(false);

  async function handleBuyEquipment(equipmentId: string) {
    setIsEquipmentPending(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set("equipmentId", equipmentId);
      await buyEquipmentAction(fd);
      const newView = await loadView();
      setView(newView);
      const eq = EQUIPMENTS.find((e) => e.id === equipmentId);
      setMessage(`成功购买装备 ${eq?.name ?? ""}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "购买装备失败");
    } finally {
      setIsEquipmentPending(false);
    }
  }

  async function handleSellEquipment(equipmentId: string) {
    setIsEquipmentPending(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set("equipmentId", equipmentId);
      await sellEquipmentAction(fd);
      const newView = await loadView();
      setView(newView);
      const eq = EQUIPMENTS.find((e) => e.id === equipmentId);
      setMessage(`成功出售装备 ${eq?.name ?? ""}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "出售装备失败");
    } finally {
      setIsEquipmentPending(false);
    }
  }
  const [message, setMessage] = useState<string | null>(null);

  const buyingGood = buyingGoodId
    ? (view.goods.find((g) => g.id === buyingGoodId) ?? null)
    : null;
  const sellingGood = sellingGoodId
    ? (view.goods.find((g) => g.id === sellingGoodId) ?? null)
    : null;
  const remainingCargo = view.cargoCapacity - view.cargoCount;
  const maxBuyable = buyingGood
    ? Math.floor(remainingCargo / buyingGood.volume)
    : 0;

  async function handleBuy(goodId: string, quantity: number) {
    setIsBuying(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set("goodId", goodId);
      fd.set("quantity", String(quantity));
      await buyGoods(fd);
      const newView = await loadView();
      setView(newView);
      const good = view.goods.find((g) => g.id === goodId);
      setMessage(`成功购买 ${quantity} 个 ${good?.name ?? ""}`);
      setBuyingGoodId(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "购买失败");
    } finally {
      setIsBuying(false);
    }
  }

  async function handleSell(goodId: string, quantity: number) {
    setIsSelling(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set("goodId", goodId);
      fd.set("quantity", String(quantity));
      await sellGoods(fd);
      const newView = await loadView();
      setView(newView);
      setMessage(`成功卖出 ${quantity} 个商品`);
      setSellingGoodId(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "卖出失败");
    } finally {
      setIsSelling(false);
    }
  }

  return (
    <div className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-ocean-600 bg-ocean-800/80 px-4 py-2 text-sm">
        <span className="font-bold text-gold-400">
          {view.portName} - 交易所
        </span>
        <div className="flex items-center gap-4">
          <span className="text-gold-400">
            <span className="text-parchment-dark">金币</span>{" "}
            {view.playerGold.toLocaleString()}
          </span>
          <span className="text-parchment-dark">
            舱 {view.cargoCount}/{view.cargoCapacity}
          </span>
        </div>
      </div>

      {message && (
        <div className="rounded bg-ocean-700/80 px-3 py-2 text-sm text-gold-400 border border-gold-600/50">
          {message}
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-2 text-xs text-parchment-dark hover:text-parchment"
          >
            ×
          </button>
        </div>
      )}

      <GoodsTable
        goods={view.goods}
        onBuy={(id) => {
          setMessage(null);
          setBuyingGoodId(id);
        }}
        onSell={(id) => {
          setMessage(null);
          setSellingGoodId(id);
        }}
        isSelling={isSelling}
      />

      {buyingGood && (
        <BuyModal
          good={buyingGood}
          isBuying={isBuying}
          maxBuyable={maxBuyable}
          remainingCargo={remainingCargo}
          playerGold={view.playerGold}
          onBuy={handleBuy}
          onClose={() => setBuyingGoodId(null)}
        />
      )}

      {sellingGood && (
        <SellModal
          good={sellingGood}
          isSelling={isSelling}
          onSell={handleSell}
          onClose={() => setSellingGoodId(null)}
        />
      )}

      {/* 港口铁匠铺 */}
      <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gold-400">港口铁匠铺</h3>
        {view.availableEquipments.length === 0 ? (
          <p className="text-xs text-parchment-dark">
            该港口铁匠铺暂无多余装备出售。
          </p>
        ) : (
          <div className="space-y-2">
            {view.availableEquipments.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center justify-between border-b border-ocean-700/50 pb-2 text-sm"
              >
                <div>
                  <div className="font-semibold text-parchment flex items-center gap-2">
                    {eq.name}
                    <span className="rounded bg-ocean-700 px-1.5 py-0.5 text-xs text-parchment-dark">
                      {eq.typeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-parchment-dark mt-0.5">
                    {eq.effectDescription}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gold-400 font-medium">
                    {eq.price.toLocaleString()} 金币
                  </span>
                  <button
                    type="button"
                    disabled={!eq.canAfford || isEquipmentPending}
                    onClick={() => handleBuyEquipment(eq.id)}
                    className="rounded bg-gold-500 px-3 py-1.5 text-xs font-bold text-ocean-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
                  >
                    购买
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 已拥有装备包 */}
      {view.fleetInventory.length > 0 && (
        <div className="rounded-lg border border-ocean-600 bg-ocean-800/80 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gold-400">已拥有装备包</h3>
          <div className="space-y-2">
            {view.fleetInventory.map((itemId, index) => {
              const eq = EQUIPMENTS.find((e) => e.id === itemId);
              if (!eq) return null;
              const sellPrice = Math.floor(eq.price * 0.5);
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is required because itemId can be duplicated
                  key={`${itemId}-${index}`}
                  className="flex items-center justify-between border-b border-ocean-700/50 pb-2 text-sm"
                >
                  <div>
                    <div className="font-semibold text-parchment flex items-center gap-2">
                      {eq.name}
                      <span className="rounded bg-ocean-700 px-1.5 py-0.5 text-xs text-parchment-dark">
                        {EQUIPMENT_TYPE_LABELS[eq.type]}
                      </span>
                    </div>
                    <p className="text-xs text-parchment-dark mt-0.5">
                      {getEquipmentEffectDescription(eq)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isEquipmentPending}
                    onClick={() => handleSellEquipment(itemId)}
                    className="rounded border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    出售 (获得 {sellPrice.toLocaleString()} 金币)
                  </button>
                </div>
              );
            })}
          </div>
        </div>
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
