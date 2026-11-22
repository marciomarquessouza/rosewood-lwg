export const GAME_DESIGN_CATEGORIES = ["overview", "mechanics", "lore"] as const;
export type GameDesignCategory = (typeof GAME_DESIGN_CATEGORIES)[number];
export interface GameDesignDocument {
  slug: string;
  category: GameDesignCategory;
  title: string;
  description: string;
  content: string;
}
