import { createEvent, PageContext } from 'effector-next';

export const pageLoaded = createEvent<PageContext>();
export const resetRoomStores = createEvent('resetRoomStores');
export const resetMeetingRecordingStore = createEvent('resetMeetingRecordingStore');
