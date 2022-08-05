import * as httpStatus from 'http-status';

import { ApiError } from '../../errors/ApiError';
import { CommonErrors } from '../../../const/errors/common';
import { sendResponse } from '../http/sendResponse';
import { INextFunction, IRequest, IResponse } from '../../../../types/express';
import { logger } from '../../../config/logger';
import { NotFoundError } from '../../errors/CommonErrors';

function processError(err: Error) {
    if (err instanceof ApiError) {
        return err;
    }

    return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        errors: [CommonErrors.service],
    };
}

function logError(err: Error, req: IRequest) {
    const body = typeof req.body === 'object' && { ...req.body };
    if (body) {
        delete body.password;
        delete body.confirmPassword;
    }
    const user = req.data?.user;
    const reqData = {
        url: req.originalUrl,
        method: req.method,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
        headers: req.headers,
        body,
        user,
    };

    logger.info(
        `\t*1.Stack*:\n\t${err.stack}`
        + `\n\t*2.Req data*:\n${JSON.stringify(reqData, null, '   ')}`
        + `\n\t*3.Message*:\n\t${err.message}\n`,
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function onApiError(err: Error, req: IRequest, res: IResponse, next: INextFunction) {
    const error = processError(err);

    const isInternal = error.status === httpStatus.INTERNAL_SERVER_ERROR;
    if (isInternal) {
        logError(err, req);
    }

    await sendResponse(res, error.status, { errors: error.errors });
}

export function onApiNotFound(req: IRequest, res: IResponse, next: INextFunction) {
    const err = new NotFoundError();
    return onApiError(err, req, res, next);
}
