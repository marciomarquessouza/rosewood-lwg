export const DEFAULT_DIALOGUES = {
  // CELL
  "cell.welcome": {
    label: "Welcome",
    scene: "CELL",
    skip: false,
  },
  "cell.marlene_first_interaction": {
    label: "Marlene First Interaction",
    scene: "CELL",
    skip: false,
  },
  "cell.daily_challenge": {
    label: "Daily Challenge",
    scene: "CELL",
    skip: false,
  },
  "cell.desk_interaction": {
    label: "Desk Interaction",
    scene: "CELL",
    skip: false,
  },
  "cell.desk_blocked": {
    label: "Desk Blocked",
    scene: "CELL",
    skip: false,
  },
  "cell.food_interaction": {
    label: "Food Interaction",
    scene: "CELL",
    skip: false,
  },
  "cell.food_blocked": {
    label: "Food Blocked",
    scene: "CELL",
    skip: false,
  },
  "cell.rat_interaction": {
    label: "Rat Interaction",
    scene: "CELL",
    skip: false,
  },
  "cell.rat_blocked": {
    label: "Rat Blocked",
    scene: "CELL",
    skip: false,
  },
  "cell.bed_interaction": {
    label: "Bed Interaction",
    scene: "CELL",
    skip: false,
  },
  "cell.bed_blocked": {
    label: "Bed Blocked",
    scene: "CELL",
    skip: false,
  },

  // DREAM
  "dream.introduction": {
    label: "Introduction",
    scene: "DREAM",
    skip: false,
  },
  "dream.lesson_preparation": {
    label: "Lesson Preparation",
    scene: "DREAM",
    skip: false,
  },
  "dream.lesson_begin": {
    label: "Lesson Begin",
    scene: "DREAM",
    skip: false,
  },
  "dream.lesson_finish": {
    label: "Lesson Finish",
    scene: "DREAM",
    skip: false,
  },
  "dream.review_intro": {
    label: "Review Intro",
    scene: "DREAM",
    skip: false,
  },

  // TRAIN
  "train.introduction": {
    label: "Introduction",
    scene: "TRAIN",
    skip: false,
  },
} as const;

export type GameScene = "CELL" | "DREAM" | "TRAIN" | "ALL";
