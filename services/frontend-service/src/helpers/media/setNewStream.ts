import { CustomMediaStream } from '../../types';
import { stopStream } from './stopStream';

export const setNewStream = (
    state: CustomMediaStream,
    data: CustomMediaStream,
) => {
    stopStream(state);
    console.log('setActiveStream',data);
    return data;
};
