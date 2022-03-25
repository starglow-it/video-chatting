import {root} from "../root";
import { FailedResult, HttpMethods, SuccessResult } from "../types";
import sendRequestWithCredentials from "../../helpers/http/sendRequestWithCredentials";
import {sendRequest} from "../../helpers/http/sendRequest";

const apiClientDomain = root.createDomain('apiClientDomain');

export const apiClientRequest = apiClientDomain.effect<
    { url: string; method: HttpMethods; data: unknown;  },
    SuccessResult<any>,
    FailedResult<any>
    >({
        name: 'apiClientRequest',
        handler: async ({ url, method, withCredentials, data }) => {
            console.log('url, method, withCredentials');
            console.log(url, method, withCredentials);
            console.log('data', data);

            if (withCredentials) {
                const response = sendRequestWithCredentials();
            } else {
                const response = sendRequest();
            }
            return {
                result: '',
                success: true,
            };
        }
    });