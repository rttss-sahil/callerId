import jwt from 'jsonwebtoken';

export default class TokenService {
  static generateToken(userId: string): string {
    var token = jwt.sign({ userId }, 'secret', { expiresIn: '1h' });
    return token;
  }
  
  static async verifyToken(token: string) {
    try {
      return jwt.verify(token, 'secret')
    } catch (error) {
      console.log('error while verifying token: ', error)
      return false;
    }
  }  
}