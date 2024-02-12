import {
    $roomsStatistics,
    $subscriptionsStatistics,
    $usersStatisticsStore,
    $usersMonetizationStatistics,
    $platformMonetizationStatistics,
    getRoomRatingStatisticsFx,
    getUsersStatisticsFx,
    getSubscriptionsStatisticsFx,
    getPlatformMonetizationStatisticsFx,
    getUsersMonetizationStatisticsFx,
    resetUsersMonetization,
    resetPlatformMonetization,
    setRoomsStatisticsEvent
} from './model';

import { handleGetUsersStatistics } from './handlers/handleGetUsersStatistics';
import { handleGetSubscriptionsStatistics } from './handlers/handleGetSubscriptionsStatistics';
import { handleGetRoomsRatingStatistic } from './handlers/handleGetRoomsRatingStatistic';
import { handleGetUsersMonetizationStatistic } from './handlers/handleGetUsersMonetizationStatistic';
import { handleGetPlatformMonetizationStatistic } from './handlers/handleGetPlatformMonetizationStatistic';

getUsersStatisticsFx.use(handleGetUsersStatistics);
getSubscriptionsStatisticsFx.use(handleGetSubscriptionsStatistics);
getRoomRatingStatisticsFx.use(handleGetRoomsRatingStatistic);
getUsersMonetizationStatisticsFx.use(handleGetUsersMonetizationStatistic);
getPlatformMonetizationStatisticsFx.use(handleGetPlatformMonetizationStatistic);

$usersStatisticsStore.on(getUsersStatisticsFx.doneData, (sate, data) => data);
$subscriptionsStatistics.on(
    getSubscriptionsStatisticsFx.doneData,
    (sate, data) => data,
);
$roomsStatistics.on(setRoomsStatisticsEvent, (sate, data) => data);

$usersMonetizationStatistics
    .on(getUsersMonetizationStatisticsFx.doneData, (sate, data) => data)
    .reset(resetUsersMonetization);
$platformMonetizationStatistics
    .on(getPlatformMonetizationStatisticsFx.doneData, (sate, data) => data)
    .reset(resetPlatformMonetization);
