import { UserEntityMethods, Responses } from '@/types/index';
import { EntityClient } from './base.client';
import { Entity, EntityType } from '@/types/entitity';
import type CordX from '@/client';

export class UserEntities {

    private client: CordX;
    public parent: EntityClient;

    constructor({ client, parent }: { client: CordX, parent: EntityClient }) {
        this.client = client;
        this.parent = parent;
    }

    public get method(): UserEntityMethods {
        return {
            /**
             * Create a new user entity
             * @param entity The entity to create
             * @returns {Promise<Responses>}
             */
            create: async (entity: Entity): Promise<Responses> => {

                const { name, handle, userid, avatar, banner } = entity;

                if (!name || !handle || !userid) {
                    const missing = !name ? 'name' : !handle ? 'handle' : 'userid';
                    return { success: false, message: `Missing required field: ${missing}` };
                }

                try {

                    const apiKey = await this.parent.createApiKey();

                    const data = {
                        id: this.parent.cornflake.create(),
                        name: name,
                        handle: handle,
                        type: 'DISCORD_USER' as EntityType,
                        userid: userid,
                        avatar: avatar || null,
                        banner: banner || null,
                        apiKey: apiKey
                    };

                    const entity = await this.client.db.prisma.entity.create({ data });

                    return {
                        success: true,
                        message: `Successfully created entity: ${entity.id}`,
                        data: entity
                    }
                } catch (error: any) {
                    return {
                        success: false,
                        message: `Failed to create entity: ${error.message}`
                    };
                }
            }
        }
    }
}