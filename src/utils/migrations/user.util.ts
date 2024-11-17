import type CordX from '@/client';
import Mongo from './mongo.util';
import { Responses } from '@/types';
import { MongoUsers } from '@/models/cordxUsers';
import Logger from '@/utils/logger.util';

export default class UserMigrations {
    private client: CordX;
    private mongo: Mongo;
    public logs: Logger;

    constructor(client: CordX, mongo: Mongo) {
        this.client = client;
        this.mongo = mongo;
        this.logs = new Logger("[Demonstride]:User_Data_Migrations");
    }

    public get migrate() {
        return {
            /**
             * Migrate a user from our MongoDB to the new MySQL Entity System
             * @param userId The user ID
             * @returns { Promise<Responses> }
             */
            mongoUser: async (userId: string): Promise<Responses> => {

                await this.mongo.connect();

                const user = await MongoUsers.findOne({ userId });

                if (!user) return { success: false, message: 'User not found' };

                try {

                    const exists = await this.client.db.prisma.entity.findFirst({ where: { userid: user.userId } });

                    if (exists) return { success: false, message: 'User has already been migrated to a new entity!' };

                    const new_entity = await this.client.db.entities.users.method.create({
                        name: user.globalName,
                        handle: user.username,
                        userid: user.userId,
                        avatar: user.avatar || null,
                        banner: user.banner || null
                    })

                    if (!new_entity.success) return {
                        success: false,
                        message: `Failed to create new entity: ${new_entity.message}`
                    }

                    return {
                        success: true,
                        message: `Successfully migrated user: ${userId}`,
                        data: new_entity.data
                    }
                } catch (err: any) {
                    return {
                        success: false,
                        message: `Failed to migrate user: ${err.message}`
                    }
                }
            }
        }
    }
}