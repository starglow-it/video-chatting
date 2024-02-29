import { recordMeetingResponse } from 'src/types';
import axios from 'axios';
import { mediaServerUrl } from '../../../../../const/urls/common';
import { addNotificationEvent } from '../../../../../store';
import {
    requestRecordingAcceptEvent,
    saveRecordingUrl,
    isRequestRecordingStartEvent,
    setIsMeetingRecording
} from '../../../../../store/roomStores';
import { NotificationType } from '../../../../../store/types';

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
        url = 'https://stg-my.chatruume.com/room/hot-room'
        if (url) {
            url = removeQueryString(url);
            const result = await axios.post(startRecordingUrl, { roomUrl: `${url}?role=recorder` });

            if (result && result.data) {
                if (byRequest && meetingId) {
                    requestRecordingAcceptEvent({ meetingId, recordingUrl: `${url}?role=recorder` });
                    isRequestRecordingStartEvent();
                } else {
                    setIsMeetingRecording({ meetingId, isMeetingRecording: true, recordingUrl: `${url}?role=recorder` });
                }
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
export const handleStopRecordingStream = async ({ url, byRequest = false, meetingId = '' }: { url: string, byRequest?: boolean, meetingId?: string }): Promise<recordMeetingResponse> => {
    try {
        url = 'https://stg-my.chatruume.com/room/hot-room'
        if (url) {
            url = removeQueryString(url);
            const result = await axios.post(stopRecordingUrl, { roomUrl: `${url}?role=recorder` });

            if (result && result.data) {
                if (byRequest && meetingId) {
                    saveRecordingUrl({ meetingId, url: result.data.url });
                } else {
                    setIsMeetingRecording({ meetingId, isMeetingRecording: false });
                }
                return result.data;
            }
        }
    } catch (e) {
        if (byRequest && meetingId) {
            saveRecordingUrl({ meetingId, url: '' });
        } else {
            setIsMeetingRecording({ meetingId, isMeetingRecording: false });
        }
        console.error(e);
        throw e;
    }
    return null;
};
