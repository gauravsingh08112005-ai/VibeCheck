// server/src/modules/checkins/schemas.ts
import { z } from 'zod';
import { VALID_MOODS } from '../../config/moods.js';

export const songInputSchema = z.object({
  title: z.string().trim().min(1, 'Song title is required.').max(100, 'Title cannot exceed 100 characters.'),
  artist: z.string().trim().min(1, 'Artist is required.').max(100, 'Artist cannot exceed 100 characters.'),
  link: z.string().trim().regex(/^https?:\/\//i, 'Link must begin with http:// or https://').optional().or(z.literal('')),
});

export const checkinInputSchema = z.object({
  mood: z.enum(VALID_MOODS, {
    errorMap: () => ({ message: 'Mood must be one of: happy, hyped, romantic, chill, focused, nostalgic, stressed, sad.' }),
  }),
  energy: z.number().int().min(1, 'Energy must be between 1 and 5.').max(5, 'Energy must be between 1 and 5.'),
  note: z.string().trim().max(80, 'Note cannot exceed 80 characters.').optional().nullable(),
  songs: z.array(songInputSchema).max(3, 'A maximum of 3 songs can be attached.').default([]),
}).strict();
