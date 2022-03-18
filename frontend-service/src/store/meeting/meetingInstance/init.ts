import {
    $meetingInstanceStore,
    fetchMeetingInstanceFx,
    resetMeetingInstanceStore,
} from './model';

import {handleFetchMeetingInstance} from "./handlers/handleFetchMeetingInstance";

fetchMeetingInstanceFx.use(handleFetchMeetingInstance);

$meetingInstanceStore
    .on(fetchMeetingInstanceFx.doneData, (state, { meeting }) => meeting)
    .reset(resetMeetingInstanceStore);
