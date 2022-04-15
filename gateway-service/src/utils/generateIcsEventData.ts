import * as ics from 'ics';

import { ONE_HOUR, ONE_MINUTE } from '../const/general';
import { parseTimestamp } from './dateHelpers/parseTimestamp';

export const generateIcsEventData = async ({
  organizerName,
  organizerEmail,
  startAt,
  endAt,
  comment,
}): Promise<Buffer> => {
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
    description: comment,
    status: 'CONFIRMED',
    method: 'REQUEST',
    organizer: {
      name: organizerName,
      email: organizerEmail,
    },
  };

  return new Promise((resolve, reject) => {
    // @ts-ignore
    ics.createEvent(eventData, (err, value) => {
      if (err) reject(err);
      resolve(Buffer.from(value, 'utf8'));
    });
  });
};
