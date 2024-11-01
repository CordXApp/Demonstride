import type CordX from '@/client';
import Mongo from './mongo.util';
import UserMigrations from './user.util';

export default class Migrations {
    private client: CordX;
    private mongo: Mongo;
    public user: UserMigrations;

    constructor(client: CordX) {
        this.client = client;
        this.mongo = new Mongo();
        this.user = new UserMigrations(client, this.mongo);
    }
}