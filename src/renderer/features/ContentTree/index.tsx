import { Tree } from "react-arborist";
import { ContentNode } from "./ContentNode";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { buildProjectTreeNodes, ProjectTreeNode } from "./helpers/buildProjectTreeNodes";
import { Feedback } from "../../components/Feedback";

export function ContentTree() {
  const { projectContent, loading, error} = useProjectContent()

  if (!projectContent) {
    return (
      <Feedback variant="info">
        Empty project
      </Feedback>
    )
  }

  if (error) {
    return (
      <Feedback variant="error">
        Error loading the content tree
      </Feedback>
    )
  }

  if (loading) {
    return (
      <p>Loading Content Tree...</p>
    )
  }

  const data = buildProjectTreeNodes(projectContent)

  return (
    <div className="w-full overflow-hidden">
      <Tree<ProjectTreeNode>
        initialData={data}
        width="100%"
        height={450}
        rowHeight={36}
        indent={18}
        padding={0}
        openByDefault
        disableDrag
        disableDrop
        disableEdit
      >
        {ContentNode}
      </Tree>
    </div>
  );
}
