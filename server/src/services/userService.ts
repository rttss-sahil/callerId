import bcrypt from 'bcrypt';

import User, { IUser } from '../models/user';

import IRequest from '../types/request';

export default class UserService {
  static async get({phone, id}: {id?: string, phone?: string}, opts: IRequest, shouldSendHash: boolean = false): Promise<IUser> {
    try {
      var users = await opts.context.pgClient.executeQuery(`
        SELECT id, name, email, phone_number${shouldSendHash ? ', password_hash' : ''} FROM "User" WHERE id = ${id || 0} or phone_number = '${phone || ''}';
      `);
      var user = users.rows[0];
      if (user) {
        return new User().fromJson(user);
      }
      else return new User();
    } catch (err) {
      throw err;
    }
  }

  static async save({phone, password, name, email}: {phone: string, password: string, name: string, email?: string}, opts: IRequest): Promise<IUser> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      var users = await opts.context.pgClient.executeQuery(`
        INSERT INTO "User" (phone_number, password_hash, name, email) VALUES ('${phone}', '${hashedPassword}', '${name}', '${email || ''}') RETURNING id, name, email, phone_number;
      `);
      var user = users.rows[0];
      if (user) {
        return new User().fromJson(users.rows[0]);
      }
      else return new User();
    } catch (error) {
      throw error;
    }
  }
}