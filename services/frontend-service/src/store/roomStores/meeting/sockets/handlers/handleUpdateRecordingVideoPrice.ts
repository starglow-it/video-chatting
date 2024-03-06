import { UpdateRecordingVideoPriceResponse } from '../types';
import { updateRecordingVideoPriceEvent } from '../../meeting/model';

export const handleUpdateRecordingVideoPrice = (data: UpdateRecordingVideoPriceResponse) => {
    const { video } = data;
    if (!!video) {
        updateRecordingVideoPriceEvent(video);
    }
};
