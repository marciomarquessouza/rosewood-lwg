import { useParams } from "react-router-dom";
import { Panel } from "../../components/Panel";
import { useDaysContent } from "../../contexts/DaysContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { languageSchema } from "../../../schemas/language";
import { levelSchema } from "../../../schemas/level";
import { dayDirectorySchema } from "../../../schemas/day";
import { dayDirectoryToNumber } from "../Days/utils/transformDays";
import { useEffect, useMemo } from "react";
import { MillerColumns, MillerNode } from "../../components/MillerColumns";
import { Feedback } from "../../components/Feedback";
import { buildDialoguesContentTree } from "./helpers/buildDialoguesContentTree";
import {
  Clapperboard,
  Compass,
  LucideIcon,
  MapPin,
  MessageCircleCode,
  MessageSquare,
  SquareDashedPlus,
  TextCursor,
} from "lucide-react";
import { DialoguesContentNodeType } from "../../../schemas/dialogues";
import { DialogueLineForm } from "./forms/DialogueLineForm";
import { buildCharacterOptions } from "./helpers/buildCharacterOptions";
import { buildMoodOptions } from "./helpers/buildMoodOptions";

const nodeIcons: Partial<Record<DialoguesContentNodeType, LucideIcon>> = {
  locale: MapPin,
  scene: Clapperboard,
  dialogue: MessageSquare,
  "add-line": SquareDashedPlus,
  "line-alternatives": Compass,
  "line-dialogue": MessageCircleCode,
  "line-input": TextCursor,
};

export function DialoguesForm() {
  const { projectPath } = useProjectInfo();
  const { findDayContent, loadDaysContent } = useDaysContent();
  const {
    language: languageParam,
    level: levelParam,
    day: dayParam,
  } = useParams();

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
    parentNode: MillerNode<DialoguesContentNodeType>,
    selectedIds: string[],
  ) => {
    if (!dayContent) return;
    const localeRaw = selectedIds[0];
    const locale = languageSchema.parse(localeRaw);

    switch (parentNode.type) {
      case "add-line": {
        return (
          <DialogueLineForm
            characters={buildCharacterOptions()}
            moods={buildMoodOptions("neutral")}
            onSave={(line) => console.log({ line, locale, parentNode })}
          />
        );
      }
      default:
        return null;
    }
  };

  const dialoguesContentTree = useMemo(
    () => (dayContent ? buildDialoguesContentTree(dayContent) : null),
    [dayContent],
  );

  if (!dialoguesContentTree) {
    return (
      <Feedback
        className="w-full flex justify-center items-center"
        variant="info"
      >
        No Content available
      </Feedback>
    );
  }

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <div className="text-2xl font-bold">
            Dialogues
            <span className="font-light ml-2">{`${language} | ${level} | ${dayTitle}`}</span>
          </div>
        </div>
      }
    >
      <MillerColumns
        root={dialoguesContentTree}
        nodeIcons={nodeIcons}
        isFormNode={(node) => node.type === "form"}
        renderForm={handleRenderForm}
      />
    </Panel>
  );
}
