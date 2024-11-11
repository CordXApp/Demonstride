import Logger from '@utils/logger.util';
import Cornflake from '@/utils/cornflake.util';
import { UserEntities } from './user.entity';
import { randomBytes } from 'crypto';
import type CordX from '@/client';
import axios from 'axios';

export class EntityClient {

    private client: CordX;
    private discordApiUrl: string;
    public cornflake: Cornflake;
    public logger: Logger;

    public users: UserEntities;

    constructor(client: CordX) {
        this.client = client;
        this.logger = new Logger('[Demonstride:EntityClient]');
        this.validateUserId = this.validateUserId.bind(this);
        this.validateBotId = this.validateBotId.bind(this);
        this.createApiKey = this.createApiKey.bind(this);
        this.discordApiUrl = 'https://proxy.cordx.lol/api'

        this.cornflake = new Cornflake({
            workerId: 1,
            processId: 2,
            increment: 4,
            sequence: 5n,
            debug: false,
            epoch: 3
        })

        this.users = new UserEntities({
            parent: this,
            client: this.client
        });
    }

    /**
     * Validate a Discord Bot ID
     * @param botid The Discord Bot ID
     * @returns {Promise<boolean>}
     */
    public async validateBotId(botid: string): Promise<boolean> {
        try {
            const response = await axios.get(`${this.discordApiUrl}/applications/${botid}`, {
                headers: { Authorization: `Bot ${this.client.token}` }
            });

            return response.status === 200;
        } catch (error: any) {
            return false;
        }
    }

    /**
     * Validate a Discord User ID
     * @param userid The Discord User ID
     * @returns {Promise<boolean>}
     */
    public async validateUserId(userid: string): Promise<boolean> {
        try {
            const response = await axios.get(`${this.discordApiUrl}/users/${userid}`, {
                headers: { Authorization: `Bot ${this.client.token}` }
            })

            return response.status === 200;
        } catch (err: any) {
            return false;
        }
    }

    /**
     * Create a new API Key
     * @returns {Promise<string>}
     */
    public async createApiKey(): Promise<string> {
        return randomBytes(32).toString('hex');
    }
}