import databaseIcon from "../../../assets/icons/database.svg";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel/index.tsx";
import { useProject } from "../../contexts/ProjectContext.tsx";
import { SourceDetails } from "./SourceDetails";

export function SourcePanel() {
  const { connected, projectPath, contentPath, connect, error, loading } =
    useProject();

  return (
    <aside className="w-68 shrink-0">
      <Panel
        variant="support"
        header={
          <div className="flex items-center gap-2">
            <img src={databaseIcon} alt="" className="size-5" />
            <h2 className="text-xl font-bold">SOURCE</h2>
          </div>
        }
        footer={
          <Button variant="accent" onClick={connect} disabled={loading}>
            {loading ? "◆ Loading..." : connected ? "Reconnect" : "Connect"}
          </Button>
        }
      >
        <SourceDetails
          projectPath={projectPath}
          contentPath={contentPath}
          connected={connected}
          error={error}
        />
      </Panel>
    </aside>
  );
}
