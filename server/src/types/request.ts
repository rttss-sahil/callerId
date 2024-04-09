import { Request } from 'express';

import { IContext } from "./context";

export default interface IRequest extends Request {
    context: IContext;
    isAuth: boolean
}