import { resetRoomStores } from 'src/store/root';
import { $roleQueryUrlStore, setRoleQueryUrlEvent } from './model';

$roleQueryUrlStore
    .on(setRoleQueryUrlEvent, data => data)
    .reset(resetRoomStores);
