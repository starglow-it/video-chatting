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
import { clientRoutes } from '../../../const/client-routes';

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
        Router.push(
            state.isGenerated ? clientRoutes.welcomeRoute : clientRoutes.dashboardRoute,
        ).then(() => {
            if (data?.reason === 'expired') {
                appDialogsApi.openDialog({ dialogKey: AppDialogsEnum.timeExpiredDialog });
            }
        });

        return state;
    })
    .reset(resetLocalUserStore);
