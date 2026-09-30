import databaseIcon from "../../../assets/icons/database.svg";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel.tsx";
import { SourceDetails, SourceDetailsProps } from "./SourceDetails";

interface SourcePanelProps extends SourceDetailsProps {
  onReconnect: () => void;
}

export function SourcePanel({
  projectPath,
  contentPath,
  connected,
  onReconnect,
}: SourcePanelProps) {
  return (
    <aside className="w-64 shrink-0">
      <Panel
        variant="support"
        header={
          <div className="flex items-center gap-2">
            <img src={databaseIcon} alt="" className="size-5" />
            <h2 className="text-xl font-bold">SOURCE</h2>
          </div>
        }
        footer={
          <Button variant="accent" onClick={onReconnect}>
            Reconnect
          </Button>
        }
      >
        <SourceDetails
          projectPath={projectPath}
          contentPath={contentPath}
          connected={connected}
        />
      </Panel>
    </aside>
  );
}
