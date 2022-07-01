import {updateMeetingUsersEvent} from "../../users/meetingUsers/model";

export const handleUpdateUsers = (data: any) => {
    updateMeetingUsersEvent(data);
}