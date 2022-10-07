import { attach, combine, Store } from 'effector-next';
import { joinDashboardSocketEvent } from './model';
import { $profileStore } from '../profile/profile/model';
import { Profile } from '../types';

export const sendJoinDashboardSocketEvent = attach<
    void,
    Store<{ profile: Profile }>,
    typeof joinDashboardSocketEvent
>({
    effect: joinDashboardSocketEvent,
    source: combine({ profile: $profileStore }),
    mapParams: (_, { profile }) => ({ userId: profile.id }),
});
