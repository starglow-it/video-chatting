import { $isSideUsersOpenStore, setIsSideUsersOpenEvent } from './model';

$isSideUsersOpenStore.on(setIsSideUsersOpenEvent, (state, data) => data);
