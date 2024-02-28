import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { resetMeetingRecordingStoreExceptVideosEvent } from '../../../../roomStores';

export const handleErrorWhileStopRecording = () => {
    console.log('errrrrprorororor++=');
    addNotificationEvent({
        type: NotificationType.RequestRecordingMeeting,
        message: "recording.stopRecordingFail",
        withErrorIcon: true
    });
    resetMeetingRecordingStoreExceptVideosEvent();
};
