import {MeetingUser} from "../../types";
import {updateLocalUserEvent} from "../../users/localUser/model";

export const handleUpdateUser = (data: { user: MeetingUser }) => updateLocalUserEvent(data.user);