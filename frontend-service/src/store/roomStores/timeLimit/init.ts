import { $timeLimitWarningStore, setTimeLimitWarningEvent } from './model';

$timeLimitWarningStore.on(setTimeLimitWarningEvent, (state, data) => data);
