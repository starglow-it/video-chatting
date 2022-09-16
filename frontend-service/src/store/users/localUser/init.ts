import { split } from 'effector';
import Router from 'next/router';

import {
    $localUserStore,
    leaveMeetingAsGuest,
    leaveMeetingAsHost,
    resetLocalUserStore,
    setLocalUserMediaEvent,
    updateLocalUserEvent,
    leaveExpiredMeetingEvent,
    leaveMeetingEvent,
} from './model';
import { appDialogsApi } from '../../dialogs/init';
import { AppDialogsEnum } from '../../types';
import { clientRoutes } from '../../../const/client-routes';
import { $isMeetingHostStore } from '../../meeting/meeting/model';

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
    .on(leaveMeetingEvent, state => {
        Router.push(state.isGenerated ? clientRoutes.welcomeRoute : clientRoutes.dashboardRoute);

        return state;
    })
    .on(leaveMeetingAsHost, state => {
        Router.push(clientRoutes.dashboardRoute).then(() => {
            appDialogsApi.openDialog({ dialogKey: AppDialogsEnum.timeExpiredDialog });
        });

        return state;
    })
    .on(leaveMeetingAsGuest, state => {
        appDialogsApi.openDialog({ dialogKey: AppDialogsEnum.hostTimeExpiredDialog });

        return state;
    })
    .reset(resetLocalUserStore);

split({
    clock: leaveExpiredMeetingEvent,
    source: $isMeetingHostStore,
    match: {
        host: isHost => isHost,
        user: isHost => !isHost,
    },
    cases: {
        host: leaveMeetingAsHost,
        user: leaveMeetingAsGuest,
    },
});
