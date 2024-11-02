import type { FastifyPluginAsync } from "fastify";

interface UserParams {
    cornflake: string;
}

const FetchUser: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    fastify.get<{ Params: UserParams }>('/user/:cornflake/', async (_request, _reply) => {

        if (!_request.params.cornflake) return _reply.code(400).send({
            status: '[Demonstride:user_fetch:missing_cornflake]',
            message: 'Please provide a valid CordX Cornflake for the user',
            code: 400
        });

        const user = await fastify.cordx.db.users.model.fetch(_request.params.cornflake);

        if (!user.success) return _reply.code(404).send({
            status: '[Demonstride:user_fetch:error]',
            message: user.message,
            code: 404
        });

        return _reply.code(200).send({
            status: '[Demonstride:user_fetch:success]',
            data: user.data,
            code: 200
        })
    });
}

export default FetchUser;