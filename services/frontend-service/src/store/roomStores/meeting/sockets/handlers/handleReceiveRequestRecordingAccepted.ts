import { RecodingAnswerResponse } from '../types';

export const handleReceiveRequestRecordingAccepted = ({
    isRecordingStart
}: RecodingAnswerResponse) => {
    // addNotificationEvent({
    //     type: NotificationType.RequestRecordingMeeting,
    //     // message: `meeting.deviceErrors.${audioError?.type}`,
    //     message: `${message}`,
    // });
    console.log(isRecordingStart);
};
