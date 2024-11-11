import Logger from '@utils/logger.util';
import { PrismaClient } from '@prisma/client';
import type CordX from '@/client';

import { EntityClient } from '@/prisma/clients/entities/base.client';

const prisma = new PrismaClient();

export class DatabaseClient {
    private logs: Logger;
    private cordx: CordX;
    public prisma: PrismaClient;

    /** Primsa Clients */
    public entities: EntityClient;

    constructor(cordx: CordX) {
        this.prisma = prisma;
        this.cordx = cordx;
        this.logs = new Logger('Demonstride:PrismaManager');
        this.entities = new EntityClient(cordx);
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
