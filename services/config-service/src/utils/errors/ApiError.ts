import { IDataValidatorError } from '../../../types';

export class ApiError extends Error {
    status: number;

    errors: IDataValidatorError[];

    constructor(status: number, errors: IDataValidatorError[]) {
        super();

        this.status = status;
        this.errors = errors;
    }
}
