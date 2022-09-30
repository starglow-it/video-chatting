import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';

export interface IRequest extends Request {
    data?: {
        [key: string]: Document | null;
    };
}

export interface IResponse extends Response {
}

export interface INextFunction extends NextFunction {
}

export type IMiddleware = (req: IRequest, res: IResponse, next: INextFunction) => Promise<unknown>;
