// server/src/config/moods.ts
// Single source of truth for mood scores (PRD Section 5.1)

export const MOOD_SCORES: Record<string, number> = {
  happy: 90,
  hyped: 85,
  romantic: 80,
  chill: 70,
  focused: 65,
  nostalgic: 55,
  stressed: 30,
  sad: 20,
} as const;

export const VALID_MOODS = Object.keys(MOOD_SCORES) as [string, ...string[]];

export type MoodType = keyof typeof MOOD_SCORES;

export function getMoodScore(mood: string): number {
  return MOOD_SCORES[mood] ?? 50;
}
