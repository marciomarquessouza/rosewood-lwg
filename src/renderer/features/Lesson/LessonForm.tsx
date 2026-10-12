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
import { useParams } from "react-router-dom";
import { languageSchema } from "../../../schemas/language";
import { levelSchema } from "../../../schemas/level";
import { dayDirectorySchema } from "../../../schemas/day";
import { useDaysContent } from "../../contexts/DaysContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { useEffect } from "react";
import { buildLessonContentTree } from "./helpers/buildLessonContentTree";
import { Feedback } from "../../components/Feedback";

const nodeIcons: Partial<Record<ContentNodeType, LucideIcon>> = {
  locale: MapPin,
  title: Type,
  entries: NotebookDot,
  entry: LayoutList,
  step: Footprints,
};

export function LessonForm() {
  const { projectPath } = useProjectInfo();
  const { findDayContent, loadDaysContent, loading } = useDaysContent();
  const {
    language: languageParam,
    level: levelParam,
    day: dayParam,
  } = useParams();

  const language = languageSchema.parse(languageParam);
  const level = levelSchema.parse(levelParam);
  const dayDirectory = dayDirectorySchema.parse(dayParam);

  useEffect(() => {
    if (projectPath) {
      loadDaysContent(projectPath, { language, level });
    }
  }, [language, level, projectPath]);

  const dayContent = findDayContent(dayDirectory);

  if (!dayContent) {
    return <Feedback variant="info">No Content available</Feedback>;
  }

  const lessonContentTree = buildLessonContentTree(dayContent);

  const handleRenderForm = (parentNode: MillerNode<ContentNodeType>) => {
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
      <MillerColumns
        root={lessonContentTree}
        creatableNodeTypes={["entry"]}
        nodeIcons={nodeIcons}
        renderForm={handleRenderForm}
        isFormNode={(node) => node.type === "form"}
        onCreateNode={(value) => console.log(value)}
      />
    </Panel>
  );
}
