import fp from 'fastify-plugin'
import type { FastifyHelmetOptions } from '@fastify/helmet'
import helmet from '@fastify/helmet'

export default fp(async (fastify, opts: FastifyHelmetOptions) => {
    await fastify.register(helmet, { ...opts })
})
