import * as ics from 'ics';

import { ONE_HOUR, ONE_MINUTE } from '../const/general';
import { parseTimestamp } from './dateHelpers/parseTimestamp';
import { EventAttributes } from 'ics';

export const generateIcsEventData = async ({
  organizerName,
  organizerEmail,
  startAt,
  endAt,
  comment,
  attendees,
}): Promise<string> => {
  const duration = endAt - startAt;

  const hours = Math.floor(duration / ONE_HOUR);

  const minutes = Math.floor(
    (duration - (hours > 0 ? hours : 0) * ONE_HOUR) / ONE_MINUTE,
  );

  const {
    year,
    month,
    day,
    hours: startHours,
    minutes: startMinutes,
  } = parseTimestamp(startAt);

  const eventData = {
    start: [year, month, day, startHours, startMinutes],
    duration: { hours, minutes },
    title: 'Scheduled Meeting',
    // description: 'X-ALT-DESC;FMTTYPE=text/html:<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2//EN"><HTML><BODY><a href="https://google.com" target="_blank">LinkText</a></BODY></HTML>',
    description: comment,
    status: 'CONFIRMED',
    method: 'REQUEST',
    organizer: {
      name: organizerName,
      email: organizerEmail,
    },
    attendees,
  } as EventAttributes;

  return new Promise((resolve, reject) => {
    ics.createEvent(eventData, (err, value) => {
      if (err) reject(err);
      resolve(value);
    });
  });
};
