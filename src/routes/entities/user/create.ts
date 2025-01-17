import type {FastifyPluginAsync} from 'fastify'

interface QueryParams {
    userId: string
}

interface PostBody {
    name: string
    handle: string
}

const allowedHostnames = ['cordx.lol', 'cordximg.host', 'cordx.ca']

const CreateUserEntity: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    // Define the POST route for creating a user entity
    fastify.route<{ Querystring: QueryParams; Body: PostBody }>({
        url: '/create',
        method: ['POST'],
        handler: async (_request, _reply) => {
            const host = _request.hostname

            if (!host || !allowedHostnames.includes(host)) {
                return _reply.status(403).send({
                    status: '[Demonstride:user_entity_create:error]',
                    message: `Forbidden: "${host}" is an invalid host for this endpoint`,
                    code: 403
                })
            }

            const {userId} = _request.query
            const {name, handle} = _request.body

            if (!name || !handle) {
                const missing = !name ? 'name' : !handle ? 'handle' : ''
                return _reply.status(400).send({
                    status: '[Demonstride:user_entity_create:error]',
                    message: `Error: Missing required fields: "${missing}" from post body`,
                    code: 400
                })
            }

            try {
                const apiKey = await fastify.db.entities.createApiKey()
                const encrypted = await fastify.db.entities.encrypt(apiKey)

                const entity = await fastify.db.entities.users.create({
                    name: name,
                    handle: handle,
                    userid: userId,
                    apiKey: encrypted
                })

                return _reply.status(200).send({
                    status: '[Demonstride:user_entity_create:success]',
                    message: `Successfully created a new user entity with ID: ${entity.id}`,
                    code: 200
                })
            } catch (err: unknown) {
                return _reply.status(500).send({
                    status: '[Demonstride:user_entity_create:error]',
                    message: `Error: ${(err as Error).message || 'failed to create new user entity'}`,
                    code: 500
                })
            }
        }
    })

    // Handle all other methods for the /create route
    fastify.route({
        url: '/create',
        method: ['GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        handler: async (_request, _reply) => {
            return _reply.status(405).send({
                status: '[Demonstride:user_entity_create:error]',
                message: `Error: "${_request.method}" is an invalid method for this endpoint`,
                code: 405
            })
        }
    })
}

export default CreateUserEntity
