export const DEFAULT_DIALOGUES = {
  // CELL
  "cell.welcome": {
    label: "Welcome",
    scene: "CELL",
  },
  "cell.marlene_first_interaction": {
    label: "Marlene First Interaction",
    scene: "CELL",
  },
  "cell.daily_challenge": {
    label: "Daily Challenge",
    scene: "CELL",
  },
  "cell.desk_interaction": {
    label: "Desk Interaction",
    scene: "CELL",
  },
  "cell.desk_blocked": {
    label: "Desk Blocked",
    scene: "CELL",
  },
  "cell.food_interaction": {
    label: "Food Interaction",
    scene: "CELL",
  },
  "cell.food_blocked": {
    label: "Food Blocked",
    scene: "CELL",
  },
  "cell.rat_interaction": {
    label: "Rat Interaction",
    scene: "CELL",
  },
  "cell.rat_blocked": {
    label: "Rat Blocked",
    scene: "CELL",
  },
  "cell.bed_interaction": {
    label: "Bed Interaction",
    scene: "CELL",
  },
  "cell.bed_blocked": {
    label: "Bed Blocked",
    scene: "CELL",
  },

  // DREAM
  "dream.introduction": {
    label: "Introduction",
    scene: "DREAM",
  },
  "dream.lesson_preparation": {
    label: "Lesson Preparation",
    scene: "DREAM",
  },
  "dream.lesson_begin": {
    label: "Lesson Begin",
    scene: "DREAM",
  },
  "dream.lesson_finish": {
    label: "Lesson Finish",
    scene: "DREAM",
  },
  "dream.review_intro": {
    label: "Review Intro",
    scene: "DREAM",
  },

  // TRAIN
  "train.introduction": {
    label: "Introduction",
    scene: "TRAIN",
  },
} as const;

export type GameScene = "CELL" | "DREAM" | "TRAIN" | "ALL";
