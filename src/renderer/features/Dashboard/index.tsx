import { useNavigate } from "react-router-dom";
import { SourcePanel } from "../SourcePanel";

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <SourcePanel
        connected
        projectPath="/Users/user/projects/my-projects/phaser/web-lwg-germania"
        contentPath="/src/server/lessons/content"
        onReconnect={() => navigate("/language/de-DE/A1-1")}
      />
    </div>
  );
}
