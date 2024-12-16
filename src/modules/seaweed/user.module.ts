import Logger from '@/utils/logger.util'
import type CordX from '@/client'
import { S3 } from '@aws-sdk/client-s3'
import { createBucketClient } from '@/utils/spaces/create-client'

import { File, UserBucketMod, BucketResponseObj } from '@/types/spaces'

export class UserBucket implements UserBucketMod {
    public logs: Logger
    public client: CordX
    public bucket: S3

    private marker: string | undefined
    private truncated: boolean
    private objects: File[]

    constructor(client: CordX) {
        this.client = client
        this.logs = new Logger('[CORDX_BUCKET]')
        this.bucket = createBucketClient()
        this.objects = []
        this.truncated = true
    }

    public get user() {
        return {
            list: async (user: string): Promise<BucketResponseObj> => {
                try {
                    while (this.truncated) {
                        const bucket = await this.bucket.listObjects({
                            Bucket: process.env.SPACES_NAME as string,
                            Prefix: user,
                            Marker: this.marker
                        })

                        if (!bucket || !bucket.Contents) {
                            return { success: false, message: 'Bucket is empty or does not exist' }
                        }

                        const filtered = bucket.Contents.filter(file => !file.Key?.endsWith('.gitkeep'))

                        this.objects = [
                            ...this.objects,
                            ...filtered.filter((item): item is File => item.Key !== undefined)
                        ]
                        this.truncated = !!bucket.IsTruncated

                        if (this.truncated) {
                            this.marker = bucket.Contents[bucket.Contents.length - 1]?.Key
                        }
                    }

                    return { success: true, data: this.objects }
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        this.logs.error(`Bucket error: ${err.message}`)
                        this.logs.debug(`Stack trace: ${err.stack}`)

                        return {
                            success: false,
                            message: `Failed to fetch bucket content for ${user} with error: ${err.message}`
                        }
                    }

                    return { success: false, message: 'Failed to fetch bucket content' }
                }
            },

            fetch: async (user: string): Promise<BucketResponseObj> => {
                try {
                    while (this.truncated) {
                        const bucket = await this.bucket.listObjects({
                            Bucket: process.env.SPACES_NAME as string,
                            Prefix: user,
                            Marker: this.marker
                        })

                        if (!bucket || !bucket.Contents) {
                            return { success: false, message: 'Bucket is empty or does not exist' }
                        }

                        const filtered = bucket.Contents.filter(file => !file.Key?.endsWith('.gitkeep'))

                        this.objects = [
                            ...this.objects,
                            ...filtered.filter((item): item is File => item.Key !== undefined)
                        ]
                        this.truncated = !!bucket.IsTruncated

                        if (this.truncated) {
                            this.marker = bucket.Contents[bucket.Contents.length - 1]?.Key
                        }
                    }

                    return { success: true, data: this.objects }
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        this.logs.error(`Bucket error: ${err.message}`)
                        this.logs.debug(`Stack trace: ${err.stack}`)

                        return {
                            success: false,
                            message: `Failed to fetch bucket content for ${user} with error: ${err.message}`
                        }
                    }

                    return { success: false, message: 'Failed to fetch bucket content' }
                }
            }
        }
    }
}
