import { Tree } from "react-arborist";
import { ContentNode, ContentTreeNode } from "./ContentNode";
import { mockedData } from "./data/data";

export function ContentTree() {
  return (
    <div className="w-full overflow-hidden">
      <Tree<ContentTreeNode>
        initialData={mockedData}
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
