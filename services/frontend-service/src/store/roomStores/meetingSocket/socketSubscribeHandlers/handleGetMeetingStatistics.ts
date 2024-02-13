import { setRoomsStatisticsEvent, setRoomStatisticsLoadingEvent } from '../../../../store';

export const handleGetMeetingStatistics = (data: any) => {
    if (data) {
        setRoomsStatisticsEvent(data);
    }
    setRoomStatisticsLoadingEvent(false);
};