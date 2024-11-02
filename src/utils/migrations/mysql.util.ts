import Logger from '../logger.util';
import mysql, { Connection, ConnectionConfig } from 'mysql2/promise';

export default class MySQL {
    private logs: Logger;
    private connection: Connection | null = null;

    constructor() {
        this.logs = new Logger('[Demonstride:MySQL_OldDB]');
        this.connect()
    }

    public async connect(): Promise<void> {
        if (!this.connection) {
            try {
                this.logs.info(`Connecting to MySQL....`);

                this.connection = await mysql.createConnection({
                    host: process.env.OMYSQL_HOST,
                    user: process.env.OMYSQL_USER,
                    password: process.env.OMYSQL_PASS,
                    database: process.env.OMYSQL_DB,
                } as ConnectionConfig);

                this.logs.ready(`Connected to MySQL successfully!`);
            } catch (error: any) {
                this.logs.error(`Failed to connect to MySQL: ${error.message}`);
                this.logs.debug(error.stack)
            }
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.end();
                this.logs.info(`[Demonstride:MySQL] disconnected from MySQL`);
                this.connection = null;
            } catch (error: any) {
                this.logs.error(`[Demonstride:MySQLError] failed to disconnect from MySQL: ${error.message}`);
            }
        }
    }

    public getConnection(): Connection | null {
        return this.connection;
    }

    public async query(query: string, values?: any): Promise<any> {
        if (!this.connection) {
            this.logs.error(`[Demonstride:MySQL] no connection to the database`);
            return null;
        }

        try {
            const [rows] = await this.connection.query(query, values);
            return rows;
        } catch (error: any) {
            this.logs.error(`[Demonstride:MySQLError] failed to query the database: ${error.message}`);
            return null;
        }
    }
}