import { Entity } from './entitity'

export interface Responses {
    success: boolean
    message?: string
    percentage?: number
    changes?: any
    missing?: any
    data?: any
}

export interface DomainMethods {
    all: (id: string) => Promise<Responses>
    blacklisted: (domain: string) => Promise<boolean>
    count: (id: string) => Promise<Responses>
    create: (id: string, domain: string) => Promise<Responses>
    update?: (id: string, domain: string) => Promise<Responses>
    exists?: (id: string) => Promise<boolean>
    fetch?: (id: string) => Promise<Responses>
    delete?: (id: string) => Promise<Responses>
}

export interface UserEntityMethods {
    create: (entity: Entity) => Promise<Responses>
    update: (id: string, user: Entity) => Promise<Responses>
    fetch: (id: string) => Promise<Responses>
    delete: (id: string) => Promise<Responses>
}

export interface EncryptionClient {
    get init(): {
        encrypt: (data: string) => Promise<string>
        decrypt: (data: string) => Promise<string>
        partial: (data: string) => Promise<string>
    }
}
