import {sendRequest} from "../../../../helpers/http/sendRequest";
import {ErrorState, MeetingInstance} from "../../../types";
import {getMeetingUrl} from "../../../../utils/urls";
import {initialMeetingInstanceState} from "../model";

export const handleFetchMeetingInstance = async ({ meetingId }: { meetingId: MeetingInstance['id'] }) => {
    const response = await sendRequest<MeetingInstance, ErrorState>(getMeetingUrl(meetingId));

    if (response.success) {
        return {
            meeting: response.result,
        };
    } else {
        return {
            meeting: initialMeetingInstanceState,
        };
    }
}