import { recordMeetingResponse } from 'src/types';
import axios from 'axios';
import { mediaServerUrl } from '../../../../../const/urls/common';

const startRecordingUrl: string = `${mediaServerUrl}/start-recording`;
const stopRecordingUrl: string = `${mediaServerUrl}/stop-recording`;

export const handleStartRecordingStream = async (url: string): Promise<recordMeetingResponse> => {
    try {
        if (url) {
            const result = await axios.post(startRecordingUrl, { roomUrl: `${url}?role=recorder` });

            if (result && result.data) {
                return result.data;
            }
        }
    } catch (e) {
        console.error(e);
    }
    return null;
};
// Stopping the recording and returning the blob
export const handleStopRecordingStream = async (url: string): Promise<recordMeetingResponse> => {
    try {
        if (url) {
            const result = await axios.post(stopRecordingUrl, { roomUrl: `${url}?role=recorder` });

            if (result && result.data) {
                return result.data;
            }
        }
    } catch (e) {
        console.error(e);
    }
    return null;
};
