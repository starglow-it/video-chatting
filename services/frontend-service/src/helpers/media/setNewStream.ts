import { CustomMediaStream } from '../../types';
import { stopStream } from './stopStream';

export const setNewStream = (state: CustomMediaStream, data: CustomMediaStream) => {
    stopStream(state);
    return data;
};
