import { setStopRecordingPendingEvent } from '../../../../../store/roomStores';

export const handleReceiveStopRecordingPending = () => {
    setStopRecordingPendingEvent();
};
