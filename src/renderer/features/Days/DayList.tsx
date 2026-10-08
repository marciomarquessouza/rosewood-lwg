import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language, languageSchema } from "../../../schemas/language";
import { levelSchema } from "../../../schemas/level";
import { Panel } from "../../components/Panel";
import {
  Feedback,
  FEEDBACK_TYPES,
  FeedbackTypes,
  useFeedback,
} from "../../components/Feedback";
import { Collapsible } from "../../components/Collapsible";
import { TextArea } from "../../components/TextArea";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { Pill } from "../../components/Pill";
import { Button } from "../../components/Button";
import { useEffect } from "react";
import { useDaysContent } from "../../contexts/DaysContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { DayItem } from "./DayItem";
import { DayDirectory } from "../../../schemas/day";

export function DayList() {
  const { projectPath } = useProjectInfo();
  const { language: languageParam, level: levelParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { feedback, setFeedback, clearFeedback } = useFeedback();
  const { findProjectLine } = useProjectContent();
  const navigate = useNavigate();
  const { daysContent, loadDaysContent } = useDaysContent();

  const language = languageSchema.parse(languageParam);
  const level = levelSchema.parse(levelParam);

  useEffect(() => {
    if (projectPath) {
      loadDaysContent(projectPath, { language, level });
    }
  }, [language, level, projectPath]);

  useEffect(() => {
    const message = searchParams.get("form-feedback-msg");

    if (message) {
      const type = searchParams.get("form-feedback-status") as
        FeedbackTypes | "info";
      setFeedback({ type, message });

      const next = new URLSearchParams(searchParams);
      next.delete("formFeedback");
      setSearchParams(next, { replace: true });
    }
  }, []);

  if (!language || !level) {
    return (
      <Feedback variant="error">{`Language/Level not available`}</Feedback>
    );
  }

  const project = findProjectLine({ language, level });

  const onDayDelete = async (dayDirectory: DayDirectory) => {
    const confirmed = window.confirm(
      `Remove ${dayDirectory}? This will permanently delete all day content.`,
    );

    if (!confirmed) {
      return;
    }

    clearFeedback();
    const projectOptions = { language, level };
    try {
      await window.rosewood.deleteDayContent(
        projectPath,
        projectOptions,
        dayDirectory,
      );
      setFeedback({
        type: "success",
        message: `Day ${dayDirectory} was successfully removed`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error deleting the day's content";
      setFeedback({ type: "error", message });
    }
  };

  if (!project || !daysContent) {
    return (
      <Feedback variant="error">
        {`${!project ? "Project" : "Day"} content not available - ${language}|${level}`}
      </Feedback>
    );
  }

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">
            {`Days: ${level} ${LANGUAGE_DETAILS[language as Language].name} [${language}]`}
          </p>
          <Pill variant="accent">{`Planned: ${project.plannedDays}`}</Pill>
        </div>
      }
      footer={
        <div className="flex flex-1 justify-end">
          <Button
            variant="dark"
            onClick={() => navigate(`/project/${language}/${level}/days/new`)}
          >
            Add New Day
          </Button>
        </div>
      }
    >
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col gap-4">
          {feedback && (
            <Feedback variant={feedback.type}>{feedback.message}</Feedback>
          )}
          <Collapsible title="Details">
            <div className="flex flex-col gap-3 pl-4">
              <TextArea
                id="lesson-plan"
                readOnly
                placeholder="Write overview outline here..."
                value={`PLANNED LESSONS: \n${project.lessonPlan}`}
              />

              <TextArea
                id="lore"
                readOnly
                placeholder="Write overview outline here..."
                value={`PLANNED LORE: \n${project.lore}`}
              />
            </div>
          </Collapsible>
          <Collapsible title={`Lesson Days`}>
            <>
              <div className="flex flex-row pl-4 items-center pb-2">
                <p className="pr-2 text-sm">Locales:</p>
                {project.locales.map((locale) => (
                  <Pill key={locale} variant="info" className="mx-1">
                    {locale}
                  </Pill>
                ))}
              </div>
              {daysContent.days.length === 0 ? (
                <div className="pl-4">
                  <Feedback variant="warning">No Lesson Days</Feedback>
                </div>
              ) : (
                <div className="pl-2">
                  {daysContent.days.map((content) => (
                    <DayItem
                      language={language}
                      level={level}
                      key={content.day}
                      dayLessonContent={content}
                      onDelete={onDayDelete}
                    />
                  ))}
                </div>
              )}
            </>
          </Collapsible>
        </div>
      </div>
    </Panel>
  );
}
