import { Response, NextFunction } from "express";

import IRequest from "../types/request";
import Context from "../types/context";

const contextMiddleWare = async (req: IRequest, res: Response, next: NextFunction) => {
  req.context = new Context();
  next();
};

export default contextMiddleWare;