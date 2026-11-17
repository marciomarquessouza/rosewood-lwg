import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ListOrdered,
  Footprints,
  LayoutList,
  LucideIcon,
  MapPin,
  NotebookDot,
  Type,
} from "lucide-react";
import {
  LessonContentNodeType,
  type LessonLocaleExample,
  type LessonEntry,
} from "../../../schemas/lesson";
import { useFeedback } from "../../contexts/FeedbackContext";
import { EntryDetailsForm, type EntryDetails } from "./forms/EntryDetailsForm";
import { EntryExamplesForm } from "./forms/EntryExamplesForm";
import {
  MillerColumns,
  MillerNode,
  MillerNodeAction,
} from "../../components/MillerColumns";
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
import { useLessonEntry } from "./hooks/useLessonEntry";
import { LessonAudioForm } from "./forms/LessonAudioForm";
import { LocaleStepForm } from "./forms/LessonStepForm";
import { useLessonStep } from "./hooks/useLessonStep";
import { stepTypesSchema } from "../../../schemas/locales";
import { getStepContent } from "./helpers/getStepContent";
import { useLessonAudio } from "./hooks/useLessonAudio";

const nodeIcons: Partial<Record<LessonContentNodeType, LucideIcon>> = {
  locale: MapPin,
  title: Type,
  entries: NotebookDot,
  entry: LayoutList,
  step: Footprints,
  details: BookOpen,
  examples: ListOrdered,
};

