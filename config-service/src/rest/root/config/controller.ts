import * as httpStatus from 'http-status';

import { sendResponse } from '../../../utils/rest/http/sendResponse';
import { wrapAsyncMiddleware } from '../../../utils/rest/middlewares/wrapAsyncMiddleware';
import {envConfig} from "../../../config/vars";

export const getConfigKey = wrapAsyncMiddleware(async (req, res) => {
    return sendResponse(res, httpStatus.OK, { result: envConfig[req.params.key] });
});

export const getAllConfigKeys = wrapAsyncMiddleware(async (req, res) => {
    return sendResponse(res, httpStatus.OK, { result: envConfig });
});


