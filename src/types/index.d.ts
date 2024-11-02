import { Entity, UserEntity } from "./entitity";

export interface Responses {
    success: boolean
    message?: string
    percentage?: number
    missing?: any
    data?: any
}

export interface UserMethods {
    fetch: (id: UserEntity['id']) => Promise<Responses>;
}

export interface EntityMethods {
    create: (id: string, type: 'USER' | 'ORG', domain?: string, key?: string) => Promise<Responses>;
    update: (id: string, domain?: string, key?: string) => Promise<Responses>;
    exists: (id: Entity['id']) => Promise<Boolean>;
    fetch: (id: Entity['id']) => Promise<Responses>;
    delete: (id: Entity['id']) => Promise<Responses>;
}

export interface EncryptionClient {
    get init(): {
        encrypt: (data: string) => Promise<string>;
        decrypt: (data: string) => Promise<string>;
        partial: (data: string) => Promise<string>;
    }
}