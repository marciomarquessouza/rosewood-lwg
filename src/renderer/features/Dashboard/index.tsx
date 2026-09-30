import { Panel } from "../../components/Panel.tsx";
import { useProject } from "../../contexts/ProjectContext";
import { SourcePanel } from "../SourcePanel";

export function Dashboard() {
  const { connected } = useProject();
  return (
    <div className="flex flex-row gap-8">
      <SourcePanel />
      <Panel
        header={
          <div className=" flex min-w-4xl flex-col">
            <h1>DASHBOARD</h1>
            <p>Language/Level Overview</p>
          </div>
        }
      >
        {!connected ? <p>Not Connected</p> : <p>Dasboard</p>}
      </Panel>
    </div>
  );
}
