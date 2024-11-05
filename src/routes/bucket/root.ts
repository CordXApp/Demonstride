import type { FastifyPluginAsync } from "fastify";
import { UserBucket } from "@/modules";

interface BucketParams {
    id: string;
}

interface BucketQuery {
    limit?: number;
}

const FetchUserBucket: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    fastify.get<{ Params: BucketParams, Querystring: BucketQuery }>('/:id', async (_request, _reply) => {

        const { id } = _request.params;
        const { limit } = _request.query;

        if (!id) return _reply.code(400).send({
            status: '[Demonstride:user_bucket:missing_id]',
            message: 'Please provide a valid Discord ID for the user whose bucket you want to fetch',
            code: 400
        });

        const bucket = await new UserBucket(fastify.cordx).user.fetch(id);

        if (!bucket.success) return _reply.code(500).send({
            status: '[Demonstride:user_bucket:failed]',
            message: bucket.message,
            code: 500
        });

        if (bucket.data.length === 0) return _reply.code(404).send({
            status: '[Demonstride:user_bucket:not_found]',
            message: 'No items found in the user bucket',
            code: 404
        })

        const transformBucketData = (data: any[]) => {
            return data.map(item => ({
                userId: item.Key.split('/')[0] as string,
                itemId: item.Key.split('/')[1] as string,
                itemSize: item.Size as number,
                lastModified: item.LastModified,
                itemETag: item.ETag,
                itemOwner: item.Owner.ID
            }));
        }

        const transformedBucket = transformBucketData(bucket.data);

        return _reply.code(200).send({
            status: '[Demonstride:user_bucket:success]',
            total: `User has: ${bucket.data.length} items in their bucket`,
            limit: `We are showing ${limit ? limit : bucket.data.length} items`,
            bucket: limit ? transformedBucket.slice(0, limit) : transformedBucket
        })
    });
}

export default FetchUserBucket;