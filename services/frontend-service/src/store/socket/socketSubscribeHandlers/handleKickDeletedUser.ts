import {KickUserReasons} from "shared-types";

import { logoutUserFx } from "../../../store";
import { sendEndMeetingSocketEvent } from "../../roomStores";

export const handleKickDeletedUser = ({ reason }: { reason: KickUserReasons }) => {
    if (KickUserReasons.Blocked === reason) {
        logoutUserFx();
    } else if (KickUserReasons.Deleted === reason) {
        sendEndMeetingSocketEvent({ reason });
    }
}