import {
    $meetingTemplateStore,
    initialTemplateState,
    getUserTemplateBaseEffect,
    updateMeetingTemplateBaseEffect,
} from './model';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { ErrorState, HttpMethods, Template } from '../../types';
import { updateUserTemplateUrl, getUserTemplateUrl } from '../../../utils/urls/resolveUrl';

getUserTemplateBaseEffect.use(async ({ templateId, userId }): Promise<Template> => {
    const response = await sendRequest<Template, ErrorState>(
        getUserTemplateUrl({ templateId, userId }),
    );

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
});

updateMeetingTemplateBaseEffect.use(async ({ templateId, userId, data }): Promise<Template> => {
    const response = await sendRequest<Template, ErrorState>(
        updateUserTemplateUrl({ templateId, userId }),
        {
            method: HttpMethods.Post,
            data,
        },
    );

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
});

$meetingTemplateStore
    .on(getUserTemplateBaseEffect.doneData, (state, data) => data)
    .on(updateMeetingTemplateBaseEffect.doneData, (state, data) => data);
