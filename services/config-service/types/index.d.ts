import { ClientSession } from 'mongoose';

export interface IDataValidatorError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

interface IServiceOptions {
    session?: ClientSession;
}
