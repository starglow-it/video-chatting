import {root} from "../root";
import {MeetingInstance, MeetingStore, Template} from "../types";

export const meetingsDomain = root.createDomain('meetingsDomain');

export const $meetingsStore = meetingsDomain.store<MeetingStore>({});

export const createMeetingFx = meetingsDomain.effect<
    { templateId: Template['id'] },
    { meeting?: MeetingInstance }
    >('createMeetingFx');

export const deleteMeetingFx = meetingsDomain.effect<
    { templateId: Template['id'] },
    void
    >('deleteMeetingFx');