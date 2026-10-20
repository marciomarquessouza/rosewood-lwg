import { Mood, MOODS } from "../../../../schemas/dialogues";
import { Option } from "../forms/DialogueLineForm";

export function buildMoodOptions(defaultOption: Mood): Option<Mood>[] {
  return [
    ...MOODS.map((mood) => ({
      label: mood,
      value: mood,
      default: mood === defaultOption ? defaultOption : undefined,
    })),
  ];
}
