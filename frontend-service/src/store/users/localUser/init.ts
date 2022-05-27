import { usersSocketEventsController } from '../init';
import Router from 'next/router';

import {
    $localUserStore, leaveMeetingEvent,
    resetLocalUserStore,
    setLocalUserEvent,
    setLocalUserMediaEvent,
    updateLocalUserEvent,
    updateLocalUserStateEvent,
} from './model';
import { MeetingAccessStatuses, SocketState } from '../../types';
import {ON_MEETING_FINISHED} from "../../meeting/const/subscribeSocketEvents";

$localUserStore
    .on(setLocalUserEvent, (state, { user }) => ({ ...state, ...user }))
    .on(updateLocalUserEvent, (state, { user }) => ({ ...state, ...user }))
    .on(updateLocalUserStateEvent, (state, data) => ({ ...state, ...data }))
    .on(setLocalUserMediaEvent, (state, data) => ({
        ...state,
        videoTrack: data.videoTrack,
        audioTrack: data.audioTrack,
    }))
    .on(leaveMeetingEvent, (state) => {
        Router.push(state.isGenerated ? '/welcome' : '/dashboard');

        return state;
    })
    .reset(resetLocalUserStore);

usersSocketEventsController.watch(({ socketInstance }: SocketState) => {
    socketInstance?.on('user:update', (data: any) => updateLocalUserEvent(data));

    socketInstance?.on('users:kick', () => {
        updateLocalUserStateEvent({ accessStatus: MeetingAccessStatuses.Kicked });
    });

    socketInstance?.on(ON_MEETING_FINISHED, () => {
        leaveMeetingEvent();
    });
});
