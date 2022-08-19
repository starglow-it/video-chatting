import { sample } from 'effector-next';

import { AUDIO_MUTE, VIDEO_MUTE } from '../../../const/media/agora/UPDATE_INFO_TYPES';
import {
    $meetingUsersStore,
    removeMeetingUsersEvent,
    resetMeetingUsersStore,
    setMeetingUserMediaEvent,
    updateMeetingUserEvent,
    updateMeetingUsersEvent,
    updateUserTracksEvent,
} from './model';
import { $localUserStore, updateLocalUserEvent } from '../localUser/model';

$meetingUsersStore
    .on(updateMeetingUsersEvent, (state, { users }) => {
        if (users?.length) {
            const newUsers = (users || []).map(newUser => {
                const oldUserData = state.find(oldUser => oldUser.id === newUser.id);
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

        return state;
    })
    .on(updateMeetingUserEvent, (state, { user }) =>
        state.map(_user => (_user.id === user?.id ? { ..._user, ...user } : _user)),
    )
    .on(removeMeetingUsersEvent, (state, { users }) =>
        !users ? state : state.filter(_user => !users?.includes(_user.id)),
    )
    .on(setMeetingUserMediaEvent, (state, user) =>
        state.map(_user =>
            _user.meetingUserId === user.uid
                ? { ..._user, audioTrack: user.audioTrack, videoTrack: user.videoTrack }
                : _user,
        ),
    )
    .on(updateUserTracksEvent, (state, data) =>
        state.map(user => {
            const isTargetUser = user.meetingUserId === data.userUid;

            if (isTargetUser) {
                const videoStatus = data.infoType === VIDEO_MUTE ? 'inactive' : 'active';

                const audioStatus = data.infoType === AUDIO_MUTE ? 'inactive' : 'active';

                return {
                    ...user,
                    cameraStatus: data.infoType.includes('video') ? videoStatus : user.cameraStatus,
                    micStatus: data.infoType.includes('audio') ? audioStatus : user.micStatus,
                };
            }
            return user;
        }),
    )
    .reset(resetMeetingUsersStore);

sample({
    clock: $meetingUsersStore,
    source: $localUserStore,
    fn: (localUser, users) => {
        const targetUser = users.find(user => user.id === localUser.id);

        return targetUser || localUser;
    },
    target: updateLocalUserEvent,
});
