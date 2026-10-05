import { useNavigate, useParams } from "react-router-dom";
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language, languageSchema } from "../../../schemas/language";
import { levelSchema } from "../../../schemas/level";
import { Panel } from "../../components/Panel";
import { Feedback, useFeedback } from "../../components/Feedback";
import { Collapsible } from "../../components/Collapsible";
import { TextArea } from "../../components/TextArea";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { Pill } from "../../components/Pill";
import { Button } from "../../components/Button";
import { useEffect } from "react";
import { useDaysContent } from "../../contexts/DaysContentContext";
import { getNextDay } from "./utils/getNextDay";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";

export function DayList() {
  const { projectPath } = useProjectInfo();
  const { language: languageParam, level: levelParam } = useParams();
  const { feedback } = useFeedback();
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

  if (!language || !level) {
    return (
      <Feedback variant="error">{`Language/Level not available`}</Feedback>
    );
  }

  const project = findProjectLine({ language, level });
  const nextDay = getNextDay(project?.days);

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
            onClick={() =>
              navigate(`/project/${language}/${level}/days/${nextDay}`)
            }
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
                  <Pill variant="info">{locale}</Pill>
                ))}
              </div>
              {daysContent.days.length === 0 ? (
                <div className="pl-4">
                  <Feedback variant="warning">No Lesson Days</Feedback>
                </div>
              ) : (
                <div>Day List</div>
              )}
            </>
          </Collapsible>
        </div>
      </div>
    </Panel>
  );
}
