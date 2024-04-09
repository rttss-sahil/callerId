import { Response, NextFunction} from "express";

import IRequest from "../types/request";

import TokenService from "../services/tokenService";
import UserService from "../services/userService";

const verifyToken = async (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization')
  if (authHeader) {
      var token = authHeader.split(' ')[1];
    try {
      const decoded = await TokenService.verifyToken(token);
      if (decoded && decoded['userId']) {
        var id = decoded['userId'];
        console.group('User with id', id, 'querying the serer.')
        var user = await UserService.get({id }, req);
        req.isAuth = true;
        req.context.user = user;
      } else {
        req.isAuth = false;
      }
    } catch (err) {
        throw err;
    }
  }
  next();
}

export default verifyToken;