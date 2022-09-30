import { IDataValidatorError } from '../../../../types';
import { IResponse } from '../../../../types/express';

export interface IApiResponse {
    result?: {
        [key: string]: any;
    };
    errors?: IDataValidatorError[];
}

export const sendResponse = async (
    res: IResponse,
    status: number,
    { result = {}, errors = [] }: IApiResponse = {},
): Promise<void> => {
    const response = {
        success: result,
        errors,
    };

    res.status(status).json(response);
};
