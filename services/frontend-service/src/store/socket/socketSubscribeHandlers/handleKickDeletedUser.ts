import { KickUserReasons } from 'shared-types';

import { logoutUserFx } from 'src/store/auth/model';
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
