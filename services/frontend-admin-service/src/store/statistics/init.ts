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

import {
	handleGetUsersStatistics 
} from './handlers/handleGetUsersStatistics';
import {
	handleGetSubscriptionsStatistics 
} from './handlers/handleGetSubscriptionsStatistics';
import {
	handleGetRoomsStatistics 
} from './handlers/handleGetRoomsStatistics';
import {
	handleGetRoomsRatingStatistic 
} from './handlers/handleGetRoomsRatingStatistic';
import {
	handleGetUsersMonetizationStatistic 
} from './handlers/handleGetUsersMonetizationStatistic';
import {
	handleGetPlatformMonetizationStatistic 
} from './handlers/handleGetPlatformMonetizationStatistic';

getUsersStatisticsFx.use(handleGetUsersStatistics);
getSubscriptionsStatisticsFx.use(handleGetSubscriptionsStatistics);
getRoomsStatisticsFx.use(handleGetRoomsStatistics);
getRoomRatingStatisticsFx.use(handleGetRoomsRatingStatistic);
getUsersMonetizationStatisticsFx.use(handleGetUsersMonetizationStatistic);
getPlatformMonetizationStatisticsFx.use(handleGetPlatformMonetizationStatistic);

$usersStatisticsStore.on(getUsersStatisticsFx.doneData, (sate, data) => data);
$subscriptionsStatistics.on(
	getSubscriptionsStatisticsFx.doneData,
	(sate, data) => data,
);
$roomsStatistics.on(getRoomsStatisticsFx.doneData, (sate, data) => data);
$roomsRatingStatistics.on(
	getRoomRatingStatisticsFx.doneData,
	(sate, data) => data,
);
$usersMonetizationStatistics
	.on(getUsersMonetizationStatisticsFx.doneData, (sate, data) => data)
	.reset(resetUsersMonetization);
$platformMonetizationStatistics
	.on(getPlatformMonetizationStatisticsFx.doneData, (sate, data) => data)
	.reset(resetPlatformMonetization);
