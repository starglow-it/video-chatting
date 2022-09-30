import { CustomMediaStream } from '../../../../types';
import { stopStream } from '../../../../helpers/media/stopStream';

export const setNewStream = (state: CustomMediaStream, data: CustomMediaStream) => {
    stopStream(state);
    return data;
};
