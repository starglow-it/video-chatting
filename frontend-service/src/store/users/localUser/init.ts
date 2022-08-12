import Router from 'next/router';

import {
    $localUserStore,
    leaveMeetingEvent,
    resetLocalUserStore,
    setLocalUserMediaEvent,
    updateLocalUserEvent,
} from './model';
import { appDialogsApi } from '../../dialogs/init';
import { AppDialogsEnum } from '../../types';

$localUserStore
    .on(updateLocalUserEvent, (state, user) => ({
        ...state,
        ...user,
        username: user.username || state.username,
    }))
    .on(setLocalUserMediaEvent, (state, data) => ({
        ...state,
        videoTrack: data.videoTrack,
        audioTrack: data.audioTrack,
    }))
    .on(leaveMeetingEvent, (state, data) => {
        Router.push(state.isGenerated ? '/welcome' : '/dashboard').then(() => {
            if (data?.reason === 'expired') {
                appDialogsApi.openDialog({ dialogKey: AppDialogsEnum.timeExpiredDialog });
            }
        });

        return state;
    })
    .reset(resetLocalUserStore);