export function LessonForm() {
  const { projectPath } = useProjectInfo();
  const { showFeedback, clearFeedback } = useFeedback();
  const [savingEntry, setSavingEntry] = useState(false);
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

  const { saveTitle, saving: savingTitle } = useLessonTitle();
  const { generateAudio, playAudio, saving: savingAudio } = useLessonAudio();
  const { createEntry, editEntry, removeEntry } = useLessonEntry();
  const { updateStep, saving: savingStep } = useLessonStep();

  useEffect(() => {
    if (!projectPath) return;

    void loadDaysContent(projectPath, { language, level });
  }, [projectPath, language, level, loadDaysContent]);

  const dayContent = findDayContent(dayDirectory);

  const saveEntryDetails = async (
    entryId: string,
    locale: ReturnType<typeof languageSchema.parse>,
    value: EntryDetails,
  ) => {
    if (!dayContent) return;
    const entry = dayContent.lesson.entries?.[entryId];
    const localeContent = dayContent.locales[locale];
    if (!entry || !localeContent) return;
    clearFeedback();
    setSavingEntry(true);
    try {
      const options = { language, level, dayDirectory };
      // The two files have separate owners; keep all unrelated fields intact.
      const updatedEntry: LessonEntry = {
        ...entry,
        target: value.target,
        type: value.type,
        enabledSteps: value.enabledSteps,
      };
      await window.rosewood.updateLessonContent(projectPath, options, {
        ...dayContent.lesson,
        entries: { ...dayContent.lesson.entries, [entryId]: updatedEntry },
      });
      await window.rosewood.updateLocaleContent(projectPath, {
        ...options, locale,
      }, {
        ...localeContent,
        lesson: {
          ...localeContent.lesson,
          entries: {
            ...localeContent.lesson.entries,
            [entryId]: {
              ...(localeContent.lesson.entries[entryId] ?? { steps: {} }),
              concept: value.concept,
              description: value.description,
            },
          },
        },
      });
      await loadDaysContent(projectPath, { language, level });
      showFeedback({ type: "success", message: "Entry details saved" });
    } catch (error) {
      console.error(error);
      showFeedback({ type: "error", message: String(error) });
      throw error;
    } finally {
      setSavingEntry(false);
    }
  };

  const saveEntryExamples = async (
    entryId: string,
    locale: ReturnType<typeof languageSchema.parse>,
    examples: LessonLocaleExample[],
  ) => {
    if (!dayContent) return;
    const localeContent = dayContent.locales[locale];
    if (!localeContent) return;
    clearFeedback();
    setSavingEntry(true);
    try {
      await window.rosewood.updateLocaleContent(
        projectPath,
        { language, level, dayDirectory, locale },
        {
          ...localeContent,
          lesson: {
            ...localeContent.lesson,
            entries: {
              ...localeContent.lesson.entries,
              [entryId]: {
                ...(localeContent.lesson.entries[entryId] ?? { steps: {} }),
                examples,
              },
            },
          },
        },
      );
      await loadDaysContent(projectPath, { language, level });
      showFeedback({ type: "success", message: "Examples saved" });
    } catch (error) {
      console.error(error);
      showFeedback({ type: "error", message: String(error) });
      throw error;
    } finally {
      setSavingEntry(false);
    }
  };

  const getNodeActions = (
    node: MillerNode<LessonContentNodeType>,
  ): Array<"create" | "edit" | "remove"> => {
    switch (node.type) {
      case "entries":
        return ["create"];

      case "entry":
        return ["edit", "remove"];

      default:
        return [];
    }
  };

  const handleNodeAction = async ({
    type,
    node,
    value,
  }: MillerNodeAction<LessonContentNodeType>) => {
    const options = { language, level, dayDirectory };

    if (!dayContent) return;

    switch (type) {
      case "create":
        createEntry(options, value, dayContent);
        break;

      case "edit":
        editEntry(options, node.id, value, dayContent);
        break;

      case "remove":
        removeEntry(options, node.id, dayContent);
        break;
    }
  };

  const handleRenderForm = (
    parentNode: MillerNode<LessonContentNodeType>,
    selectedIds: string[],
    path: MillerNode<LessonContentNodeType>[],
  ) => {
    if (!dayContent) return;
    const localeRaw = selectedIds[0];
    const locale = languageSchema.parse(localeRaw);

    switch (parentNode.type) {
      case "title": {
        const currentTitle = getTitleFromDayContent(locale, dayContent);
        const options = { language, level, dayDirectory, locale };

        return (
          <LessonTitleForm
            locale={locale}
            saving={savingTitle}
            initialValue={currentTitle}
            onSave={(title) => saveTitle(options, title, dayContent)}
          />
        );
      }
      case "details": {
        const entry = path.find((node) => node.type === "entry");
        if (!entry) return null;
        const lessonEntry = dayContent.lesson.entries?.[entry.id];
        if (!lessonEntry) return null;
        const localeEntry = dayContent.locales[locale]?.lesson.entries[entry.id];
        return (
          <EntryDetailsForm
            key={`${locale}-${entry.id}`}
            locale={locale}
            entry={lessonEntry}
            concept={localeEntry?.concept}
            description={localeEntry?.description}
            saving={savingEntry}
            onSave={(value) => saveEntryDetails(entry.id, locale, value)}
          />
        );
      }
      case "examples": {
        const entry = path.find((node) => node.type === "entry");
        if (!entry) return null;
        const lessonEntry = dayContent.lesson.entries?.[entry.id];
        if (!lessonEntry) return null;
        const localeEntry = dayContent.locales[locale]?.lesson.entries[entry.id];
        return (
          <EntryExamplesForm
            key={`${locale}-${entry.id}`}
            locale={locale}
            entryId={entry.id}
            target={lessonEntry.target}
            legacyAudio={lessonEntry.audio}
            initialExamples={localeEntry?.examples}
            saving={savingEntry}
            onSave={(examples) => saveEntryExamples(entry.id, locale, examples)}
            onGenerateAudio={async (text) => {
              const response = await window.rosewood.generateAudio(
                projectPath, { language, level, dayDirectory }, text,
              );
              return response.path;
            }}
            onPlayAudio={playAudio}
          />
        );
      }
      case "audio": {
        const entry = path.find((node) => node.type === "entry");
        if (!entry) return null;

        const options = { language, level, dayDirectory, locale };
        const lessonEntry = dayContent.lesson.entries?.[entry.id];

        return (
          <LessonAudioForm
            locale={locale}
            target={entry.name}
            generating={savingAudio}
            audioPath={lessonEntry?.audio}
            onGenerate={() =>
              generateAudio(options, entry.id, entry.name, dayContent)
            }
            onPlay={playAudio}
          />
        );
      }
      case "step": {
        const entry = path.find((node) => node.type === "entry");
        if (!entry) return null;
        const options = { language, level, dayDirectory, locale };
        const stepType = stepTypesSchema.parse(parentNode.id);

        return (
          <LocaleStepForm
            locale={locale}
            saving={savingStep}
            initialValue={getStepContent(
              locale,
              entry.id,
              stepType,
              dayContent,
            )}
            onSave={(stepContent) =>
              updateStep(options, entry.id, stepType, stepContent, dayContent)
            }
          />
        );
      }
      default:
        return null;
    }
  };

  const lessonContentTree = useMemo(
    () => (dayContent ? buildLessonContentTree(dayContent) : null),
    [dayContent],
  );

  if (!lessonContentTree) {
    return (
      <Feedback
        className=" w-full flex justify-center items-center"
        variant="info"
      >
        No Content available
      </Feedback>
    );
  }

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
        nodeIcons={nodeIcons}
        renderForm={handleRenderForm}
        isFormNode={(node) => node.type === "form"}
        getNodeActions={getNodeActions}
        onNodeAction={handleNodeAction}
      />
    </Panel>
  );
}
