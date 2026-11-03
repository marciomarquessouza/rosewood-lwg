import { Tree, TreeApi } from "react-arborist";
import { ContentNode } from "./ContentNode";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import {
  buildProjectTreeNodes,
  ProjectTreeNode,
} from "./helpers/buildProjectTreeNodes";
import { Feedback } from "../../components/Feedback";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getNodeIdFromPath } from "./helpers/getNodeIdFromPath";

export function ContentTree() {
  const { projectContent, loading, error } = useProjectContent();
  const { pathname } = useLocation();

  const treeRef = useRef<TreeApi<ProjectTreeNode>>(null);

  const data = useMemo(
    () => (projectContent ? buildProjectTreeNodes(projectContent) : []),
    [projectContent],
  );

  useEffect(() => {
    const tree = treeRef.current;
    if (!tree || !data.length) return;

    const nodeId = getNodeIdFromPath(pathname);
    if (!nodeId) return;

    tree.openParents(nodeId);
    tree.select(nodeId, { focus: false });
  }, [pathname, data]);

  return (
    <div className="w-full h-112.5 overflow-hidden">
      {loading ? (
        <p>Loading Content Tree...</p>
      ) : error ? (
        <Feedback variant="error">Error loading the content tree</Feedback>
      ) : !projectContent ? (
        <Feedback variant="info">Empty project</Feedback>
      ) : (
        <Tree<ProjectTreeNode>
          ref={treeRef}
          data={data}
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
      )}
    </div>
  );
}
