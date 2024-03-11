import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const { success, error, data } = envSchema.safeParse(process.env)

if (!success) {
  console.log(error.format())
  throw new Error()
}

export const env = data
