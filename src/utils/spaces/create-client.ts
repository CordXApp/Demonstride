import { S3 } from '@aws-sdk/client-s3'

export function createBucketClient() {
    const s3 = new S3({
        forcePathStyle: true,
        endpoint: process.env.SPACES_LINK as string,
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.SPACES_KEY as string,
            secretAccessKey: process.env.SPACES_SECRET as string
        }
    })

    return s3
}
