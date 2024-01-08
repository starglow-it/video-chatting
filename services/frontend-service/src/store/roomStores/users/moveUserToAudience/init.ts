import { $moveUserToAudience, setMoveUserToAudienceEvent } from './model';
import { resetRoomStores } from '../../../root';

$moveUserToAudience
    .on(setMoveUserToAudienceEvent, (state, data) => data)
    .reset([resetRoomStores]);
