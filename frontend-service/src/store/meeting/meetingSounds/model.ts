import { meetingDomain } from "../domain";
import { MeetingSoundsEnum } from "../../types";

export const $meetingSoundType = meetingDomain.store<MeetingSoundsEnum>(MeetingSoundsEnum.NoSound);

export const setMeetingSoundType = meetingDomain.event<MeetingSoundsEnum>('setMeetingSoundType');