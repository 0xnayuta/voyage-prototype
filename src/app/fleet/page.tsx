import { FleetPanel } from "../../components/FleetPanel";
import {
  loadFleetView,
  setArmamentAction,
  switchActiveShipAction,
} from "./actions";

export const dynamic = "force-dynamic";
export default async function FleetPage() {
  const view = await loadFleetView();
  return (
    <FleetPanel
      view={view}
      onSwitchShip={switchActiveShipAction}
      onSetArmament={setArmamentAction}
    />
  );
}
