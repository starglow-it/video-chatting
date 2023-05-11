import * as ics from 'ics';
import { EventAttributes } from 'ics';

import { parseTimestamp } from './dateHelpers/parseTimestamp';
import { getTimeoutTimestamp } from 'shared-utils';
import { TimeoutTypesEnum } from 'shared-types';
import { Attendee } from 'ics';

const ONE_HOUR = getTimeoutTimestamp({
  type: TimeoutTypesEnum.Hours,
  value: 1,
});

const ONE_MINUTE = getTimeoutTimestamp({
  type: TimeoutTypesEnum.Minutes,
  value: 1,
});

export const generateIcsEventData = async ({
  organizerName,
  organizerEmail,
  startAt,
  endAt,
  comment,
  attendees,
  url
}: {
  organizerName: string,
  organizerEmail: string,
  startAt: number,
  endAt: number,
  comment: string,
  attendees: Attendee[],
  url?: string
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
    url,
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
