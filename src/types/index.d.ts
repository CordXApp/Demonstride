import { Entity } from "./entitity";

export interface Responses {
    success: boolean
    message?: string
    percentage?: number
    missing?: any
    data?: any
}

export interface UserMethods {
    create: (user: UserEntity) => Promise<Responses>;
    fetch: (id: string, id_type: 'DISCORD' | 'CORNFLAKE') => Promise<Responses>;
}

export interface DomainMethods {
    all: (id: string) => Promise<Responses>;
    blacklisted: (domain: string) => Promise<Boolean>;
    count: (id: string) => Promise<Responses>;
    create: (id: string, domain: string) => Promise<Responses>;
    update?: (id: string, domain: string) => Promise<Responses>;
    exists?: (id: string) => Promise<Boolean>;
    fetch?: (id: string) => Promise<Responses>;
    delete?: (id: string) => Promise<Responses>;
}

export interface UserEntityMethods {
    create: (entity: Entity) => Promise<Responses>;
    //integration: (entity: Entity) => Promise<Responses>;
    //organization: (entity: Entity) => Promise<Responses>;
}

export interface EncryptionClient {
    get init(): {
        encrypt: (data: string) => Promise<string>;
        decrypt: (data: string) => Promise<string>;
        partial: (data: string) => Promise<string>;
    }
}