import Router from 'next/router';

import {
    $localUserStore,
    leaveMeetingEvent,
    resetLocalUserStore,
    setLocalUserMediaEvent,
    updateLocalUserEvent,
} from './model';

$localUserStore
    .on(updateLocalUserEvent, (state,  user) => ({
        ...state,
        ...user,
        username: user.username || state.username
    }))
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
