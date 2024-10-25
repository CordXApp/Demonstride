import fp from 'fastify-plugin';

import type { FastifyEnvOptions } from '@fastify/env';
import env from '@fastify/env';

const schema = {
    type: 'object',
    required: ['PORT'],
    properties: {
        PORT: {
            type: 'string',
            default: 3000
        }
    }
}

const options = {
    confKey: 'config',
    schema: schema,
    dotenv: true
}

export default fp<FastifyEnvOptions>(async (fastify) => {
    await fastify.register(env, options);
});
