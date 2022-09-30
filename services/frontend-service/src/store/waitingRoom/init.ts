import { attach, combine, Store } from 'effector-next';
import { joinDashboardSocketEvent, joinRoomBeforeMeetingSocketEvent } from './model';
import { $profileStore } from '../profile/profile/model';
import { AppDialogsEnum, Profile } from '../types';
import { setMeetingErrorEvent } from '../roomStores';
import { appDialogsApi } from '../dialogs/init';

export const sendJoinDashboardSocketEvent = attach<
    void,
    Store<{ profile: Profile }>,
    typeof joinDashboardSocketEvent
>({
    effect: joinDashboardSocketEvent,
    source: combine({ profile: $profileStore }),
    mapParams: (_, { profile }) => ({ userId: profile.id }),
});

joinRoomBeforeMeetingSocketEvent.failData.watch(data => {
    setMeetingErrorEvent(data);
    appDialogsApi.openDialog({
        dialogKey: AppDialogsEnum.meetingErrorDialog,
    });
});
