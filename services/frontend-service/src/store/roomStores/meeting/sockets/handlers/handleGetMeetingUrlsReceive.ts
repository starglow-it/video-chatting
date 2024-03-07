import { setRecordingUrlsEvent } from '../../../../../store/roomStores';
import { MeetingRecordVideo } from '../../../../../store/types';

export const handleGetMeetingUrlsReceive = ({ videos }: {videos: MeetingRecordVideo[]}) => {
    setRecordingUrlsEvent(videos);
};
