import type { FastifyPluginAsync } from "fastify";

interface QueryParams {
    userId: string;
}

interface PostBody {
    name: string;
    handle: string;
}

const CreateUserEntity: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    fastify.post<{ Querystring: QueryParams, Body: PostBody }>('/create', async (_request, _reply) => {

        const { userId } = _request.query;
        const { name, handle } = _request.body;

        if (!name || !handle) {
            const missing = !name ? 'name' : !handle ? 'handle' : '';
            return { success: false, message: `Missing required field: ${missing}` };
        }


        try {

            const entity = await fastify.ds.db.entities.create.user({ name: name, handle: handle, userid: userId });

            return _reply.status(200).send({
                status: '[Demonstride:Entity:CreateUserEntity]',
                message: `Successfully created a new user entity!`,
                data: entity
            })
        } catch (error: unknown) {

            return _reply.status(500).send({
                status: '[Demonstride:Entity:CreateUserEntity]',
                message: `Error: ${(error as Error).message || 'failed to create a new user entity.'}`,
                code: 500
            });
        }

    });
}

export default CreateUserEntity;