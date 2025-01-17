import {ListBucketsCommand, ListObjectsV2Command, S3} from '@aws-sdk/client-s3'
import Logger from '@/utils/logger.util'
import {S3ClientFactory} from './clients'

import {File} from '@/types/spaces'

export class MinivisorClient {
    private logs: Logger
    private bucket: S3

    public marker: string | undefined
    public truncated: boolean
    public objects: File[]

    constructor() {
        this.logs = new Logger('[MINIVISOR_CLIENT]')
        this.bucket = S3ClientFactory.createMinivisorClient()
        this.objects = []
        this.truncated = true
    }

    public async getStats(): Promise<{ bucketCount: number; totalSpaceUsed: number }> {
        try {
            const bucketsResponse = await this.bucket.send(new ListBucketsCommand())
            const buckets = bucketsResponse.Buckets || []
            const bucketCount = buckets.length

            let totalSpaceUsed = 0

            for (const bucket of buckets) {
                const name = bucket.Name

                if (name) {
                    let continuationToken: string | undefined = undefined

                    do {
                        const objectsResponse: any = await this.bucket.send(
                            new ListObjectsV2Command({
                                Bucket: name,
                                ContinuationToken: continuationToken
                            })
                        )

                        const objects = objectsResponse.Contents || []

                        totalSpaceUsed += objects.reduce((acc: any, obj: any) => acc + (obj.Size || 0), 0)
                        continuationToken = objectsResponse.NextContinuationToken
                    } while (continuationToken)
                }
            }

            return {bucketCount, totalSpaceUsed}
        } catch (err: unknown) {
            this.logs.error(`Failed to fetch bucket stats with error: ${(err as Error).message ?? 'Unknown error'}`)
            throw err
        }
    }
}
