/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Entities {
    /**
     * The Entity's Cornflake ID
     */
    id?: string
    /**
     * The Entity's name
     */
    name?: string
    /**
     * The type of Entity (e.g. 'DISCORD_USER', 'DISCORD_BOT', 'ORGANIZATION', 'INTEGRATION')
     */
    type?: 'DISCORD_BOT' | 'DISCORD_USER' | 'ORGANIZATION' | 'INTEGRATION'
    /**
     * The handle of the entity (ie: @cordx)
     */
    handle?: string
    /**
     * The biography of the entity
     */
    biography?: string
    /**
     * The avatar image for the entity
     */
    avatar?: string
    /**
     * The banner image for the entity
     */
    banner?: string
    /**
     * The Discord User ID of the entity (if entity is a user)
     */
    userid?: string
    /**
     * The Discord Client ID of the entity (if entity is a bot)
     */
    botid?: string
    /**
     * The Discord Webhook URL (if entity has a webhook)
     */
    webhook?: string
    /**
     * The domain of the entity
     */
    domain?: string
    /**
     * The API key for the entity
     */
    apiKey?: string
    /**
     * The owner of the entity (if entity is an organization)
     */
    owner?: string
    /**
     * The date the entity was created
     */
    createdAt?: string
    /**
     * The date the entity was last updated
     */
    updatedAt?: string
    domains?: EntityDomains[]
    uploads?: EntityUploads[]
    webhooks?: EntityWebhooks[]
    perms?: EntityPerms[]
    secrets?: EntitySecret[]
    members?: OrgEntityMembers[]
    links?: OrgEntityLinks
    [k: string]: unknown
}
export interface EntityDomains {
    id?: string
    name?: string
    content?: string
    verified?: boolean
    createdAt?: string
    updatedAt?: string
    entityId?: string
    [k: string]: unknown
}
export interface EntityUploads {
    id?: string
    entityId?: string
    fileid?: string
    filename?: string
    name?: string
    type?: string
    size?: number
    date?: string
    [k: string]: unknown
}
export interface EntityWebhooks {
    id?: string
    token?: string
    name?: string
    enabled?: boolean
    entityId?: string
    [k: string]: unknown
}
export interface EntityPerms {
    id?: string
    type?: 'USER' | 'ORG'
    userPerm?: 'OWNER' | 'ADMIN' | 'STAFF' | 'SUPPORT' | 'DEVELOPER' | 'BETA_TESTER' | 'BANNED_USER' | 'VERIFIED_USER'
    orgPerm?: 'OWNER' | 'ADMIN' | 'EDITOR' | 'READER' | 'GUEST' | 'BANNED' | 'VERIFIED'
    entityId?: string
    org_memberId?: string
    [k: string]: unknown
}
export interface EntitySecret {
    id?: string
    key?: string
    [k: string]: unknown
}
export interface OrgEntityMembers {
    id?: string
    orgId?: string
    userid?: string
    roles?: EntityPerms[]
    [k: string]: unknown
}
export interface OrgEntityLinks {
    id?: string
    discord?: string
    github?: string
    twitter?: string
    website?: string
    instagram?: string
    youtube?: string
    orgId?: string
    [k: string]: unknown
}
