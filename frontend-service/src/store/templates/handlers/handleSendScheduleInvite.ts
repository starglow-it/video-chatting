import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import { ErrorState } from "../../types";
import { sendScheduleInviteUrl } from "../../../utils/urls";

export const handleSendScheduleInvite = async (data: { templateId: string; timeZone: string; comment: string; startAt: number; endAt: number; }): Promise<string | undefined> => {
    const response = await sendRequestWithCredentials<{ icsLink: string }, ErrorState>({
        ...sendScheduleInviteUrl,
        data
    });

    if (response.success) {
        return response.result.icsLink;
    }

    return;
}