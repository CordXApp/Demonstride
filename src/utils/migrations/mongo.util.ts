import Logger from '../logger.util';
import mongoose, { Mongoose } from 'mongoose';

export default class Mongo {
    private logs: Logger;
    private connection: Mongoose | null = null;

    constructor() {
        this.logs = new Logger('Demonstride:Mongoose');
    }

    public async connect(): Promise<void> {
        if (!this.connection) {
            try {
                this.logs.info(`[Demonstride:Mongoose] connecting to MongoDB...`);
                this.connection = await mongoose.connect(process.env.MONGO_URI as string);
                this.logs.ready(`[Demonstride:Mongoose] connected to MongoDB`);
            } catch (error: any) {
                return this.logs.error(`[Demonstride:MongooseError] failed to connect to MongoDB: ${error.message}`);
            }
        }
    }
}