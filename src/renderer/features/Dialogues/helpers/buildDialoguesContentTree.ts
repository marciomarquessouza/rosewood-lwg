import { LANGUAGE_DETAILS } from "../../../../constants";
import { GameScene } from "../../../../constants/dialogues";
import { DayLessonContent } from "../../../../schemas/day";
import {
  DialogueKey,
  DialoguesContentNodeType,
} from "../../../../schemas/dialogues";
import { Language } from "../../../../schemas/language";
import { MillerNode } from "../../../components/MillerColumns";

export function buildDialoguesContentTree(
  dayLessonContent: DayLessonContent,
): MillerNode<DialoguesContentNodeType>[] {
  return Object.keys(dayLessonContent.locales).map((key) => {
    const locale = key as Language;
    const root: MillerNode<DialoguesContentNodeType> = {
      id: locale,
      name: LANGUAGE_DETAILS[locale].name,
      type: "locale",
      children: [],
    };

    const sceneSet = new Set<GameScene>();
    const sceneMap = new Map<
      GameScene,
      MillerNode<DialoguesContentNodeType>[]
    >();

    Object.keys(dayLessonContent.dialogues).forEach((key) => {
      const dialogueKey = key as DialogueKey;
      const dialogue = dayLessonContent.dialogues[dialogueKey];
      const sceneDialogues = sceneMap.get(dialogue.scene) ?? [];
      sceneSet.add(dialogue.scene);
      const dialogueNode: MillerNode<DialoguesContentNodeType> = {
        id: key,
        name: dialogue.label,
        type: "dialogue",
        children: [
          { id: `dialogue-form`, type: "form", name: "Dialogue Form" },
        ],
      };
      sceneDialogues.push(dialogueNode);
      sceneMap.set(dialogue.scene, sceneDialogues);
    });

    const sceneNodes: MillerNode<DialoguesContentNodeType>[] = Array.from(
      sceneSet,
    ).map((scene) => {
      return {
        id: scene,
        name: scene,
        type: "scene",
        children: sceneMap.get(scene),
      };
    });

    root.children = sceneNodes;

    return root;
  });
}
