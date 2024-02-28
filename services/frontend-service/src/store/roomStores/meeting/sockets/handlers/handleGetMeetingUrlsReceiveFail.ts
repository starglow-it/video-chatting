import { stopRecordMeetingByOthers, isRequestRecordingEndEvent } from '../../../../../store/roomStores';
import { resetMeetingRecordingStore } from 'src/store/root';

export const handleGetMeetingUrlsReceiveFail = () => {
    isRequestRecordingEndEvent();
    stopRecordMeetingByOthers();
    resetMeetingRecordingStore();
};
