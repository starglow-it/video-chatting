import {updateMeetingUserEvent} from "../../users/meetingUsers/model";
import {MeetingUser} from "../../types";

export const handleMeetingEnterRequest = (data: { user: MeetingUser }) => {
    updateMeetingUserEvent({ user: data.user });
}