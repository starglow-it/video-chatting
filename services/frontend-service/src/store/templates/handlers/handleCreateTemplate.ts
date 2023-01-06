import { ErrorState, ICommonTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { CreateTemplateResponse } from '../types';
import {templatesApiMethods} from "../../../utils/urls";

export const handleCreateTemplate = async (): Promise<CreateTemplateResponse> => {
    const createTemplateUrl = templatesApiMethods.createTemplateUrl();

    const response = await sendRequestWithCredentials<ICommonTemplate, ErrorState>({
        ...createTemplateUrl,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
