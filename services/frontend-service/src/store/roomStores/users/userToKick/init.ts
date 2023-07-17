import { $userToKick, setUserToKickEvent } from './model';
import { resetRoomStores } from '../../../root';

$userToKick
    .on(setUserToKickEvent, (state, data) => data)
    .reset([resetRoomStores]);
