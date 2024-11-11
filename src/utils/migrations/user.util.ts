import type CordX from '@/client';
import Mongo from './mongo.util';
import MYSQL from './mysql.util';
import { Responses } from '@/types';
import { UserClient } from '@/prisma/clients/entities/user.entity';
import { EntityClient } from '@/prisma/clients/entities/base.client';
import { MongoUsers } from '@/models/cordxUsers';
import Logger from '@/utils/logger.util';

export default class UserMigrations {
    private client: CordX;
    private mongo: Mongo;
    private mysql: MYSQL;
    private users: UserClient;
    private logs: Logger;

    constructor(client: CordX, mongo: Mongo, mysql: MYSQL) {
        this.client = client;
        this.mongo = mongo;
        this.mysql = mysql;
        this.users = new UserClient(client)
        this.entities = new EntityClient(client)
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

                const cornflake = this.cornflake.create();

                const mongoUser = await MongoUsers.findOne({ userId });

                if (!mongoUser) {
                    this.logs.error(`No user with ID: ${userId} found in our mongo`);
                    return {
                        success: false,
                        message: `No user with ID: ${userId} found in our mongo`
                    };
                }

                try {
                    /** Create a new entity for the user. */
                    const entity = await this.client.db.entities.model.create(cornflake, 'USER', mongoUser.active_domain ? mongoUser.active_domain : 'none');
                    if (!entity.success) return { success: false, message: entity.message };

                    /** Create the user entity data */
                    const user = await this.users.model.create({

                    })

                    if (!user.success) return { success: false, message: user.message };

                    return {
                        success: true,
                        message: 'User migrated successfully',
                        data: {
                            entity: entity.data,
                            signature: signature.data,
                            user: user.data
                        }
                    };
                } catch (error: any) {

                    this.logs.error(`Error migrating user: ${userId} to the new entity system: ${error.message}`);
                    return { success: false, message: `Error migrating user: ${userId} to the new entity system: ${error.message}` };
                }
            },

            /**
             * Migrate a user from our MySQL Entity System to the new MongoDB
             * @param userId The user ID
             * @returns { Promise<Responses> }
             */
            mysqlUser: async (userId: string): Promise<Responses> => {

                await this.mysql.connect();

                const user = await this.client.db.prisma.userEntity.findUnique({ where: { userid: userId } });

                if (!user) {


                }


            }
        }
    }
}