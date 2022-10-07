import { CustomMediaStream } from '../../types';
import { stopStream } from './stopStream';

export const clearStreamStore = (state: CustomMediaStream) => {
    stopStream(state);
    return null;
};
