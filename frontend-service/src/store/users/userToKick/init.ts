import { $userToKick, resetUserToKickEvent, setUserToKickEvent } from './model';

$userToKick.on(setUserToKickEvent, (state, data) => data);

$userToKick.reset(resetUserToKickEvent);
