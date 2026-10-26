// server/src/config/env.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url().default('https://mock-supabase.supabase.co'),
  SUPABASE_SECRET_KEY: z.string().default('sb_secret_mock_key_for_development'),
  CORS_ORIGINS: z.string().default('http://localhost:5173,http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  // In development, fall back to defaults
}

export const env = parsed.success ? parsed.data : envSchema.parse({});
