import { $usersStore, getUsersListFx } from './model';
import { handleGetUsersList } from './handlers/handleGetUsersList';

getUsersListFx.use(handleGetUsersList);

$usersStore.on(getUsersListFx.doneData, (state, data) => data);
