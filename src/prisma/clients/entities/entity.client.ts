import { EntityCreateMethods, Responses } from '@/types/index';
import { randomBytes } from 'crypto';
import { Entity } from '@/types/entitity';
import type CordX from '@/client';
import axios from 'axios';

export class EntityClient {

    private client: CordX;

    constructor(client: CordX) {
        this.client = client;
        this.validateBotId = this.validateBotId.bind(this);
        this.createApiKey = this.createApiKey.bind(this);
    }

    public get create(): EntityCreateMethods {
        return {
            /**
             * Create a new User Entity
             * @param entity The entity object
             * @returns {Promise<Responses>}
             */
            user: async (entity: Entity) => {

                const { name, handle, userid } = entity;

                if (!name || !handle || !userid) {
                    const missing = !name ? 'name' : !handle ? 'handle' : !userid ? 'userid' : '';
                    return { success: false, message: `Missing required field: ${missing}` };
                }

                try {

                    const data: any = {
                        id: this.client.db.cornflake.create(),
                        name,
                        type: 'DISCORD_USER',
                        handle,
                        avatar: entity.avatar || null,
                        banner: entity.banner || null,
                        userid: userid,
                        apiKey: await this.createApiKey()
                    }

                    await this.client.db.prisma.entity.create({ data });

                    return { success: true, message: `Entity created with id: ${entity.id}` };
                } catch (error: any) {
                    return { success: false, message: error.message };
                }
            }
        }
    }

    private async validateBotId(botid: string): Promise<boolean> {
        try {
            const response = await axios.get(`https://discord.com/api/v9/applications/${botid}`, {
                headers: { Authorization: `Bot ${this.client.token}` }
            });

            return response.status === 200;
        } catch (error: any) {
            return false;
        }
    }

    private async createApiKey(): Promise<string> {
        return randomBytes(32).toString('hex');
    }
}