import {updateLocalUserEvent} from "../../users/localUser/model";
import {MeetingAccessStatuses} from "../../types";

export const handleKickUser = () => {
    updateLocalUserEvent({ accessStatus: MeetingAccessStatuses.Kicked });
}