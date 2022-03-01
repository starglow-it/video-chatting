import {
    $meetingInstanceStore,
    fetchMeetingInstanceFx,
    initialMeetingInstanceState,
    resetMeetingInstanceStore,
} from './model';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { getMeetingUrl } from '../../../utils/urls/resolveUrl';

import { MeetingInstance } from '../../types';

fetchMeetingInstanceFx.use(async ({ meetingId }) => {
    const response = await sendRequest<MeetingInstance, any>(getMeetingUrl(meetingId));

    if (response.success) {
        return {
            meeting: response.result,
        };
    } else {
        return {
            meeting: initialMeetingInstanceState,
        };
    }
});

$meetingInstanceStore
    .on(fetchMeetingInstanceFx.doneData, (state, { meeting }) => meeting)
    .reset(resetMeetingInstanceStore);
