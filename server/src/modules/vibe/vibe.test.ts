// server/src/modules/vibe/vibe.test.ts
// Unit tests for Vibe Engine verifying PRD Section 5.4 Worked Example

import { describe, it, expect } from 'vitest';
import { computeVibe, filterCountedCheckins, labelForScore } from './vibe.js';

describe('Vibe Engine Unit Tests', () => {
  it('PRD Section 5.4 Worked Example: Late Night Crew room yields 79 (Good vibes), dominant chill, energy 3.8', () => {
    const checkins = [
      { userId: 'rahul', mood: 'chill', energy: 3, createdAt: new Date('2026-10-25T01:00:00Z') },
      { userId: 'aman', mood: 'hyped', energy: 5, createdAt: new Date('2026-10-25T01:10:00Z') },
      { userId: 'rohit', mood: 'happy', energy: 4, createdAt: new Date('2026-10-25T01:20:00Z') },
      { userId: 'gaurav', mood: 'chill', energy: 3, createdAt: new Date('2026-10-25T01:30:00Z') },
    ];

    const result = computeVibe(checkins);

    expect(result.score).toBe(79);
    expect(result.label).toBe('Good vibes');
    expect(result.dominantMood).toBe('chill');
    expect(result.averageEnergy).toBe(3.8);
    expect(result.countedMembers).toBe(4);
    expect(result.moodMix).toEqual({
      chill: 2,
      hyped: 1,
      happy: 1,
    });
  });

  it('handles empty check-ins gracefully', () => {
    const result = computeVibe([]);
    expect(result.score).toBeNull();
    expect(result.label).toBeNull();
    expect(result.dominantMood).toBeNull();
    expect(result.averageEnergy).toBeNull();
    expect(result.countedMembers).toBe(0);
    expect(result.moodMix).toEqual({});
  });

  it('correctly applies tie-breaker: newer checkin wins for dominant mood', () => {
    const checkins = [
      { userId: 'u1', mood: 'happy', energy: 4, createdAt: new Date('2026-10-25T01:00:00Z') },
      { userId: 'u2', mood: 'hyped', energy: 5, createdAt: new Date('2026-10-25T02:00:00Z') },
    ];

    const result = computeVibe(checkins);
    expect(result.dominantMood).toBe('hyped'); // hyped is newer
  });

  it('filters out check-ins older than 24 hours and takes only latest per user', () => {
    const now = new Date('2026-10-25T12:00:00Z');
    const rawCheckins = [
      // Older than 24h
      { userId: 'u1', mood: 'sad', energy: 1, createdAt: new Date('2026-10-24T10:00:00Z') },
      // Within 24h - older checkin for u2
      { userId: 'u2', mood: 'stressed', energy: 2, createdAt: new Date('2026-10-25T08:00:00Z') },
      // Within 24h - newer checkin for u2
      { userId: 'u2', mood: 'chill', energy: 4, createdAt: new Date('2026-10-25T10:00:00Z') },
    ];

    const filtered = filterCountedCheckins(rawCheckins, now);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].userId).toBe('u2');
    expect(filtered[0].mood).toBe('chill');
  });

  it('verifies label score boundaries', () => {
    expect(labelForScore(39)).toBe('Low vibes');
    expect(labelForScore(40)).toBe('Balanced vibes');
    expect(labelForScore(64)).toBe('Balanced vibes');
    expect(labelForScore(65)).toBe('Good vibes');
    expect(labelForScore(84)).toBe('Good vibes');
    expect(labelForScore(85)).toBe('Peak vibes');
    expect(labelForScore(100)).toBe('Peak vibes');
  });
});
