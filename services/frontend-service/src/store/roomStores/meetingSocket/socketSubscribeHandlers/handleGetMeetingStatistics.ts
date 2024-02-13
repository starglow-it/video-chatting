import { setRoomsStatisticsEvent, setRoomStatisticsLoadingEvent } from '../../../../store';

export const handleGetMeetingStatistics = (data) => {
    setRoomsStatisticsEvent(data);
    setRoomStatisticsLoadingEvent(false);
};