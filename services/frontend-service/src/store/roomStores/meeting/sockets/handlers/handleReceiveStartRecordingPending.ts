import { setStartRecordingPendingEvent } from '../../../../../store/roomStores';

export const handleReceiveStartRecordingPending = () => {
    setStartRecordingPendingEvent();
};
