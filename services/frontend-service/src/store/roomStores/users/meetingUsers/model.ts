import { meetingUsersDomain } from '../domain/model';

import { MeetingUser } from '../../../types';
import {
    RemoveUsersPayload,
    UpdateMeetingUserPayload,
    UpdateMeetingUsersPayload,
} from '../../meetingSocket/types';

export const $meetingUsersStore = meetingUsersDomain.createStore<MeetingUser[]>(
    [],
);
export const $isToggleUsersPanel =
    meetingUsersDomain.createStore<boolean>(false);

export const $isToggleNoteEmojiListPanel =
    meetingUsersDomain.createStore<boolean>(false);

export const $isTogglProfilePanel =
    meetingUsersDomain.createStore<boolean>(false);

export const $isToggleEditRuumePanel =
    meetingUsersDomain.createStore<boolean>(false);

export const $isToggleSchedulePanel =
    meetingUsersDomain.createStore<boolean>(false);

export const $isRecordingUrlsListPanel =
    meetingUsersDomain.createStore<boolean>(false);

export const $isToggleEditRuumeSelectMenuOpenStore =
    meetingUsersDomain.createStore<boolean>(false);

export const toggleEditRuumeSelectMenu = meetingUsersDomain.createEvent<
    boolean | undefined
>('toggleEditRuumeSelectMenu');

export const updateMeetingUsersEvent =
    meetingUsersDomain.event<UpdateMeetingUsersPayload>(
        'updateMeetingUsersEvent',
    );
export const removeMeetingUsersEvent =
    meetingUsersDomain.event<RemoveUsersPayload>('removeMeetingUsersEvent');
export const updateMeetingUserEvent =
    meetingUsersDomain.event<UpdateMeetingUserPayload>(
        'updateMeetingUserEvent',
    );

export const toggleUsersPanelEvent = meetingUsersDomain.createEvent<
    boolean | undefined
>('toggleUsersPanelEvent');

export const toggleNoteEmojiListPanelEvent = meetingUsersDomain.createEvent<
    boolean | undefined
>('toggleNoteEmojiListPanelEvent');

export const toggleProfilePanelEvent = meetingUsersDomain.createEvent<
    boolean | undefined
>('toggleProfilePanelEvent');

export const toggleEditRuumeSettingEvent = meetingUsersDomain.createEvent<
    boolean | undefined
>('toggleEditRuumeSettingEvent');

export const toggleSchedulePanelEvent = meetingUsersDomain.createEvent<
    boolean | undefined
>('toggleSchedulePanelEvent');

export const toggleRecordingUrlsListPanel = meetingUsersDomain.createEvent<
    boolean | undefined
>('toggleRecordingUrlsListPanel');
