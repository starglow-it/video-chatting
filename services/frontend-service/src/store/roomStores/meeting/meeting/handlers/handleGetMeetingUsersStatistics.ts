import {
    sendGetMeetingUsersStatisticsSocketEvent
} from '../../sockets/init';
import { GetMeetingUsersStatisticsPayload } from '../types';

export const handleGetMeetingUsers = async ({
    meetingId,
    userId
}: GetMeetingUsersStatisticsPayload): Promise<void> => {
    await sendGetMeetingUsersStatisticsSocketEvent({
        meetingId,
        userId
    });
};
