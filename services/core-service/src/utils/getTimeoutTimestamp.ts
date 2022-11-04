import { TimeoutTypesEnum } from 'shared-types';

const ONE_MILLISECOND = 1;
const ONE_SECOND = ONE_MILLISECOND * 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;

const TimeoutTypeValues = {
  [TimeoutTypesEnum.Milliseconds]: ONE_MILLISECOND,
  [TimeoutTypesEnum.Seconds]: ONE_SECOND,
  [TimeoutTypesEnum.Minutes]: ONE_MINUTE,
  [TimeoutTypesEnum.Hours]: ONE_HOUR,
  [TimeoutTypesEnum.Days]: ONE_DAY,
  [TimeoutTypesEnum.Month]: ONE_MONTH,
};

export const getTimeoutTimestamp = ({
  type,
  value,
}: {
  type: TimeoutTypesEnum;
  value: number;
}) => {
  return TimeoutTypeValues[type] * value;
};
