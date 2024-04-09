import IRequest from '../types/request';

import Spam, { ISpam } from '../models/spam';

interface ISpamArgs {
    phone: string,
    userId?: string
}

export default class SpamService {
    static async find(args: ISpamArgs, opts: IRequest): Promise<any> {
        try {
            var spams = await opts.context.pgClient.executeQuery(`
                SELECT *
                FROM spam
                WHERE phone_number = '${args.phone}';
            `);
            return Array.from(spams.rows).map((i: ISpam) => new Spam().fromJson(i));
        } catch (error) {
            throw error;
        }
    }

    static async findbyUserId(args: ISpamArgs, opts: IRequest): Promise<any> {
        try {
            var spams = await opts.context.pgClient.executeQuery(`
                SELECT s.*
                FROM spam s
                JOIN "User" u ON s.marked_by_user_id = u.id
                WHERE s.phone_number = '${args.phone}' AND u.id = ${parseInt(args.userId)};
            `);
            return Array.from(spams.rows).map((i: ISpam) => new Spam().fromJson(i));
        } catch (error) {
            throw error;
        }
    }

    static async mark(args: ISpamArgs, opts: IRequest) {
        try {
            var spams = await opts.context.pgClient.executeQuery(`
                INSERT INTO spam (phone_number, marked_by_user_id) 
                VALUES ('${args.phone}', ${parseInt(args.userId)}) RETURNING *;`);
            return Array.from(spams.rows).map((i: ISpam) => new Spam().fromJson(i));
        } catch (error) {
            throw error;
        }
    }

    static async remove(args: ISpamArgs, opts: IRequest) {
        try {
            await opts.context.pgClient.executeQuery(`
                DELETE FROM spam WHERE phone_number = '${args.phone}' AND marked_by_user_id = ${parseInt(args.userId)}
            `)
        } catch (error) {
            throw error;
        }
    }
}