import type { FastifyPluginAsync } from "fastify";

interface UserParams {
    id: string;
}

/**
 * @swagger
 * /entities/user/{id}:
 *   get:
 *     tags: ['Entities', 'Users']
 *     description: Fetch a user by either their Discord ID or CordX Cornflake ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The users's ID, can either be a Discord ID or a CordX Cornflake ID.
 *       - in: query
 *         name: id_type
 *         required: true
 *         schema:
 *           type: string
 *           description: The type of ID provided, can either be DISCORD or CORNFLAKE.
 *     responses:
 *       200:
 *         description: Returns the user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserEntity'
 *       400:
 *         description: Missing or invalid CordX Cornflake ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserEntity:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *           description: The user's Discord Avatar URL
 *         banner:
 *           type: string
 *           description: The user's Discord Banner URL
 *         username:
 *           type: string
 *           description: The user's Discord Username
 *         globalName:
 *           type: string
 *           description: The user's Discord Global Username
 *         userid:
 *           type: string
 *           description: The user's Discord ID
 *         entityId:
 *           type: string
 *           description: The user's Entity ID
 *         _count:
 *           type: object
 *           properties:
 *             orgs:
 *               type: number
 *               description: The number of organizations the user is in/owns
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: The status code of the error
 *         message:
 *           type: string
 *           description: The error message
 *         code:
 *           type: number
 *           description: The HTTP status code
 */

const FetchUser: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    fastify.get<{ Params: UserParams, Querystring: { id_type: 'DISCORD' | 'CORNFLAKE' } }>('/user/:id', async (_request, _reply) => {

        if (!_request.query.id_type) return _reply.code(400).send({
            status: '[Demonstride:user_fetch:missing_id_type]',
            message: 'Please provide a valid id type for the user',
            code: 400
        })

        if (_request.query.id_type !== 'DISCORD' && _request.query.id_type !== 'CORNFLAKE') return _reply.code(400).send({
            status: '[Demonstride:user_fetch:invalid_id_type]',
            message: 'Please provide a valid id type for the user (DISCORD or CORNFLAKE)',
            code: 400
        })

        const user = await fastify.cordx.db.users.model.fetch(_request.params.id, _request.query.id_type);

        if (!user.success) return _reply.code(404).send({
            status: '[Demonstride:user_fetch:error]',
            message: user.message,
            code: 404
        });

        return _reply.code(200).send({
            status: '[Demonstride:user_fetch:success]',
            user: user.data,
            code: 200
        })
    });
}

export default FetchUser;