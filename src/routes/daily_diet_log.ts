import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export const dailyDietLogRoutes = async (app: FastifyInstance) => {
  // todas as refeições
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const dailyDietLog = await knex('daily_diet_log')
        .where('session_id', sessionId)
        .select('*')

      return dailyDietLog
    },
  )

  // refeição por id

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const getDailyDietLogParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getDailyDietLogParamsSchema.parse(request.params)

      const dietLog = await knex('daily_diet_log')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { dietLog }
    },
  )

  // postar refeição
  app.post('/', async (request, reply) => {
    const createDailyDietLogBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      on_diet: z.enum(['yes', 'no']),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
      })
    }

    const { name, description, on_diet } = createDailyDietLogBodySchema.parse(
      request.body,
    )

    await knex('daily_diet_log').insert({
      id: crypto.randomUUID(),
      name,
      description,
      on_diet,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  // editar refeição

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const getDailyDietLogParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const createUpdateDailyDietLogBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        on_diet: z.string().optional(),
      })

      const { id } = getDailyDietLogParamsSchema.parse(request.params)

      const { name, description, on_diet } =
        createUpdateDailyDietLogBodySchema.parse(request.body)

      await knex('daily_diet_log')
        .where({
          id,
          session_id: sessionId,
        })
        .update({
          name,
          description,
          on_diet,
        })

      return reply.status(201).send()
    },
  )

  // deletar refeição

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const getDailyDietLogParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getDailyDietLogParamsSchema.parse(request.params)

      await knex('daily_diet_log')
        .where({
          id,
          session_id: sessionId,
        })
        .del()

      return reply.status(204).send()
    },
  )

  // avaliações

  app.get(
    '/log',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const dailyDietLog = await knex('daily_diet_log')
        .where('session_id', sessionId)
        .select('*')

      const totalMeals = dailyDietLog.length

      const totalMealsOnDiet = dailyDietLog.filter(
        ({ on_diet }) => on_diet === 'yes',
      ).length

      const totalMealsOutDiet = totalMeals - totalMealsOnDiet

      const resolve = {
        totalMeals,
        totalMealsOnDiet,
        totalMealsOutDiet,
      }

      return resolve
    },
  )
}
