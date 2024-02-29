import { setUrlForCopyEvent } from '../../../../../store/roomStores';

export const handleGetUrlByAttendee = ({ url }: { url: string }) => {
    setUrlForCopyEvent(url);
};
