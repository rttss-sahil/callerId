import { QueryResult } from 'pg';

import IRequest from '../types/request';

interface ISearchArgs {
    query?: string;
    phone?: string;
}

export default class SearchService {
    static async searhContactByName(args: ISearchArgs, opts: IRequest) {
        try {
            const result = await opts.context.pgClient.executeQuery(`
                SELECT id, name, phone_number, source, spam_count FROM (
                    SELECT * FROM global_users WHERE name ILIKE '${args.query}%'
                    UNION
                    SELECT * FROM global_users WHERE name ILIKE '%${args.query}%' AND name NOT ILIKE '${args.query}%'
                )
            `);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async searchContactByPhone(args: ISearchArgs, opts: IRequest) {
        try {
            let result: QueryResult;
            result = await opts.context.pgClient.executeQuery(`
                SELECT id, name, phone_number, 'User' AS source, spam_count FROM "User" WHERE phone_number = '${args.phone}';
            `);
            if (result.rows.length > 0) {
                return result.rows;
            } else {
                result = await opts.context.pgClient.executeQuery(`
                    SELECT id, name, phone_number, source, spam_count FROM global_users WHERE phone_number LIKE '%${args.phone}%';
                `);
                return result.rows;
            }
        } catch (error) {
            throw error;
        }
    }
    
    static async searchContactByIdAndSource({id, source, userId}: {id: string, source: string, userId}, opts: IRequest) {
        try {
            let result;
            if (userId && source == 'contacts') {
                
                result = await opts.context.pgClient.executeQuery(`
                    SELECT id, name, phone_number, spam_count,
                        CASE WHEN EXISTS(SELECT 1 FROM ${source} WHERE id=${id} AND user_id = ${userId}) THEN email
                        ELSE NULL
                        END AS email
                    FROM global_users
                    WHERE id = ${id};
                `);
            } else {
                result = await opts.context.pgClient.executeQuery(`
                    SELECT id, name, phone_number FROM "${source}" WHERE id = ${id};
                `);
            }
                return result.rows;
        } catch (error) {
            throw error;
        }
    }
}