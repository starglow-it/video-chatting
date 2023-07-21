import { $timeLimitWarningStore, setTimeLimitWarningEvent } from './model';
import { resetRoomStores } from '../../root';

$timeLimitWarningStore
    .on(setTimeLimitWarningEvent, (state, data) => data)
    .reset(resetRoomStores);
