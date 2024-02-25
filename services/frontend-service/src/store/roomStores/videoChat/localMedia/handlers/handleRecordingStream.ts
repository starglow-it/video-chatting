import { recordMeetingResponse } from 'src/types';
import axios from 'axios';
import { mediaServerUrl } from '../../../../../const/urls/common';
import { addNotificationEvent } from '../../../../../store';
import { requestRecordingAcceptEvent, saveRecordingUrl, isRequestRecordingStartEvent } from '../../../../../store/roomStores';
import { NotificationType } from '../../../../../store/types';

const startRecordingUrl: string = `${mediaServerUrl}/start-recording`;
const stopRecordingUrl: string = `${mediaServerUrl}/stop-recording`;

export const handleStartRecordingStream = async (url: string, byRequest: boolean): Promise<recordMeetingResponse> => {
    try {
        if (url) {
            const result = await axios.post(startRecordingUrl, { roomUrl: `${url}?role=recorder` });

            if (result && result.data) {
                if (byRequest) {
                    requestRecordingAcceptEvent();
                    isRequestRecordingStartEvent();
                }
                return result.data;
            }
        }
    } catch (e) {
        console.error(e);
        addNotificationEvent({
            type: NotificationType.PaymentFail,
            message: 'recording.startRecordingFail',
            withErrorIcon: true,
        });
    }
    return null;
};
// Stopping the recording and returning the blob
export const handleStopRecordingStream = async (url: string, byRequest: boolean, meetingId: string): Promise<recordMeetingResponse> => {
    try {
        if (url) {
            const result = await axios.post(stopRecordingUrl, { roomUrl: `${url}?role=recorder` });

            if (result && result.data) {
                if (byRequest && meetingId) {
                    saveRecordingUrl({ meetingId,  url: result.data.url});
                }
                return result.data;
            }
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
    return null;
};
