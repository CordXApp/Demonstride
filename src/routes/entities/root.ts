import type { FastifyPluginAsync } from 'fastify'

/**
 * @swagger
 * /entities:
 *   get:
 *     tags: ['Entities']
 *     description: List all of our available entities
 *     responses:
 *       200:
 *         description: Returns a list of all entities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entity'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Entity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The Entity's CordX Cornflake ID
 *         type:
 *           type: string
 *           description: The type of entity (User, Organization)
 *         domain:
 *           type: string
 *           description: The domain of the entity
 *         _count:
 *           type: object
 *           properties:
 *             domains:
 *               type: number
 *               description: The number of domains associated with the entity
 *             uploads:
 *               type: number
 *               description: The number of uploads created by the entity
 *             webhooks:
 *               type: number
 *               description: The number of webhooks associated with the entity
 */

const EntityRoot: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get('/', async (_request, _reply) => {
        const totalEntities = await fastify.cordx.db.prisma.entity.count()

        const entityList = await fastify.cordx.db.prisma.entity.findMany({
            select: {
                id: true,
                type: true,
                domain: true,
                _count: {
                    select: {
                        domains: true,
                        uploads: true,
                        webhooks: true
                    }
                }
            }
        })

        return _reply.code(200).send({
            status: '[Demonstride:entity_root:success]',
            total: `Serving ${totalEntities} entities`,
            entities: entityList,
            code: 200
        })
    })
}

export default EntityRoot
