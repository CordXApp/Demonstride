import { DatabaseClient } from "@/prisma/prisma.client";
import { Client, ClientOptions } from "discord.js";
import Logger from "@utils/logger.util";

export default class CordX extends Client {

    public readonly db: DatabaseClient;
    public logs: Logger;

    constructor(options: ClientOptions) {
        super(options);

        this.db = new DatabaseClient(this);
        this.logs = new Logger("Demonstride:DiscordClient");

        this.init();
    }

    public async authenticate(token: string): Promise<void> {
        try {
            this.logs.info(`Authenticating with token: ${token.substring(0, 5)}.**********`);

            await this.login(token);
        } catch (e: any) {
            this.logs.error(`Failed to authenticate with token: ${e.message}`);
            return process.exit(1);
        }
    }

    private init(): void {
        this.on('ready', () => {
            this.logs.ready('Discord Client is online and ready!');
        })

        this.on('error', (error) => {
            this.logs.error(`An error occurred: ${error}`);
        })
    }
}