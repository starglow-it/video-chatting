export const JOIN_WAITING_ROOM = 'meeting:waitingRoom:join';
export const START_MEETING = 'meeting:start';
export const END_MEETING = 'meeting:end';
export const LEAVE_MEETING = 'meeting:leave';
export const SEND_ACCESS_REQUEST = 'meeting:accessRequest:send';
export const ANSWER_ACCESS_REQUEST = 'meeting:accessRequest:answer';
export const CANCEL_ACCESS_REQUEST = 'meeting:accessRequest:cancel';
export const UPDATE_USER = 'users:updateUser';
export const REMOVE_USER = 'users:removeUser';
export const UPDATE_MEETING_TEMPLATE = 'template:update';
export const SEND_MEETING_NOTE_EVENT = 'meeting:notes:create';
export const REMOVE_MEETING_NOTE_EVENT = 'meeting:notes:delete';
export const GET_MEETING_NOTES_EVENT = 'meeting:notes:get';

export default {
  JOIN_WAITING_ROOM,
  START_MEETING,
  SEND_ACCESS_REQUEST,
  ANSWER_ACCESS_REQUEST,
  CANCEL_ACCESS_REQUEST,
  UPDATE_USER,
  END_MEETING,
  LEAVE_MEETING,
  REMOVE_USER,
  UPDATE_MEETING_TEMPLATE,
  SEND_MEETING_NOTE_EVENT,
  REMOVE_MEETING_NOTE_EVENT,
};
