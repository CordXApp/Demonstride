import fp from 'fastify-plugin'

import type { FastifyEtagOptions } from '@fastify/etag'
import etag from '@fastify/etag'

export default fp<FastifyEtagOptions>(
    async (
        fastify,
        opts = {
            weak: false,
        },
    ) => {
        await fastify.register(etag, {
            ...opts,
        })
    },
)