import {
    $roomsStatistics,
    $subscriptionsStatistics,
    $usersStatisticsStore,
    $usersMonetizationStatistics,
    $platformMonetizationStatistics,
    $roomsStatisticsLoading,
    getRoomRatingStatisticsFx,
    getUsersStatisticsFx,
    getSubscriptionsStatisticsFx,
    getPlatformMonetizationStatisticsFx,
    getUsersMonetizationStatisticsFx,
    resetUsersMonetization,
    resetPlatformMonetization,
    setRoomsStatisticsEvent,
    setRoomStatisticsLoadingEvent
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

$usersStatisticsStore.on(getUsersStatisticsFx.doneData, (state, data) => data);
$subscriptionsStatistics.on(
    getSubscriptionsStatisticsFx.doneData,
    (state, data) => data,
);
$roomsStatistics.on(setRoomsStatisticsEvent, (state, data) => data);

$usersMonetizationStatistics
    .on(getUsersMonetizationStatisticsFx.doneData, (state, data) => data)
    .reset(resetUsersMonetization);
$platformMonetizationStatistics
    .on(getPlatformMonetizationStatisticsFx.doneData, (state, data) => data)
    .reset(resetPlatformMonetization);
$roomsStatisticsLoading.on(setRoomStatisticsLoadingEvent, (state, data) => data);
