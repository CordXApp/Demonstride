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

export interface UserEntity {
    id?: string;
    avatar?: string;
    banner?: string;
    username?: string;
    globalName?: string;
    userid: string;
    folder?: string;
    key?: string;
    signature?: UserEntitySignatures;
    entityId?: string;
    entity?: Entity;
    orgs?: OrgEntity[];
}

export interface UserEntitySignatures {
    id: string;
    key: string;
    userEntity?: UserEntity;
}

export interface Entity {
    id: string;
    type: EntityType;
    user?: UserEntity;
    org?: OrgEntity;
    domain?: string;
    domains?: EntityDomains[];
    uploads?: EntityUploads[];
    webhooks?: EntityWebhooks[];
    perms?: EntityPerms[];
    secret?: EntitySecret;
    key?: string;
    userId?: string;
    orgId?: string;
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
    USER = 'USER',
    ORG = 'ORG',
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