// server/src/modules/vibe/vibe.ts
// Pure functions for Vibe Engine (PRD Section 5)

import { getMoodScore } from '../../config/moods.js';

export interface VibeCheckinInput {
  userId: string;
  mood: string;
  energy: number;
  createdAt: string | Date;
}

export interface VibeResult {
  score: number | null;
  label: string | null;
  dominantMood: string | null;
  averageEnergy: number | null;
  countedMembers: number;
  moodMix: Record<string, number>;
}

export function labelForScore(score: number | null): string | null {
  if (score === null) return null;
  if (score <= 39) return 'Low vibes';
  if (score <= 64) return 'Balanced vibes';
  if (score <= 84) return 'Good vibes';
  return 'Peak vibes';
}

/**
 * Filter checkins to keep only the single latest checkin per user within 24 hours
 */
export function filterCountedCheckins(
  checkins: VibeCheckinInput[],
  now: Date = new Date()
): VibeCheckinInput[] {
  const windowMs = 24 * 60 * 60 * 1000; // 24 hours
  const cutoffTime = now.getTime() - windowMs;

  // Filter within last 24h
  const recent = checkins.filter((c) => {
    const createdTime = new Date(c.createdAt).getTime();
    return createdTime >= cutoffTime && createdTime <= now.getTime();
  });

  // Group by user, keep newest
  const latestByUser = new Map<string, VibeCheckinInput>();

  for (const c of recent) {
    const existing = latestByUser.get(c.userId);
    if (!existing || new Date(c.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
      latestByUser.set(c.userId, c);
    }
  }

  return Array.from(latestByUser.values());
}

/**
 * Pure Vibe Computation
 */
export function computeVibe(
  countedCheckins: VibeCheckinInput[]
): VibeResult {
  if (countedCheckins.length === 0) {
    return {
      score: null,
      label: null,
      dominantMood: null,
      averageEnergy: null,
      countedMembers: 0,
      moodMix: {},
    };
  }

  // 1. Group Vibe Score = round( sum(mood scores) / count )
  let sumScores = 0;
  let sumEnergy = 0;
  const moodMix: Record<string, number> = {};
  const moodLatestTimestamp: Record<string, number> = {};

  for (const c of countedCheckins) {
    const score = getMoodScore(c.mood);
    sumScores += score;
    sumEnergy += c.energy;

    moodMix[c.mood] = (moodMix[c.mood] || 0) + 1;

    const time = new Date(c.createdAt).getTime();
    if (!moodLatestTimestamp[c.mood] || time > moodLatestTimestamp[c.mood]) {
      moodLatestTimestamp[c.mood] = time;
    }
  }

  const avgScore = sumScores / countedCheckins.length;
  const finalScore = Math.round(avgScore);
  const avgEnergy = Number((sumEnergy / countedCheckins.length).toFixed(1));

  // 2. Dominant Mood (highest count, tie-break by most recent check-in)
  let dominantMood: string | null = null;
  let maxCount = -1;
  let newestForMax = -1;

  for (const [mood, count] of Object.entries(moodMix)) {
    const latestTime = moodLatestTimestamp[mood] || 0;
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
      newestForMax = latestTime;
    } else if (count === maxCount) {
      if (latestTime > newestForMax) {
        dominantMood = mood;
        newestForMax = latestTime;
      }
    }
  }

  return {
    score: finalScore,
    label: labelForScore(finalScore),
    dominantMood,
    averageEnergy: avgEnergy,
    countedMembers: countedCheckins.length,
    moodMix,
  };
}
