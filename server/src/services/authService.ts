import bcrypt from 'bcrypt';

import IRequest from '../types/request';

import UserService from './userService';

export default class AuthService {
  static async authenticateUser({phone, password}: {phone: string, password: string}, opts: IRequest): Promise<string> {
    try {
      const user = await UserService.get({phone}, opts, true);
      if (user.id) {
        return await bcrypt.compare(password, user.password_hash) && user.id;
      }
    } catch (err) {
      throw err;
    }
  }

  static doesUserExist = async ({phone}: {phone: string}, opts: IRequest): Promise<boolean> => (await UserService.get({phone}, opts)).id ? true : false;
}
