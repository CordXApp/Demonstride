import type CordX from '@/client';
import Mongo from './mongo.util';
import UserMigrations from './user.util';

export default class Migrations {
    /** clients */
    private client: CordX;
    private mongo: Mongo;

    /** methods */
    public user: UserMigrations;

    constructor(client: CordX) {
        /** clients */
        this.client = client;
        this.mongo = new Mongo();

        /** methods */
        this.user = new UserMigrations(client, this.mongo);
    }
}