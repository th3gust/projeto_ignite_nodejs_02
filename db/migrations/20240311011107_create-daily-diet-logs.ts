import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('daily_diet_log', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('ate_at').defaultTo(knex.fn.now()).notNullable(),
    table.enu('on_diet', ['yes', 'no']).notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('daily_diet_log')
}

