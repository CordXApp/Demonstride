import type { FastifyPluginAsync } from "fastify";
import Migrations from '@utils/migrations/base.util';

interface UserParams {
    userId: string;
    token: string;
}

const MongoUserMigration: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    fastify.get<{ Params: UserParams }>('/user/:userId/:token', async (_request, _reply) => {

        if (!_request.params.token) return _reply.code(400).send({
            status: '[Demonstride:migrate:mongo:user:missing_token]',
            message: 'Missing token',
            code: 400
        });

        if (!_request.params.userId) return _reply.code(400).send({
            status: '[Demonstride:migrate:mongo:user:missing_user_id]',
            message: 'Missing user ID',
            code: 400
        });

        if (_request.params.token !== process.env.ADMIN_TOKEN) return _reply.code(401).send({
            status: '[Demonstride:migrate:mongo:user:unauthorized]',
            message: 'Unauthorized',
            code: 401
        });

        const migration = new Migrations(fastify.cordx);

        const response = await migration.user.migrate.mongoUser(_request.params.userId);

        if (!response.success) return _reply.code(500).send({
            status: '[Demonstride:migrate:mongo:user:error]',
            message: response.message,
            code: 500
        });

        return _reply.code(200).send({
            status: '[Demonstride:migrate:mongo:user:success]',
            message: response.message,
            code: 200
        });
    });
}

export default MongoUserMigration;