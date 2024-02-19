import {
    $roomsRatingStatistics,
    $roomsStatistics,
    $subscriptionsStatistics,
    $usersStatisticsStore,
    $usersMonetizationStatistics,
    $platformMonetizationStatistics,
    getRoomRatingStatisticsFx,
    getRoomsStatisticsFx,
    getUsersStatisticsFx,
    getSubscriptionsStatisticsFx,
    getPlatformMonetizationStatisticsFx,
    getUsersMonetizationStatisticsFx,
    resetUsersMonetization,
    resetPlatformMonetization,
} from './model';

import { handleGetUsersStatistics } from './handlers/handleGetUsersStatistics';
import { handleGetSubscriptionsStatistics } from './handlers/handleGetSubscriptionsStatistics';
import { handleGetRoomsStatistics } from './handlers/handleGetRoomsStatistics';
import { handleGetRoomsRatingStatistic } from './handlers/handleGetRoomsRatingStatistic';
import { handleGetUsersMonetizationStatistic } from './handlers/handleGetUsersMonetizationStatistic';
import { handleGetPlatformMonetizationStatistic } from './handlers/handleGetPlatformMonetizationStatistic';

getUsersStatisticsFx.use(handleGetUsersStatistics);
getSubscriptionsStatisticsFx.use(handleGetSubscriptionsStatistics);
getRoomsStatisticsFx.use(handleGetRoomsStatistics);
getRoomRatingStatisticsFx.use(handleGetRoomsRatingStatistic);
getUsersMonetizationStatisticsFx.use(handleGetUsersMonetizationStatistic);
getPlatformMonetizationStatisticsFx.use(handleGetPlatformMonetizationStatistic);

$usersStatisticsStore.on(getUsersStatisticsFx.doneData, (state, data) => data);
$subscriptionsStatistics.on(
    getSubscriptionsStatisticsFx.doneData,
    (state, data) => data,
);
$roomsStatistics.on(getRoomsStatisticsFx.doneData, (state, data) => data);
$roomsRatingStatistics.on(
    getRoomRatingStatisticsFx.doneData,
    (state, data) => data,
);
$usersMonetizationStatistics
    .on(getUsersMonetizationStatisticsFx.doneData, (state, data) => data)
    .reset(resetUsersMonetization);
$platformMonetizationStatistics
    .on(getPlatformMonetizationStatisticsFx.doneData, (state, data) => data)
    .reset(resetPlatformMonetization);
