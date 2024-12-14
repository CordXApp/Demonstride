import type { FastifyPluginAsync } from 'fastify'
import { UserBucket } from '@/modules'

interface BucketParams {
    id: string
}

interface BucketQuery {
    limit?: number
}

/**
 * @swagger
 * /bucket/{id}:
 *   get:
 *     tags: ['Bucket']
 *     description: Fetches the user's bucket and its contents.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's Discord ID.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The maximum number of items to return.
 *     responses:
 *       200:
 *         description: Returns the user's bucket and its contents.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BucketData'
 *       400:
 *         description: Missing or invalid Discord ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User or Bucket not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BucketData:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: The status of the request.
 *         total:
 *           type: string
 *           description: The total number of items in the user's bucket.
 *         limit:
 *           type: string
 *           description: The number of items to show.
 *         bucket:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BucketItem'
 *     BucketItem:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: Item owner's Discord ID.
 *         itemId:
 *           type: string
 *           description: The bucket item's ID.
 *         itemSize:
 *           type: number
 *           description: The size of the item in bytes.
 *         lastModified:
 *           type: string
 *           format: date-time
 *           description: The last modified date of the item.
 *         itemETag:
 *           type: string
 *           description: The ETag of the item.
 *         itemOwner:
 *           type: string
 *           description: The owner of the item.
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: The status code of the error.
 *         message:
 *           type: string
 *           description: The error message.
 *         code:
 *           type: number
 *           description: The error code.
 */

const FetchUserBucket: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get<{ Params: BucketParams; Querystring: BucketQuery }>('/:id', async (_request, _reply) => {
        const { id } = _request.params
        const { limit } = _request.query

        if (!id) {
            return _reply.code(400).send({
                status: '[Demonstride:user_bucket:missing_id]',
                message: 'Please provide a valid Discord ID for the user whose bucket you want to fetch',
                code: 400
            })
        }

        const bucket = await new UserBucket(fastify.cordx).user.fetch(id)

        if (!bucket.success) {
            return _reply.code(500).send({
                status: '[Demonstride:user_bucket:failed]',
                message: bucket.message,
                code: 500
            })
        }

        if (bucket.data.length === 0) {
            return _reply.code(404).send({
                status: '[Demonstride:user_bucket:not_found]',
                message: 'No items found in the user bucket',
                code: 404
            })
        }

        const transformBucketData = (data: any[]) => {
            return data.map(item => ({
                userId: item.Key.split('/')[0] as string,
                itemId: item.Key.split('/')[1] as string,
                itemSize: item.Size as number,
                lastModified: item.LastModified,
                itemETag: item.ETag,
                itemOwner: item.Owner.ID
            }))
        }

        const transformedBucket = transformBucketData(bucket.data)

        return _reply.code(200).send({
            status: '[Demonstride:user_bucket:success]',
            total: `User has: ${bucket.data.length} items in their bucket`,
            limit: `We are showing ${limit ? limit : bucket.data.length} items`,
            bucket: limit ? transformedBucket.slice(0, limit) : transformedBucket
        })
    })
}

export default FetchUserBucket
