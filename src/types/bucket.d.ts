/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface UserBucketSchema {
    BucketData?: {
        /**
         * The status of the request
         */
        status?: string
        /**
         * The total number of items in the bucket
         */
        total?: number
        /**
         * The limit of items per page
         */
        limit?: number
        Bucket?: BucketItem[]
        [k: string]: unknown
    }
    BucketItem?: {
        /**
         * The user id
         */
        userId?: string
        /**
         * The item id
         */
        itemId?: string
        /**
         * The size of the item
         */
        itemSize?: number
        /**
         * The last modified date
         */
        lastModified?: string
        /**
         * The item ETag
         */
        itemETag?: string
        /**
         * The item owner
         */
        itemOwner?: string
        [k: string]: unknown
    }
    Error?: {
        /**
         * The status code of the error
         */
        status?: string
        /**
         * The error message
         */
        message?: string
        /**
         * The HTTP status code
         */
        code?: number
        [k: string]: unknown
    }
    [k: string]: unknown
}
export interface BucketItem {
    /**
     * The user id
     */
    userId: string
    /**
     * The item id
     */
    itemId: string
    /**
     * The size of the item
     */
    itemSize: number
    /**
     * The last modified date
     */
    lastModified: string
    /**
     * The item ETag
     */
    itemETag: string
    /**
     * The item owner
     */
    itemOwner: string
    [k: string]: unknown
}
