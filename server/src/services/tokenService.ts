import jwt from 'jsonwebtoken';

export default class TokenService {
  static generateToken(userId: string): string {
    var token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }
  
  static async verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      console.log('error while verifying token: ', error)
      return false;
    }
  }  
}