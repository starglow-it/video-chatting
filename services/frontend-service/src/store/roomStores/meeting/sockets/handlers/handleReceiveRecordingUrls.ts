import { receiveRequestRecordingEvent } from '../../meeting/model';
import { ReceiveRecordingUrls } from '../types';

export const handleReceiveRecordingUrls = ({
    urls    
}: ReceiveRecordingUrls) => {
    receiveRequestRecordingEvent(urls);
};
