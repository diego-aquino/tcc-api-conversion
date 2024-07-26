import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().optional(),

  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
});

export const environment = environmentSchema.parse(process.env);
