import { usersSocketEventsController } from '../init';

import {
    $localUserStore,
    resetLocalUserStore,
    setLocalUserEvent,
    setLocalUserMediaEvent,
    updateLocalUserEvent,
    updateLocalUserStateEvent,
} from './model';
import { MeetingAccessStatuses, SocketState } from '../../types';

$localUserStore
    .on(setLocalUserEvent, (state, { user }) => ({ ...state, ...user }))
    .on(updateLocalUserEvent, (state, { user }) => ({ ...state, ...user }))
    .on(updateLocalUserStateEvent, (state, data) => ({ ...state, ...data }))
    .on(setLocalUserMediaEvent, (state, data) => ({
        ...state,
        videoTrack: data.videoTrack,
        audioTrack: data.audioTrack,
    }))
    .reset(resetLocalUserStore);

usersSocketEventsController.watch(({ socketInstance }: SocketState) => {
    socketInstance?.on('user:update', (data: any) => updateLocalUserEvent(data));

    socketInstance?.on('users:kick', () => {
        updateLocalUserStateEvent({ accessStatus: MeetingAccessStatuses.Kicked });
    });
});
