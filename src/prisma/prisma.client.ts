import Logger from '@utils/logger.util';
import { PrismaClient } from '@prisma/client';
import Cornflake from '@/utils/cornflake.util';
import type CordX from '@/client';

/**
 * Prisma Clients
 */
import { EntityClient } from '@/prisma/clients/entities/entity.client';
import { UserClient } from '@/prisma/clients/entities/user.client';
import { DomainClient } from '@/prisma/clients/entities/domain.client';

const prisma = new PrismaClient();

export class DatabaseClient {
    private logs: Logger;
    private cordx: CordX;
    public cornflake: Cornflake;
    public prisma: PrismaClient;

    /** Primsa Clients */
    public entities: EntityClient;
    public users: UserClient;
    public domains: DomainClient;

    constructor(cordx: CordX) {
        this.prisma = prisma;
        this.cordx = cordx;
        this.logs = new Logger('Demonstride:PrismaManager');
        this.entities = new EntityClient(cordx);
        this.users = new UserClient(cordx);
        this.domains = new DomainClient(cordx);
        this.cornflake = new Cornflake({
            workerId: 1,
            processId: 2,
            epoch: 3,
            increment: 4,
            sequence: 5n,
            debug: false
        })
    }

    public async isConnected(): Promise<boolean> {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            this.logs.info('Connected to the database.');
            return true;
        } catch (error) {
            this.logs.error('Failed to connect to the database.');
            return false;
        }
    }
}
