import * as httpStatus from 'http-status';
import { ApiError } from './ApiError';
import { IDataValidatorError } from '../../../types';

export class DataValidationError extends ApiError {
    constructor(errors: IDataValidatorError[]) {
        super(httpStatus.UNPROCESSABLE_ENTITY, errors);
    }
}
