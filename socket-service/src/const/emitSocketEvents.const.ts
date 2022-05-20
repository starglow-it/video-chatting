export const UPDATE_MEETING = 'meeting:update';
export const MEETING_FINISHED = 'meeting:finished';

export const RECEIVE_ACCESS_REQUEST = 'meeting:accessRequest:receive';

export const UPDATE_USER = 'user:update';
export const UPDATE_USERS = 'users:update';
export const REMOVE_USERS = 'users:remove';
export const KICK_USER = 'users:kick';
export const UPDATE_MEETING_TEMPLATE = 'template:update';
export const SEND_MEETING_NOTE = 'meeting:notes:create';
export const REMOVE_MEETING_NOTE = 'meeting:notes:delete';
export const SEND_MEETING_NOTES = 'meeting:notes:get';
export const SEND_MEETING_ERROR = 'meeting:error';
export const PLAY_SOUND = 'meeting:sounds.play';

export default {
  MEETING_FINISHED,
  UPDATE_MEETING,
  RECEIVE_ACCESS_REQUEST,
  UPDATE_USER,
  REMOVE_USERS,
  UPDATE_USERS,
  KICK_USER,
  UPDATE_MEETING_TEMPLATE,
  SEND_MEETING_NOTE,
  REMOVE_MEETING_NOTE,
  SEND_MEETING_NOTES,
  SEND_MEETING_ERROR,
  PLAY_SOUND,
};
