import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../../../../types/express';

export const wrapAsyncMiddleware = (middleware: IMiddleware) => (
    (req: Request, res: Response, next: NextFunction) => {
        middleware(req, res, next)
            .catch(next);
    }
);
