import { TimeoutTypesEnum } from 'shared-types';

const ONE_MILLISECOND = 1;
const ONE_SECOND = ONE_MILLISECOND * 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;

const TimeoutTypeValues = {
  [TimeoutTypesEnum.Milliseconds]: ONE_MILLISECOND,
  [TimeoutTypesEnum.Seconds]: ONE_SECOND,
  [TimeoutTypesEnum.Minutes]: ONE_MINUTE,
  [TimeoutTypesEnum.Hours]: ONE_HOUR,
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
