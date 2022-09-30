import { CustomMediaStream } from '../../../../types';
import { stopStream } from '../../../../helpers/media/stopStream';

export const clearStreamStore = (state: CustomMediaStream) => {
    stopStream(state);
    return null;
};
