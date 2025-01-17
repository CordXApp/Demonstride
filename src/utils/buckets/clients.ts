import {S3} from '@aws-sdk/client-s3'

class S3ClientFactory {
    private static validateConfig(
        url: string | undefined,
        accessKeyId: string | undefined,
        secretAccessKey: string | undefined
    ): void {
        if (!url || !accessKeyId || !secretAccessKey) {
            throw new Error('Missing required configuration for S3 Client')
        }
    }

    public static createSeaweedClient(): S3 {
        const seaweedUrl = process.env.SEAWEED_LINK
        const accessKeyId = process.env.SEAWEED_KEY
        const secretAccessKey = process.env.SEAWEED_SECRET
        const seaweedRegion = process.env.SEAWEED_REGION

        this.validateConfig(seaweedUrl, accessKeyId, secretAccessKey)

        return new S3({
            forcePathStyle: true,
            endpoint: seaweedUrl,
            region: seaweedRegion,
            credentials: {
                accessKeyId: accessKeyId as string,
                secretAccessKey: secretAccessKey as string
            }
        })
    }

    public static createMinivisorClient(): S3 {
        const minivisorUrl = process.env.MINIVISOR_LINK
        const accessKeyId = process.env.MINIVISOR_KEY
        const secretAccessKey = process.env.MINIVISOR_SECRET
        const minivisorRegion = process.env.MINIVISOR_REGION

        this.validateConfig(minivisorUrl, accessKeyId, secretAccessKey)

        return new S3({
            forcePathStyle: true,
            endpoint: minivisorUrl,
            region: minivisorRegion,
            credentials: {
                accessKeyId: accessKeyId as string,
                secretAccessKey: secretAccessKey as string
            }
        })
    }
}

export {S3ClientFactory}
