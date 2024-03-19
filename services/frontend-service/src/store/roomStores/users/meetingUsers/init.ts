import { sample } from 'effector-next';

import {
    $isToggleSchedulePanel,
    $isToggleUsersPanel,
    $meetingUsersStore,
    $isRecordingUrlsListPanel,
    $isTogglProfilePanel,
    $isToggleEditRuumePanel,
    $isToggleNoteEmojiListPanel,
    isToggleEditRuumeSelectMenuOpenStore,
    toggleEditRuumeSelectMenu,
    removeMeetingUsersEvent,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
    updateMeetingUserEvent,
    updateMeetingUsersEvent,
    toggleRecordingUrlsListPanel,
    toggleProfilePanelEvent,
    toggleEditRuumeSettingEvent,
    toggleNoteEmojiListPanelEvent,
    $isToggleEditRuumeSelectMenuOpenStore
} from './model';
import { $localUserStore, updateLocalUserEvent } from '../localUser/model';
import { resetRoomStores } from '../../../root';

$meetingUsersStore
    .on(updateMeetingUsersEvent, (state, { users }) => {
        if (users?.length) {
            const newUsers = (users || []).map(newUser => {
                const oldUserData = state.find(
                    oldUser => oldUser.id === newUser.id,
                );
                if (oldUserData) {
                    return {
                        ...oldUserData,
                        ...newUser,
                    };
                }
                return newUser;
            });

            const oldUsers = state.filter(
                _user =>
                    !newUsers.find(user => user.id === _user.id) &&
                    users?.find(_newUser => _newUser.id === _user.id),
            );

            return [...oldUsers, ...newUsers];
        }

        return [];
    })
    .on(updateMeetingUserEvent, (state, { user }) =>
        state.map(_user =>
            _user.id === user?.id ? { ..._user, ...user } : _user,
        ),
    )
    .on(removeMeetingUsersEvent, (state, { users }) =>
        !users ? state : state.filter(_user => !users?.includes(_user.id)),
    )
    .reset(resetRoomStores);

$isToggleEditRuumeSelectMenuOpenStore.on(toggleEditRuumeSelectMenu, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);

$isTogglProfilePanel.on(toggleProfilePanelEvent, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);

$isToggleEditRuumePanel.on(toggleEditRuumeSettingEvent, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);

$isToggleUsersPanel.on(toggleUsersPanelEvent, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);
$isToggleNoteEmojiListPanel.on(toggleNoteEmojiListPanelEvent, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);

$isToggleSchedulePanel.on(toggleSchedulePanelEvent, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);

$isRecordingUrlsListPanel.on(toggleRecordingUrlsListPanel, (toggle, newToggle) =>
    newToggle !== undefined ? newToggle : !toggle,
);

sample({
    clock: $meetingUsersStore,
    source: $localUserStore,
    fn: (localUser, users) => {
        const targetUser = users.find(user => user.id === localUser.id);

        return targetUser || localUser;
    },
    target: updateLocalUserEvent,
});
