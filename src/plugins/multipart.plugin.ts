import fp from 'fastify-plugin'

import type { FastifyMultipartOptions } from '@fastify/multipart'
import multipart from '@fastify/multipart'

export default fp<FastifyMultipartOptions>(async (fastify, _opts) => {
    await fastify.register(multipart, {
        attachFieldsToBody: true,
    })
})