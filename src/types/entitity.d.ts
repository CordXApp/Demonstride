import { Responses } from '@/types/index';

import {
    Entity,
    EntityDomains,
    EntityPerms,
    EntitySecret,
    EntityUploads,
    EntityWebhooks,
    UserEntity,
    UserEntitySignatures,
    UserPermissions,
    OrgEntity,
    OrgEntityLinks,
    OrgEntityMembers,
    OrgPermissions
} from '@prisma/client';

export interface Entity {
    id?: string;
    name: string;
    type?: EntityType;
    handle: string;
    biography?: string;
    avatar?: string;
    banner?: string;
    userid?: string;
    botid?: string;
    webhook?: string;
    domain?: string;
    apiKey?: string;
    owner?: string;
    createdAt?: DateTime;
    updatedAt?: DateTime;
}

export interface OrgEntity {
    id: string;
    name: string;
    logo: string;
    banner: string;
    description: string;
    links?: OrgEntityLinks;
    members?: OrgEntityMembers[];
    creator: UserEntity;
    owner: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    entityId: string;
    entity?: Entity;
}

export interface EntityDomains {
    id: string;
    name: string;
    content: string;
    verified: boolean;
    createdAt: DateTime;
    updatedAt?: DateTime;
    entityId: string;
    entity: Entity;
}

export interface EntityUploads {
    id: string;
    entityId: string;
    fileid?: string;
    filename?: string;
    name?: string;
    type?: string;
    size?: number;
    date?: DateTime;
    entity: Entity;
}

export interface EntityWebhooks {
    id: string;
    token: string;
    name: string;
    enabled: boolean;
    entityId: string;
    entity: Entity;
}

export interface EntityPerms {
    id: string;
    type: PermissionType;
    userPerm?: UserPermissions;
    orgPerm?: OrgPermissions;
    entityId: string;
    org_memberId?: string;
    entity: Entity;
    org_member?: OrgEntityMembers;
}

export interface EntitySecret {
    id: string;
    key: string;
    entity?: Entity;
}

export interface OrgEntityMembers {
    id: string;
    org: OrgEntity;
    roles: EntityPerms[];
    userid: string;
    orgId: string;
}

export interface OrgEntityLinks {
    id: string;
    discord: string;
    github: string;
    twitter: string;
    website: string;
    instagram: string;
    youtube: string;
    orgId: string;
    org: OrgEntity;
}

export type DateTime = string;

export enum EntityType {
    USER = 'DISCORD_USER',
    INT = 'INTEGRATION',
    ORG = 'ORGANIZATION',
}

export enum PermissionType {
    USER = 'USER',
    ORG = 'ORG',
}

export enum UserPermissions {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    SUPPORT = 'SUPPORT',
    DEVELOPER = 'DEVELOPER',
    BETA_TESTER = 'BETA_TESTER',
    BANNED_USER = 'BANNED_USER',
    VERIFIED_USER = 'VERIFIED_USER',
}

export enum OrgPermissions {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    READER = 'READER',
    GUEST = 'GUEST',
    BANNED = 'BANNED',
    VERIFIED = 'VERIFIED',
}