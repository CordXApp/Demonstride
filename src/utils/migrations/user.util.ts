import type CordX from '@/client';
import Mongo from './mongo.util';
import { Responses } from '@/types/database';
import { MongoUsers } from '@/models/cordxUsers';
import Cornflake from '../cornflake.util';
import { EntityType } from '@prisma/client';
import Logger from '@/utils/logger.util';

export default class UserMigrations {
    private client: CordX;
    private mongo: Mongo;
    private cornflake: Cornflake;
    private logs: Logger;

    constructor(client: CordX, mongo: Mongo) {
        this.client = client;
        this.mongo = mongo;
        this.logs = new Logger("[Demonstride]:User_Data_Migrations");
        this.cornflake = new Cornflake({
            workerId: 1,
            processId: 2,
            epoch: 3,
            increment: 4,
            sequence: 5n,
            debug: false
        });
    }

    /**
     * Migrate a users data from mongo to mysql
     * @param userId - The users Discord ID
     * @returns A response object
     */
    public async migrateMongoUser(userId: string): Promise<Responses> {
        const cornflake = this.cornflake.create();

        const signature = await this.createSignature(userId, cornflake);
        if (!signature.success) return { success: false, message: signature.message };

        const entity = await this.createEntity(userId, cornflake);
        if (!entity.success) return { success: false, message: entity.message };

        const user = await this.createUser(userId, cornflake);
        if (!user.success) return { success: false, message: user.message };

        return { success: true, message: `Successfully migrated user ${userId}` };
    }

    /**
     * Create a new user entity auth signature
     * @param userId - The users Discord ID
     * @param cornflake - The users Cornflake ID
     * @returns A response object
     */
    private async createSignature(userId: string, cornflake: string): Promise<Responses> {
        try {
            await this.mongo.connect();

            const user = await MongoUsers.findOne({ userId });

            const exists = await this.client.db.prisma.userEntitySignatures.findUnique({ where: { key: user.signature.key } });

            if (exists) return { success: false, message: `Authorization signature already exists for user: ${userId}` };

            await this.client.db.prisma.userEntitySignatures.create({
                data: {
                    id: cornflake,
                    key: user.signature.key
                }
            });

            this.logs.info(`Successfully migrated user ${userId}'s auth signature`);
            return { success: true, message: `Successfully migrated user ${userId}'s auth signature` };
        } catch (error: any) {
            this.logs.error(`Failed to migrate signature due to: ${error.message}`);
            return { success: false, message: `Failed to migrate signature due to: ${error.message}` };
        }
    }

    /**
     * Create a new user entity
     * @param userId - The users Discord ID
     * @param cornflake - The users Cornflake ID
     * @returns A response object
     */
    private async createEntity(userId: string, cornflake: string): Promise<Responses> {
        try {
            await this.mongo.connect();

            const user = await MongoUsers.findOne({ userId });

            await this.client.db.prisma.entity.create({
                data: {
                    id: cornflake,
                    type: EntityType.USER,
                    domain: user.active_domain ? user.active_domain : "none"
                }
            })

            this.logs.info(`Successfully created a new entity for user ${userId}`);
            return { success: true, message: `Successfully created a new entity for user ${userId}` };
        } catch (error: any) {
            this.logs.error(`Failed to create entity due to: ${error.message}`);
            return { success: false, message: `Failed to create entity due to: ${error.message}` };
        }
    }

    /**
     * Create a new user
     * @param userId - The users Discord ID
     * @param cornflake - The users Cornflake ID
     * @returns A response object
     */
    private async createUser(userId: string, cornflake: string): Promise<Responses> {
        try {
            await this.mongo.connect();

            const user = await MongoUsers.findOne({ userId });
            const migrated = await this.client.db.prisma.userEntity.findUnique({ where: { userid: userId } });

            if (!user) return { success: false, message: `User with ID ${userId} not found in old database` };
            if (migrated) return { success: false, message: `User with ID ${userId} already migrated` };

            await this.client.db.prisma.userEntity.create({
                data: {
                    avatar: user.avatar,
                    banner: user.banner,
                    username: user.username,
                    globalName: user.globalName,
                    entityId: cornflake,
                    userid: user.userId,
                    folder: cornflake,
                    entity: { connect: { id: cornflake } },
                    signature: user.signature ? {
                        connectOrCreate: {
                            where: { key: user.signature.key },
                            create: { id: cornflake, key: user.signature.key }
                        }
                    } : undefined
                }
            });

            this.logs.info(`Successfully migrated user ${userId}'s data`);
            return { success: true, message: `Successfully migrated user ${userId}'s data` };
        } catch (error: any) {
            this.logs.error(`Failed to migrate user ${userId} due to: ${error.message}`);
            return { success: false, message: `Failed to migrate user ${userId} due to: ${error.message}` };
        }
    }
}