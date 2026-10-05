import { useParams } from "react-router-dom";
import { dayDirectorySchema } from "../../../schemas/day";
import { dayDirectoryToNumber } from "./utils/transformDays";
import { Panel } from "../../components/Panel";
import { Button } from "../../components/Button";
import { Collapsible } from "../../components/Collapsible";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { useState } from "react";
import { LessonEntry, LessonEntryBase } from "../../../schemas/lesson";
import { LessonEntries } from "./LessonEntries";

export function DayForm() {
  const { day: dayParam } = useParams();
  const dayDirectory = dayDirectorySchema.parse(dayParam);
  const day = dayDirectoryToNumber(dayDirectory);
  const isUpdate = false;

  const [entries, setEntries] = useState<Record<string, LessonEntryBase>>({
    "1": {
      sequence: 0,
      target: "Hallo",
    },
    "2": {
      sequence: 1,
      target: "Guten Tag",
    },
    "3": {
      sequence: 2,
      target: "Guten Abend",
    },
  });

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">
            {isUpdate ? `Day ${day}` : "New Day"}
          </p>
          <div>
            <Button variant="accent">
              {isUpdate ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="h-full overflow-y-auto flex flex-col gap-4">
        <Collapsible title="Day Details">
          <div className="flex flex-col gap-3 pl-4">
            <div className=" flex flex-row gap-2">
              <div className="w-40">
                <Input
                  type="number"
                  readOnly
                  className="w-38"
                  label="Day:"
                  value={day}
                />
              </div>
              <div className="w-1/4">
                <Input type="text" label="Day Code:" value={""} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <TextArea
                id="lesson-targets"
                label="Lesson Targets"
                placeholder="Define the primary linguistic goals, vocabulary subsets, and pronunciation markers targeted for this day."
              />
              <TextArea
                id="lore-targets"
                label="Lore and Rewards Targets"
                placeholder="Add narrative triggers, interactions, and unlocks awarded upon completion of the Dd"
              />
            </div>
          </div>
        </Collapsible>
        <Collapsible title="Lesson Limits">
          <div className="pl-4">
            <div
              className={[
                "flex flex-col w-full bg-rosewood-surface py-2 px-4",
                "rounded-lg border-2 border-rosewood-ink",
                " text-rosewood-ink",
              ].join(" ")}
            >
              <p className=" text-rosewood-accent">Pronunciation</p>
              <div className="flex flex-row gap-8">
                <Input
                  type="number"
                  className="w-38 bg-rosewood-white"
                  label="Minimum Record Time (ms)"
                  value={1000}
                />
                <Input
                  type="number"
                  className="w-38 bg-rosewood-white"
                  label="Maximum Record Time (ms)"
                  value={6000}
                />
              </div>
              <hr className="my-4 border-dashed" />

              <p className=" text-rosewood-accent">Writing</p>
              <div className="flex flex-row gap-8">
                <Input
                  type="number"
                  className="w-38 bg-rosewood-white"
                  label="Total Error"
                  value={3}
                />
                <Input
                  type="number"
                  className="w-38 bg-rosewood-white"
                  label="Total Tips"
                  value={3}
                />
              </div>
              <hr className="my-4 border-dashed" />

              <p className=" text-rosewood-accent">Lesson Entry</p>
              <div className="flex flex-row gap-8">
                <Input
                  type="number"
                  className="w-38 bg-rosewood-white"
                  label="Minimum Success"
                  placeholder="0.6"
                  value={0.6}
                />
              </div>
              <hr className="my-4 border-dashed" />
            </div>
          </div>
        </Collapsible>
        <Collapsible title="Lesson Entries">
          <div className="pl-4">
            <LessonEntries entries={entries} onChange={setEntries} />
          </div>
        </Collapsible>
      </div>
    </Panel>
  );
}
