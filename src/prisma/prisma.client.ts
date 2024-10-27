import { PrismaClient } from '@prisma/client';
import Logger from '@utils/logger.util';

const prisma = new PrismaClient();

export class DatabaseClient {
    public logs: Logger;
    public prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
        this.logs = new Logger('Demonstride:PrismaManager');
    }
}
