import { uiDomain } from '../../ui/domain/model';

export const $timeLimitWarningStore = uiDomain.createStore(false);

export const setTimeLimitWarningEvent = uiDomain.createEvent<boolean>(
    'setTimeLimitWarningEvent',
);
