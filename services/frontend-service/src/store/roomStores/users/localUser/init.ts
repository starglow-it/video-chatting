import { split } from 'effector';
import Router from 'next/router';

import {
    $localUserStore,
    $userLocationStore,
    $isPaywallPaymentEnabled,
    $preEventPaymentCodeStore,
    $preEventPaymentCodeCheckStore,
    $isNotifiedToHostForWaitingUserRequest,
    setIsPaywallPaymentEnabled,
    leaveDeletedUserMeetingEvent,
    leaveExpiredMeetingEvent,
    leaveMeetingAsGuest,
    leaveMeetingAsHost,
    leaveMeetingEvent,
    updateLocalUserEvent,
    setUserLocation,
    setPreEvenyPaymentCodeEvent,
    setPreEvenyPaymentCodeCheckEvent,
    setIsNotifiedToHostForWaitingUserRequest
} from './model';
import { appDialogsApi } from '../../../dialogs/init';
import { AppDialogsEnum } from '../../../types';
import { clientRoutes } from '../../../../const/client-routes';
import { updateMeetingUserEvent } from '../meetingUsers/model';
import { resetRoomStores } from '../../../root';
import { $isMeetingHostStore } from '../../meeting/meeting/model';

$userLocationStore.on(setUserLocation, (state, data) => ({ ...state, ...data }));

$preEventPaymentCodeStore.on(setPreEvenyPaymentCodeEvent, (state, data) => data);
$preEventPaymentCodeCheckStore.on(setPreEvenyPaymentCodeCheckEvent, (state, data) => data);

$localUserStore
    .on(updateMeetingUserEvent, (state, data) =>
        data.user.id === state.id ? { ...state, ...data.user } : state,
    )
    .on(updateLocalUserEvent, (state, user) => {
        
        const updateUser = {
            ...state,
            ...user,
            username: user.username || state.username,
        }

        return updateUser;
    })
    .on(leaveMeetingEvent, state => {
        Router.push(
            state.isGenerated
                ? clientRoutes.welcomeRoute
                : clientRoutes.dashboardRoute,
        ).then(() => {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.meetingEndDialog,
            });
        });

        return state;
    })
    .on(leaveMeetingAsHost, state => {
        Router.push(clientRoutes.dashboardRoute).then(() => {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.timeExpiredDialog,
            });
        });

        return state;
    })
    .on(leaveMeetingAsGuest, state => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.hostTimeExpiredDialog,
        });

        return state;
    })
    .on(leaveDeletedUserMeetingEvent, state => {
        Router.push(clientRoutes.dashboardRoute).then(() => {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.meetingFinishedDialog,
            });
        });

        return state;
    })
    .reset(resetRoomStores);

$isNotifiedToHostForWaitingUserRequest.on(setIsNotifiedToHostForWaitingUserRequest, (_, data) => data);

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

$isPaywallPaymentEnabled.on(setIsPaywallPaymentEnabled, (state, data) => data);
