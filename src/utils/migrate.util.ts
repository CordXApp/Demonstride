import { Responses } from '@/types/database/index';
import { CordXSnowflake } from '@cordxapp/snowflake';
import { EntityType } from '@prisma/client';
import mongoose, { Mongoose } from 'mongoose';
import { MongoUsers } from '@/models/cordxUsers';
import Logger from './logger.util';
import type CordX from '@/client';

export default class MigrateData {
    public client: CordX;
    private connection: Mongoose | null = null;
    private logs: Logger;

    constructor(client: CordX) {
        this.client = client;
        this.logs = new Logger('Demonstride:USER_DB_MIGRATION');
    }

    private async ConnectToMongo(): Promise<void> {

        if (!this.connection) {

            try {

                this.connection = await mongoose.connect(process.env.MONGO_URI as string);

                this.logs.ready('Connected to MongoDB');
            } catch (err: any) {

                this.logs.error(`Error connecting to MongoDB: ${err.message}`);
            }
        }
    }

    public async MigrateUsers(): Promise<Responses> {
        await this.ConnectToMongo();

        const users = await MongoUsers.find({});

        if (!users) return { success: false, message: 'No users found' };

        for (const user of users) {
            const exists = await this.client.db.prisma.userEntity.findUnique({ where: { userid: user.userId } });

            if (!exists) {
                const NewCornflake = new CordXSnowflake({
                    workerId: 1,
                    processId: 2,
                    epoch: 3,
                    increment: 4,
                    sequence: 5n,
                    debug: false
                });

                const cornflake = NewCornflake.generate();

                if (user.signature) {
                    await this.client.db.prisma.userEntitySignatures.upsert({
                        where: { key: user.signature.key },
                        update: {},
                        create: {
                            id: cornflake,
                            key: user.signature.key,
                        },
                    });
                }

                await this.client.db.prisma.entity.upsert({
                    where: { userId: user.userId },
                    create: {
                        id: cornflake,
                        type: EntityType.USER,
                    },
                    update: {
                        user: { connect: { id: cornflake } },
                    },
                });

                await this.client.db.prisma.userEntity.upsert({
                    where: { userid: user.userId },
                    create: {
                        avatar: user.avatar,
                        banner: user.banner,
                        username: user.username,
                        globalName: user.globalName,
                        entityId: cornflake,
                        userid: user.userId,
                        folder: cornflake,
                        entity: { connect: { id: cornflake } },
                        signature: user.signature
                            ? {
                                connectOrCreate: {
                                    where: { key: user.signature.key },
                                    create: { id: cornflake, key: user.signature.key },
                                },
                            }
                            : undefined,
                    },
                    update: {
                        avatar: user.avatar,
                        banner: user.banner,
                        username: user.username,
                        globalName: user.globalName,
                        folder: cornflake,
                    },
                });
            }
        }

        return { success: true, message: 'Migration completed successfully' };
    }

    public async MigrateDomains(): Promise<Responses> {

        await this.ConnectToMongo();

        const users = await MongoUsers.find({});

        if (!users) return { success: false, message: 'No users found' };

        for (const user of users) {

            if (user.domains.length > 0) {

                for (const domain of user.domains) {

                    const domain_exists = await this.client.db.prisma.entityDomains.findFirst({ where: { name: domain.name } });
                    const user_exists = await this.client.db.prisma.userEntity.findUnique({ where: { userid: user.userId } });

                    if (!domain_exists) {

                        if (!user_exists) return { success: false, message: 'User does not exist' };

                        await this.client.db.prisma.entityDomains.create({
                            data: {
                                name: domain.name,
                                content: domain.txtContent,
                                verified: domain.verified,
                                entity: {
                                    connect: {
                                        id: user_exists.entityId
                                    }
                                }
                            }
                        });
                    }
                }


            }
        }
    }
}