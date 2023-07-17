import { KickUserReasons } from 'shared-types';

import { logoutUserFx } from '../..';
import { sendEndMeetingSocketEvent } from '../../roomStores';

export const handleKickDeletedUser = async ({
    reason,
}: {
    reason: KickUserReasons;
}) => {
    if (KickUserReasons.Blocked === reason) {
        logoutUserFx();
    } else if (KickUserReasons.Deleted === reason) {
        await sendEndMeetingSocketEvent({ reason });
        logoutUserFx();
    }
};
