import {sample} from "effector";

import {
    $blockUserIdStore,
    $deleteUserIdStore,
    $userProfileIdStore,
    $userProfileStatisticStore,
    $userProfileStore,
    $userProfileTemplateStore,
    $usersStore,
    blockUserFx,
    deleteUserFx,
    getUserProfileFx,
    getUserProfileStatisticFx,
    getUserProfileTemplateFx,
    getUsersListFx,
    searchUsersFx,
    setBlockUserId,
    setDeleteUserId,
    setUserProfileIdEvent,
} from './model';
import {addNotificationEvent} from "../notifications/model";

// handlers
import {handleGetUsersList} from './handlers/handleGetUsersList';
import {handleGetUserProfile} from './handlers/handleGetUserProfile';
import {handleGetUserProfileStatistic} from './handlers/handleGetUserProfileStatistic';
import {handleGetUserProfileTemplate} from './handlers/handleGetUserProfileTemplate';
import {handleSearchUsersList} from './handlers/handleSearchUsersList';
import {handleBlockUser} from './handlers/handleBlockUser';
import {handleDeleteUser} from './handlers/handleDeleteUser';

// types
import {NotificationType} from "../types";

getUsersListFx.use(handleGetUsersList);
getUserProfileFx.use(handleGetUserProfile);
getUserProfileStatisticFx.use(handleGetUserProfileStatistic);
getUserProfileTemplateFx.use(handleGetUserProfileTemplate);
searchUsersFx.use(handleSearchUsersList);
blockUserFx.use(handleBlockUser);
deleteUserFx.use(handleDeleteUser);

$usersStore
    .on(blockUserFx.doneData, (state, data) => ({
        ...state,
        state: {
            ...state.state,
            list: state.state.list.map(user => user.id === data?.id ? data : user),
        },
    }))
    .on(deleteUserFx.done, (state, { params }) => ({
        ...state,
        state: {
            count: state.state.count - 1,
            list: state.state.list.filter(user => user.id !== params.userId),
        },
    }))
    .on([getUsersListFx.doneData, searchUsersFx.doneData], (state, data) => data);

$userProfileIdStore.on(setUserProfileIdEvent, (state, data) => ({
    state: data,
    error: null,
}));

$userProfileStore.on(getUserProfileFx.doneData, (state, data) => data);
$userProfileStatisticStore.on(getUserProfileStatisticFx.doneData, (state, data) => data);
$userProfileTemplateStore.on(getUserProfileTemplateFx.doneData, (state, data) => data);

$blockUserIdStore.on(setBlockUserId, (state, data) => ({
    state: data,
    error: null,
}));

$deleteUserIdStore.on(setDeleteUserId, (state, data) => ({
    state: data,
    error: null,
}));

sample({
    clock: blockUserFx.done,
    source: $usersStore,
    fn: (source, { result }) => ({
        type: result?.isBlocked ? NotificationType.userBlocked : NotificationType.userUnBlocked,
        message: result?.isBlocked ? "users.userBlocked" : "users.userUnBlocked",
        messageOptions: {
            username: result?.fullName ?? result?.email,
        },
        iconType: "LockIcon",
    }),
    target: addNotificationEvent
})


sample({
    clock: deleteUserFx.done,
    source: $usersStore,
    fn: (users, { params }) => {
        const user = users.find(user => user.id === params.userId);

        return {
            type: NotificationType.userDeleted,
            message: "users.userDeleted",
            messageOptions: {
                username: user?.fullName ?? user?.email,
            },
            iconType: "DeleteIcon",
        }
    },
    target: addNotificationEvent
});

sample({
    clock: [blockUserFx, deleteUserFx.done],
    fn: () => "",
    target: setUserProfileIdEvent
});