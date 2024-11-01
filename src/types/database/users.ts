import {
    UserEntity as PrismaUser,
    EntityDomains as PrismaDomains,
    UserEntitySignatures as PrismaSignatures,
} from "@prisma/client";

import type { PermissionResolvable } from "discord.js"

export interface User extends PrismaUser {
    id: string;
    avatar: string;
    banner: string;
    username: string;
    globalName: string;
    userid: string;
    secret: string;
    folder: string;
    webhook: string;
    cookie: string;
    domain: string;
    position?: string;
    permissions?: GatePermissions[];
    total?: number;
}

export interface CordXUser {
    id: number
    avatar: string
    banner: string
    userId: string
    username: string
    globalName: string
    owner: boolean
    admin: boolean
    moderator: boolean
    support: boolean
    banned: boolean
    verified: boolean
    beta: boolean
    active_domain: string
    domains: UserDomains[]
    signature: CordXSignatures
}

export interface UserDomains {
    name: string
    txtContent: string
    verified: boolean
    createdAt: Date
    updatedAt: Date
}

export interface CordXSignatures {
    key: string
    createdAt: Date
    updatedAt: Date
}

export interface Domain extends PrismaDomains {
    name: string;
    user: string;
    content: string;
    verified: boolean;
    createdAt: Date;
}

export interface Signature extends PrismaSignatures {
    key: string;
    createdAt: Date;
}

export interface UserConfig {
    Version: string;
    Name: string;
    DestinationType: string;
    RequestMethod: string;
    RequestURL: string;
    Headers: {
        userid: string;
        secret: string;
    },
    Body: string;
    FileFormName: string;
    URL: string;
}

export interface LeaderboardData {
    userid: string;
    username: string;
    globalName: string;
    position: string;
    total: number
}

export interface Perms {
    gate?: GatePermissions[]
    user: PermissionResolvable[]
    bot: PermissionResolvable[]
}

export type GatePermissions = 'OWNER' | 'ADMIN' | 'STAFF' | 'SUPPORT' | 'DEVELOPER' | 'MEMBER';

export const TOTAL_UPLOADERS = 5;