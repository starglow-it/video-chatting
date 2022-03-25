import {sendRequest} from "../../../../helpers/http/sendRequest";
import {ErrorState, MeetingInstance} from "../../../types";
import {getMeetingUrl} from "../../../../utils/urls";
import {initialMeetingInstanceState} from "../model";

export const handleFetchMeetingInstance = async ({ templateId }: { templateId: MeetingInstance['template'] }) => {
    const response = await sendRequest<MeetingInstance, ErrorState>(getMeetingUrl(templateId));

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