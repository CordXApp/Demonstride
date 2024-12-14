import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { FastifyInstance } from 'fastify'
import type { SwaggerDefinition } from 'swagger-jsdoc'
import swaggerJsdoc from 'swagger-jsdoc'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

const swaggerDefinition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Demonstride',
        version: '4.3.0',
        description: 'Restful API for the CordX Services'
    },
    host: `0.0.0.0:${process.env.PORT ?? 4995}`,
    tags: [
        {
            name: 'Auth',
            description: 'Authentication API'
        },
        {
            name: 'Bucket',
            description: 'Bucket API'
        },
        {
            name: 'Entities',
            description: 'Entities API'
        },
        {
            name: 'Users',
            description: 'Users API'
        }
    ]
}

const apiDirectory = join(__dirname, 'routes')

const options: swaggerJsdoc.Options = {
    swaggerDefinition,
    // Path to the API docs
    apis: [`${apiDirectory}/**/*.js`, `${apiDirectory}/**/*.ts`]
}

export async function initSwagger(app: FastifyInstance) {
    const swaggerSpec = swaggerJsdoc(options)

    // Write to generated swagger file on development
    if (process.env.NODE_ENV !== 'production') {
        writeFileSync(join(__dirname, 'generated', 'swagger.json'), JSON.stringify(swaggerSpec, null, 2))
    }

    await app.register(fastifySwagger, {
        mode: 'static',
        specification: {
            path: join(__dirname, 'generated', 'swagger.json'),
            postProcessor(swaggerObject) {
                return swaggerObject
            },
            baseDir: join(__dirname, 'generated')
        }
    })

    await app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        uiHooks: {
            onRequest(request, reply, next) {
                next()
            },
            preHandler(request, reply, next) {
                next()
            }
        },
        staticCSP: true,
        transformStaticCSP: header => header
    })
}
