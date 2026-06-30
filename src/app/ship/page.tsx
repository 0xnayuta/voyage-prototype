export const dynamic = "force-dynamic";

import { ShipyardPanel } from "../../components/ShipyardPanel";
import {
  buyShipAction,
  loadShipyardView,
  repairShipAction,
  sellShipAction,
  upgradeComponentAction,
} from "./actions";

interface ShipPageProps {
  readonly searchParams: Promise<{ shipId?: string }>;
}

export default async function ShipPage({ searchParams }: ShipPageProps) {
  const params = await searchParams;
  const view = await loadShipyardView(params?.shipId);

  return (
    <ShipyardPanel
      view={view}
      onBuyShip={buyShipAction}
      onSellShip={sellShipAction}
      onUpgrade={upgradeComponentAction}
      onRepair={repairShipAction}
    />
  );
}
