import { IMediaCategory } from 'shared-types';
import { IMediaItem } from '../meetingBackground/types';

export interface IAudioCategory extends IMediaCategory {
    audio: IMediaItem;
}
