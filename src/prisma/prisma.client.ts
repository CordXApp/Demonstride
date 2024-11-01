import { PrismaClient, Prisma } from '@prisma/client';
import Logger from '@utils/logger.util';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export class DatabaseClient {
    public logs: Logger;
    public prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
        this.logs = new Logger('Demonstride:PrismaManager');
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
