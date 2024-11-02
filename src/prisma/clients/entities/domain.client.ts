import { DomainMethods, Responses } from '@/types/index';
import { KEYWORDS } from '@/types/domains';
import type CordX from '@/client';

interface DomainConfig {
    blacklist: string[];
}

export class DomainClient {
    private client: CordX;
    private config: DomainConfig

    constructor(client: CordX) {
        this.client = client;
        this.config = {
            blacklist: KEYWORDS
        };
    }

    public get model(): DomainMethods {
        return {

            /**
             * Get all entity domains
             * @returns {Promise<Responses>}
             */
            all: async (id: string): Promise<Responses> => {

                const domains = await this.client.db.prisma.entityDomains.findMany({
                    where: { entityId: id },
                    select: {
                        name: true,
                        verified: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });

                if (!domains) {
                    return {
                        success: false,
                        message: 'No domains found for this entity'
                    }
                }

                return { success: true, data: domains }
            },

            /**
             * Check if a domain is blacklisted
             * @param domain The domain to check
             * @returns {Promise<Boolean>}
             */
            blacklisted: async (domain: string): Promise<Boolean> => {

                const isBlacklisted = this.config.blacklist.some(blacklisted => domain.includes(blacklisted));

                return isBlacklisted;
            },

            /**
             * Count the number of domains associated with an entity
             * @param id The entity ID
             * @returns {Promise<Responses>}
             */
            count: async (id: string): Promise<Responses> => {

                if (!id) {
                    return { success: false, message: 'Missing required param: entity id' };
                }

                const count = await this.client.db.prisma.entityDomains.count({ where: { entityId: id } });

                return { success: true, data: count };
            },

            /**
             * Create a new domain for an entity
             * @param id The entity ID
             * @param domain The domain to create
             * @returns {Promise<Responses>}
             */
            create: async (id: string, domain: string): Promise<Responses> => {

                if (!id || !domain) {
                    const missing = !id ? 'entity id' : !domain ? 'domain' : null;
                    return { success: false, message: `Missing required param: ${missing}` };
                }

                try {
                    await this.client.db.prisma.entityDomains.create({
                        data: {
                            name: domain,
                            content: '',
                            entityId: id,
                            verified: false,
                        }
                    });

                    return { success: true, message: 'Domain created successfully' };
                } catch (error: any) {
                    return { success: false, message: `Error creating domain: ${error.message}` };
                }
            }
        }
    }
}