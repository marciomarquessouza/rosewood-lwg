import { Character } from "../../../../schemas/dialogues";
import { Option } from "../forms/DialogueLineForm";

export function buildCharacterOptions(): Option<Character>[] {
  return [
    { label: "Josef", value: "player" },
    { label: "Nun", value: "tutor" },
    { label: "Pumpkin", value: "learningNode" },
    { label: "Marlene", value: "jailer" },
    { label: "Krampus", value: "punisher" },
  ];
}
