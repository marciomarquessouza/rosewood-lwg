import { useEffect } from "react";
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
import { LessonTitleForm } from "./forms/LessonTitleForm";
import { useParams } from "react-router-dom";
import { languageSchema } from "../../../schemas/language";
import { levelSchema } from "../../../schemas/level";
import { dayDirectorySchema } from "../../../schemas/day";
import { useDaysContent } from "../../contexts/DaysContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { buildLessonContentTree } from "./helpers/buildLessonContentTree";
import { Feedback } from "../../components/Feedback";
import { getTitleFromDayContent } from "./helpers/getTitleFromDayContent";
import { useLessonTitle } from "./hooks/useLessonTitle";
import { dayDirectoryToNumber } from "../Days/utils/transformDays";

const nodeIcons: Partial<Record<ContentNodeType, LucideIcon>> = {
  locale: MapPin,
  title: Type,
  entries: NotebookDot,
  entry: LayoutList,
  step: Footprints,
};

export function LessonForm() {
  const { projectPath } = useProjectInfo();
  const { findDayContent, loadDaysContent } = useDaysContent();
  const {
    language: languageParam,
    level: levelParam,
    day: dayParam,
  } = useParams();
  const { saveTitle, saving } = useLessonTitle();

  const language = languageSchema.parse(languageParam);
  const level = levelSchema.parse(levelParam);
  const dayDirectory = dayDirectorySchema.parse(dayParam);
  const dayTitle = `day ${String(dayDirectoryToNumber(dayDirectory)).padStart(2, "0")}`;

  useEffect(() => {
    if (!projectPath) return;

    void loadDaysContent(projectPath, { language, level });
  }, [projectPath, language, level, loadDaysContent]);

  const dayContent = findDayContent(dayDirectory);

  const handleRenderForm = (
    parentNode: MillerNode<ContentNodeType>,
    selectedIds: string[],
  ) => {
    if (!dayContent) return;
    switch (parentNode.type) {
      case "title": {
        const localeRaw = selectedIds[0];
        const locale = languageSchema.parse(localeRaw);
        const currentTitle = getTitleFromDayContent(locale, dayContent);
        const options = { language, level, dayDirectory, locale };

        return (
          <LessonTitleForm
            locale={locale}
            saving={saving}
            initialValue={currentTitle}
            onSave={(title) => saveTitle(options, title, dayContent)}
          />
        );
      }
      default:
        return null;
    }
  };

  if (!dayContent) {
    return <Feedback variant="info">No Content available</Feedback>;
  }

  const lessonContentTree = buildLessonContentTree(dayContent);

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden pb-4"
      header={
        <div className="flex items-center justify-between gap-4">
          <div className="text-2xl font-bold">
            Lesson
            <span className="font-light ml-2">{`${language} | ${level} | ${dayTitle}`}</span>
          </div>
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
