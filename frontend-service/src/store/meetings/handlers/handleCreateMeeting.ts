import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import {ErrorState, Template} from "../../types";
import { createMeetingUrl } from "../../../utils/urls";

export const handleCreateMeeting = async (data: { templateId: Template['id'] }) => {
    const response = await sendRequestWithCredentials<any, ErrorState>({
        ...createMeetingUrl,
        data: {
            templateId: data.templateId,
        },
    });

    if (response.success) {
        return {
            meeting: response.result,
        };
    } else {
        return {
            error: response.error,
        };
    }
}