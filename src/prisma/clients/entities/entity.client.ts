import { EntityMethods, Responses } from '@/types/index';
import { EntityType } from '@prisma/client';
import type CordX from '@/client';

export class EntityClient {

    private client: CordX;

    constructor(client: CordX) {
        this.client = client;
    }

    public get model(): EntityMethods {
        return {

            /**
             * Fetch all entities!
             * @returns { Promise<Responses> }
             */
            all: async (): Promise<Responses> => {

                try {
                    const entities = await this.client.db.prisma.entity.findMany({
                        select: {
                            id: true,
                            type: true,
                            domain: true,
                            _count: {
                                select: {
                                    domains: true,
                                    uploads: true,
                                    webhooks: true
                                }
                            }
                        }
                    });

                    return { success: true, data: entities };
                } catch (error: any) {
                    return { success: false, message: `Error fetching entities: ${error.message}` };
                }
            },

            /**
             * Create a new entity!
             * @param id The cornflake of the entity
             * @param type The type of the entity
             * @param domain The domain of the entity (optional)
             * @param key The key of the entity (optional)
             * @returns { Promise<Responses> }
             */
            create: async (id: string, type: string, domain?: string, key?: string): Promise<Responses> => {

                if (!id || !domain || !type) {
                    const missing = !id ? 'cornflake' : !domain ? 'domain' : !type ? 'type' : null;
                    return { success: false, message: `Missing required param: ${missing}` };
                }

                try {

                    await this.client.db.prisma.entity.create({
                        data: {
                            id: id,
                            type: type === 'USER' ? EntityType.USER : EntityType.ORG,
                            domain: domain ? domain : null,
                            key: key ? key : null
                        }
                    });

                    return { success: true, message: 'Entity created successfully' };
                } catch (error: any) {
                    return { success: false, message: `Error creating entity: ${id}: ${error.message}` };
                }
            },

            /**
             * Update an entity!
             * @param cornflake The cornflake of the entity
             * @param domain The domain of the entity
             * @returns { Promise<Responses> }
             */
            update: async (id: string, domain?: string, key?: string): Promise<Responses> => {

                if (!id) return { success: false, message: 'Missing required param: cornflake' };
                if (!domain && !key) return { success: false, message: 'Missing required param: domain or key' };

                try {

                    await this.client.db.prisma.entity.update({
                        where: { id },
                        data: {
                            domain: domain ? domain : null,
                            key: key ? key : null
                        }
                    });

                    return { success: true, message: 'Successfully updated the entities domain' };
                } catch (error: any) {
                    return { success: false, message: `Error updating entity: ${id}: ${error.message}` };
                }
            },

            /**
             * Check if an entity exists!
             * @param cornflake The cornflake of the entity
             * @returns { Promise<Boolean> }
             */
            exists: async (id: string): Promise<Boolean> => {

                if (!id) return false;

                try {
                    const entity = await this.client.db.prisma.entity.findUnique({
                        where: { id }
                    });

                    return entity ? true : false;
                } catch (error: any) {
                    return false;
                }
            },

            /**
             * Fetch an entity!
             * @param cornflake The cornflake of the entity
             * @returns { Promise<Responses> }
             */
            fetch: async (id: string): Promise<Responses> => {

                if (!id) return { success: false, message: 'Missing required param: cornflake' };

                try {
                    const entity = await this.client.db.prisma.entity.findUnique({
                        where: { id },
                        select: {
                            id: true,
                            type: true,
                            domain: true,
                        }
                    });

                    return { success: true, data: entity };
                } catch (error: any) {
                    return { success: false, message: `Error fetching entity: ${id}: ${error.message}` };
                }
            },

            /**
             * Delete an entity!
             * @param cornflake The cornflake of the entity
             * @returns { Promise<Responses> }
             */
            delete: async (id: string): Promise<Responses> => {

                if (!id) return { success: false, message: 'Missing required param: cornflake' };

                try {
                    await this.client.db.prisma.entity.delete({
                        where: { id }
                    });

                    return { success: true, message: 'Entity deleted successfully' };
                } catch (error: any) {
                    return { success: false, message: `Error deleting entity: ${id}: ${error.message}` };
                }
            }
        }
    }
}