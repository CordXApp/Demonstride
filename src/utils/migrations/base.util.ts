import type CordX from '@/client';
import Mongo from './mongo.util';
import UserMigrations from './user.util';
import MySQL from './mysql.util';

export default class Migrations {
    /** clients */
    private client: CordX;
    private mongo: Mongo;
    private mysql: MySQL;

    /** methods */
    public user: UserMigrations;

    constructor(client: CordX) {
        /** clients */
        this.client = client;
        this.mongo = new Mongo();
        this.mysql = new MySQL();

        /** methods */
        this.user = new UserMigrations(client, this.mongo, this.mysql);
    }
}