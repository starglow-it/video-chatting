import { setRoomsStatisticsEvent } from '../../../../store';

export const handleGetMeetingStatistics = (data) => {
    setRoomsStatisticsEvent(data);
};