import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { sendScheduleInviteUrl } from '../../../utils/urls';
import { ParsedTimeStamp } from '../../../types';

export const handleSendScheduleInvite = async (data: {
    templateId: string;
    timeZone: string;
    comment: string;
    startAt: ParsedTimeStamp;
    endAt: ParsedTimeStamp;
}): Promise<string | undefined> => {
    const response = await sendRequestWithCredentials<{ icsLink: string }, ErrorState>({
        ...sendScheduleInviteUrl,
        data,
    });

    if (response.success) {
        return response.result.icsLink;
    }
};
