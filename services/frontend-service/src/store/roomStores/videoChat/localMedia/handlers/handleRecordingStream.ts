import { recordMeetingResponse } from 'src/types';
import axios from 'axios';
import { mediaServerUrl } from '../../../../../const/urls/common';
import { addNotificationEvent } from '../../../../../store';
import {
    requestRecordingAcceptEvent,
    saveRecordingUrl,
    isRequestRecordingStartEvent,
    setIsMeetingRecording,
    startRecording
} from '../../../../../store/roomStores';
import { NotificationType } from '../../../../../store/types';
import { StopRecordingPayload } from '../../types';

const startRecordingUrl: string = `${mediaServerUrl}/start-recording`;
const stopRecordingUrl: string = `${mediaServerUrl}/stop-recording`;

function removeQueryString(url: string): string {
    const queryStringIndex = url.indexOf('?');
    if (queryStringIndex !== -1) {
        return url.substring(0, queryStringIndex);
    }
    return url;
}

export const handleStartRecordingStream = async ({ url, byRequest = false, meetingId = '' }: { url: string, byRequest?: boolean, meetingId?: string }): Promise<recordMeetingResponse> => {
    try {
        url='https://stg-my.chatruume.com/room/661858a521248612bc0ddd4e'
        if (url) {
            url = removeQueryString(url);
            const result = await axios.post(startRecordingUrl, { roomUrl: `${url}?role=recorder` });

            if (result && result.data) {
                isRequestRecordingStartEvent();
                startRecording({ meetingId });

                return result.data;
            }
        }
    } catch (e) {
        addNotificationEvent({
            type: NotificationType.PaymentFail,
            message: 'recording.startRecordingFail',
            withErrorIcon: true,
        });
        console.error(e);
        throw e;
    }
    return null;
};
// Stopping the recording and returning the blob
export const handleStopRecordingStream = async ({ id, url, byRequest = false, meetingId = '' }: StopRecordingPayload): Promise<recordMeetingResponse> => {
    try {
        url='https://stg-my.chatruume.com/room/661858a521248612bc0ddd4e'
        if (url) {
            url = removeQueryString(url);
            const result = await axios.post(stopRecordingUrl, { roomUrl: `${url}?role=recorder` });

            if (result && result.data) {
                saveRecordingUrl({ id, meetingId, url: result.data.url });
                return result.data;
            }
        }
    } catch (e) {
        if (byRequest && meetingId) {
            saveRecordingUrl({ id, meetingId, url: '' });
        } else {
            setIsMeetingRecording({ meetingId, isMeetingRecording: false });
        }
        console.error(e);
        throw e;
    }
    return null;
};
