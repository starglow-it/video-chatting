import {
    $subscriptionsStatistics,
    $usersStatisticsStore,
    getSubscriptionsStatisticsFx,
    getUsersStatisticsFx
} from './model';
import { handleGetUsersStatistics } from './handlers/handleGetUsersStatistics';
import { handleGetSubscriptionsStatistics } from './handlers/handleGetSubscriptionsStatistics';

getUsersStatisticsFx.use(handleGetUsersStatistics);
getSubscriptionsStatisticsFx.use(handleGetSubscriptionsStatistics);

$usersStatisticsStore.on(getUsersStatisticsFx.doneData, (sate, data) => {
    return data;
});

$subscriptionsStatistics.on(getSubscriptionsStatisticsFx.doneData, (sate, data) => {
    return data;
});
