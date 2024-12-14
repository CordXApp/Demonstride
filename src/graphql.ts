import AltairFastify from 'altair-fastify-plugin'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import mercurius from 'mercurius'
import mercuriusCodegen from 'mercurius-codegen'
import { makeSchema, queryType, stringArg } from 'nexus'

const buildContext = async (req: FastifyRequest) => ({
    authorization: req.headers.authorization
})

const Query = queryType({
    definition(t) {
        t.string('hello', {
            args: { name: stringArg() },
            resolve: (_parent, { name }) => `Hello ${name ?? 'World'}!`
        })
    }
})

const schema = makeSchema({
    types: [Query],
    outputs: {
        schema: `${__dirname}/generated/schema.graphql`,
        typegen: `${__dirname}/generated/typings.ts`
    }
})

export async function initGraphql(app: FastifyInstance) {
    try {
        await app.register(mercurius, {
            schema,
            graphiql: false,
            ide: false,
            path: '/graphql',
            allowBatchedQueries: true,
            context: buildContext
        })

        await app.register(AltairFastify, {
            path: '/gql',
            baseURL: '/gql/',
            endpointURL: '/graphql'
        })

        await mercuriusCodegen(app, {
            targetPath: `${__dirname}/generated/graphql.ts`
        })
    } catch (err: unknown) {
        app.log.error(err)
    }
}
