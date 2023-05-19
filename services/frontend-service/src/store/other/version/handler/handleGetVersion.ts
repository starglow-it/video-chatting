import { sendRequest } from 'src/helpers/http/sendRequest';
import { getVersionUrl } from 'src/utils/urls';
import { Version } from '../types';

export const handleGetVersion = async (): Promise<Version> => {
    const { success, result } = await sendRequest<Version, void>(getVersionUrl);

    if (success && result) {
        return result;
    }

    return {
        apiVersion: '',
        appVersion: '',
    };
};
