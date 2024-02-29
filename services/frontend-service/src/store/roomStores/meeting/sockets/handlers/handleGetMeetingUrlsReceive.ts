import { setRecordingUrlsEvent } from '../../../../../store/roomStores';

export const handleGetMeetingUrlsReceive = ({ user, urls }: { user: string, urls: string[] }) => {
    setRecordingUrlsEvent(urls);
};
