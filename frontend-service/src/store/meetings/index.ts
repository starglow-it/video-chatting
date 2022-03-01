import { root } from '../root';

import sendRequestWithCredentials from '../../helpers/http/sendRequestWithCredentials';

import { createMeetingUrl } from '../../utils/urls/resolveUrl';

import { Template, MeetingStore, ErrorState, HttpMethods, MeetingInstance } from '../types';

export const meetingsDomain = root.createDomain('meetingsDomain');

export const $meetingsStore = meetingsDomain.store<MeetingStore>({});

export const createMeetingFx = meetingsDomain.effect<
    { templateId: Template['id'] },
    { meeting?: MeetingInstance }
>('createMeetingFx');

createMeetingFx.use(async data => {
    const response = await sendRequestWithCredentials<any, ErrorState>(createMeetingUrl, {
        method: HttpMethods.Post,
        data: {
            templateId: data.templateId,
        },
    });

    if (response.success) {
        return {
            meeting: response.result,
        };
    } else {
        return {
            error: response.error,
        };
    }
});

$meetingsStore.on(createMeetingFx.doneData, (state, data) => {
    return {
        ...state,
        currentMeeting: data.meeting,
    };
});
