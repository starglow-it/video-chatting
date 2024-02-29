import { setRecordingUrlsEvent } from '../../../../../store/roomStores';

export const handleGetMeetingUrlsReceive = ({ videos }: { videos: { id: string, endTime: string }[] }) => {
    setRecordingUrlsEvent(videos);
};
