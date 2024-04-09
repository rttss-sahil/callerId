import User, { IUser } from '../models/user';

import PGClient from '../db/pg';

export interface IContext {
    user: IUser;
    pgClient: PGClient;
}

export default class Context implements IContext{
    user: IUser;
    pgClient: PGClient;

    constructor() {
        this.user = new User();
        this.pgClient = new PGClient();
    }
}