import type { FastifyPluginAsync } from "fastify";
import { UserBucket } from "@/modules";

interface BucketParams {
    fileId: string;
}

interface BucketQuery {
    userId: string;
}

const FetchFileFromBucket: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    fastify.get<{ Params: BucketParams, Querystring: BucketQuery }>('/file/:fileId', async (_request, _reply) => {

        const { fileId } = _request.params;
        const { userId } = _request.query;

        if (!fileId) return _reply.code(400).send({
            status: '[Demonstride:user_bucket:missing_id]',
            message: 'Please provide a valid file ID for the file you want to fetch',
            code: 400
        });

        if (!userId) return _reply.code(400).send({
            status: '[Demonstride:user_bucket:missing_id]',
            message: 'Please provide a valid Discord ID for the user whose bucket you want to fetch',
            code: 400
        });

        const bucket = await new UserBucket(fastify.cordx).user.fetch(userId);

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

        const file = bucket.data.find((item: any) => item.Key.includes(fileId));

        if (!file) return _reply.code(404).send({
            status: '[Demonstride:user_bucket:file_not_found]',
            message: 'No file found in the user bucket',
            code: 404
        })

        const transformBucketData = (data: any) => {
            return {
                itemId: data.Key.split('/')[1]?.split('.')[0] as string,
                userId: data.Key.split('/')[0] as string,
                lastModified: data.LastModified as Date,
                itemETag: data.ETag as string,
                itemOwner: data.Owner.ID as string,
                itemSize: data.Size as number,
            }
        }

        const transformedBucket = transformBucketData(file);

        return _reply.code(200).send({
            status: '[Demonstride:user_bucket:success]',
            file: transformedBucket
        })


    });
}

export default FetchFileFromBucket;