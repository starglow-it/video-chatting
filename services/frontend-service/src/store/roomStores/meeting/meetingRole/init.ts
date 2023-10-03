import { resetRoomStores } from 'src/store/root';
import { $roleQueryUrlStore, setRoleQueryUrlEvent } from './model';

$roleQueryUrlStore
    .on(setRoleQueryUrlEvent, (_, data) => data)
    .reset(resetRoomStores);
