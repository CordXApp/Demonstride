import type { FastifyPluginAsync } from 'fastify'

interface UserParams {
    id: string
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
 *         description: The user's ID, can either be a Discord ID or a CordX Cornflake ID.
 *         schema:
 *           type: string
 *           description: The user's ID, can either be a Discord ID or a CordX Cornflake ID.
 *     responses:
 *       200:
 *         description: Returns the user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserEntity'
 *       400:
 *         description: Missing or invalid ID
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
 *         id:
 *           type: string
 *           description: The user's Cornflake ID
 *         name:
 *           type: string
 *           description: The user's name
 *         handle:
 *           type: string
 *           description: The user's handle
 *         type:
 *           type: string
 *           description: The type of entity
 *         biography:
 *           type: string
 *           description: The user's biography
 *         avatar:
 *           type: string
 *           description: The user's Discord Avatar URL
 *         banner:
 *           type: string
 *           description: The user's Discord Banner URL
 *         userid:
 *           type: string
 *           description: The user's Discord ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the entity was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the entity was last updated
 *         _count:
 *           type: object
 *           properties:
 *             domains:
 *               type: number
 *               description: The number of domains the user owns
 *             uploads:
 *               type: number
 *               description: The number of uploads by the user
 *             perms:
 *               type: number
 *               description: The number of permissions the user has
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
    fastify.get<{ Params: UserParams }>('/:id', async (_request, _reply) => {
        if (!_request.params.id) {
            return _reply.code(400).send({
                status: '[Demonstride:user_fetch:missing_id]',
                message: 'Please provide a valid Discord or Cornflake ID for the User Entity',
                code: 400
            })
        }

        const user = await fastify.cordx.db.entities.users.fetch(_request.params.id)

        if (!user.success) {
            return _reply.code(404).send({
                status: '[Demonstride:user_fetch:error]',
                message: user.message,
                code: 404
            })
        }

        return _reply.code(200).send({
            status: '[Demonstride:user_fetch:success]',
            user: user.data,
            code: 200
        })
    })
}

export default FetchUser
