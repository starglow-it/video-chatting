import {
    $isEditTemplateOpenStore,
    $isMeetingInfoOpenStore,
    setEditTemplateOpenEvent,
    setMeetingInfoOpenEvent,
    toggleEditTemplateOpen,
    toggleMeetingInfoOpen,
} from './model';

$isEditTemplateOpenStore
    .on(toggleEditTemplateOpen, state => !state)
    .on(setEditTemplateOpenEvent, (state, data) => data);

$isMeetingInfoOpenStore
    .on(toggleMeetingInfoOpen, state => !state)
    .on(setMeetingInfoOpenEvent, (state, data) => data);
