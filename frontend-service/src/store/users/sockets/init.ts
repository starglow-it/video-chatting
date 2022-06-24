import { sample } from 'effector-next';

import { meetingUsersDomain } from '../domain/model';
import { createSocketEvent } from '../../socket/model';
import { MeetingUser } from '../../types';
import {REMOVE_USER, UPDATE_USER} from "../../../const/socketEvents/emitters";

export const updateUserEvent = createSocketEvent(UPDATE_USER);
export const removeUserEvent = createSocketEvent(REMOVE_USER);

// socket events emitters
export const emitUpdateUserEvent =
    meetingUsersDomain.event<Partial<MeetingUser>>('emitUpdateUserEvent');

export const emitRemoveUserEvent =
    meetingUsersDomain.event<Partial<MeetingUser>>('emitRemoveUserEvent');

const updateUserResultFx = meetingUsersDomain.effect({
    name: 'updateUserResultFx',
    handler: async data => updateUserEvent(data),
});

const removeUserResultFx = meetingUsersDomain.effect({
    name: 'removeUserResultFx',
    handler: async data => removeUserEvent(data),
});

sample({
    clock: emitUpdateUserEvent,
    target: updateUserResultFx,
});

sample({
    clock: emitRemoveUserEvent,
    target: removeUserResultFx,
});
