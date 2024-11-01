import type CordX from '@/client';
import Mongo from './mongo.util';
import MYSQL from './mysql.util';
import { Responses } from '@/types/database';
import { MongoUsers } from '@/models/cordxUsers';
import { EntityModule } from '@/modules/entity.module';
import Cornflake from '../cornflake.util';
import Logger from '@/utils/logger.util';

export default class UserMigrations {
    private client: CordX;
    private mongo: Mongo;
    private mysql: MYSQL;
    private cornflake: Cornflake;
    private entities: EntityModule;
    private logs: Logger;

    constructor(client: CordX, mongo: Mongo, mysql: MYSQL) {
        this.client = client;
        this.mongo = mongo;
        this.mysql = mysql;
        this.logs = new Logger("[Demonstride]:User_Data_Migrations");
        this.entities = new EntityModule(this.client);
        this.cornflake = new Cornflake({
            workerId: 1,
            processId: 2,
            epoch: 3,
            increment: 4,
            sequence: 5n,
            debug: false
        });
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

                    const signature = await this.entities.create.signature({ cornflake, signature: mongoUser.signature ? mongoUser.signature.key : null });
                    if (!signature.success) return { success: false, message: signature.message };

                    const entity = await this.entities.create.entity({ cornflake, domain: mongoUser.active_domain !== 'none' ? mongoUser.active_domain : 'none', type: 'USER' });
                    if (!entity.success) return { success: false, message: entity.message };

                    const user = await this.entities.create.user({
                        avatar: mongoUser.avatar,
                        banner: mongoUser.banner,
                        username: mongoUser.username,
                        globalName: mongoUser.globalName,
                        entityId: cornflake,
                        userid: userId,
                        folder: cornflake,
                        signature: mongoUser.signature ? mongoUser.signature.key : null
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

            }
        }
    }
}