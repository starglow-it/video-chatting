import { resetRoomStores } from 'src/store/root';
import {
    $meetingYoutubeStore,
    toggleMuteYoutubeEvent,
    updateUrlYoutubeEvent,
    updateVolumeYoutubeEvent,
} from './model';

$meetingYoutubeStore
    .on(updateVolumeYoutubeEvent, (state, volume) => ({
        ...state,
        volume,
    }))
    .on(updateUrlYoutubeEvent, (state, url) => ({ ...state, url }))
    .on(toggleMuteYoutubeEvent, state => ({ ...state, muted: !state.muted }))
    .reset(resetRoomStores);
