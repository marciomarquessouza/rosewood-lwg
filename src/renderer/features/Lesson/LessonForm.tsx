import {
  Footprints,
  LayoutList,
  LucideIcon,
  MapPin,
  NotebookDot,
  Type,
} from "lucide-react";
import { ContentNodeType } from "../../../schemas/lesson";
import { MillerColumns, MillerNode } from "../../components/MillerColumns";
import { Panel } from "../../components/Panel";
import { lessonContent } from "./data/lesson";
import { LessonTitleForm } from "./forms/LessonTitleForm";

export function LessonForm() {
  const nodeIcons: Partial<Record<ContentNodeType, LucideIcon>> = {
    locale: MapPin,
    title: Type,
    entries: NotebookDot,
    entry: LayoutList,
    step: Footprints,
  };

  const handleRenderForm = (parentNode: MillerNode<ContentNodeType>) => {
    console.log("#HERE parentNode.type", parentNode.type);
    switch (parentNode.type) {
      case "title":
        return (
          <LessonTitleForm locale="en-UK" onSave={() => console.log("HERE")} />
        );
      default:
        return null;
    }
  };

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden pb-4"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">Lesson</p>
        </div>
      }
    >
      <p>Lesson Content</p>
      <MillerColumns
        root={lessonContent}
        creatableNodeTypes={["entry"]}
        nodeIcons={nodeIcons}
        renderForm={handleRenderForm}
        isFormNode={(node) => node.type === "form"}
      />
    </Panel>
  );
}
