import fastify from 'fastify'
import { dailyDietLogRoutes } from './routes/daily_diet_log'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(dailyDietLogRoutes, {
  prefix: '/daily_log',
})

app.register(cookie)

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP Server is running.'))
