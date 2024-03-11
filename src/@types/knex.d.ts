import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    daily_diet_log: {
      id: string
      name: string
      description: string
      ate_at: string
      on_diet: string
      session_id: string
    }
  }
}
