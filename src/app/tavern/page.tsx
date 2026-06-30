export const dynamic = "force-dynamic";

import { TavernPanel } from "../../components/TavernPanel";
import { fireCrewAction, hireCrewAction } from "../actions/crew";
import { loadTavernView } from "./actions";

export default async function TavernPage() {
  const view = await loadTavernView();
  return (
    <TavernPanel
      view={view}
      onHireCrew={hireCrewAction}
      onFireCrew={fireCrewAction}
    />
  );
}
