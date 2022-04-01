import {attach} from "effector-next";

import {apiClientRequest} from "./model";
import {HttpMethods} from "../types";

export const createApiClientRequest = ({ url, method, withCredentials }: { url: string; method: HttpMethods; withCredentials: boolean }) =>
    attach({
        effect: apiClientRequest,
        mapParams: (data) => ({ url, method, withCredentials, data }),
    });

const sampleRequest = createApiClientRequest({
    url: '/api',
    method: HttpMethods.Get,
    withCredentials: false,
});

sampleRequest.use(async (data) => {
    return data;
});

sampleRequest({ key: 'asdasd' });