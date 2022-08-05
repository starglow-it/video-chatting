/* eslint-disable max-classes-per-file */
import * as httpStatus from 'http-status';

import { ApiError } from './ApiError';
import { CommonErrors } from '../../const/errors/common';

export class NotFoundError extends ApiError {
    constructor() {
        super(httpStatus.NOT_FOUND, [CommonErrors.notFound]);
    }
}

export class UnauthorizedError extends ApiError {
    constructor() {
        super(httpStatus.UNAUTHORIZED, [CommonErrors.unauthorized]);
    }
}

export class ForbiddenError extends ApiError {
    constructor() {
        super(httpStatus.FORBIDDEN, [CommonErrors.forbidden]);
    }
}
