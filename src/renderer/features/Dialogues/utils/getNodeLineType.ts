import {
  DialoguesContentNodeType,
  InteractionTypes,
} from "../../../../schemas/dialogues";

export function getNodeLineType(
  type: InteractionTypes,
): DialoguesContentNodeType {
  switch (type) {
    case "dialogue":
      return "line-dialogue";
    case "alternatives":
      return "line-alternatives";
    case "input":
      return "line-input";
    default:
      return "line-dialogue";
  }
}
