import {
	useCallback, memo, useEffect, useMemo, useState 
} from 'react';
import { Fade } from '@mui/material';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// shared
import { useNavigation } from 'shared-frontend/hooks/useNavigation';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { ValuesSwitcherItem } from 'shared-frontend/types';

import { MonetizationStatisticPeriods } from 'shared-types';

// components
import { Translation } from '@components/Translation/Translation';
import { UsersStatistics } from '@components/Statistics/UsersStatistics/UsersStatistics';
import { SubscriptionsStatistics } from '@components/Statistics/SubscriptionsStatistics/SubscriptionsStatistics';
import { CommonRoomStatistics } from '@components/Statistics/CommonRoomStatistics/CommonRoomStatistics';
import { MonetizationStatistics } from '@components/Statistics/MonetizationStatistics/MonetizationStatistics';
import { RoomsRating } from '@components/Statistics/RoomsRating/RoomsRating';

// store
import {
	$platformMonetizationStatistics,
	$roomsStatistics,
	$subscriptionsStatistics,
	$usersMonetizationStatistics,
	$usersStatisticsStore,
	getPlatformMonetizationStatisticsFx,
	getRoomsStatisticsFx,
	getSubscriptionsStatisticsFx,
	getUsersMonetizationStatisticsFx,
	getUsersStatisticsFx,
	resetPlatformMonetization,
	resetUsersMonetization,
} from '../../store';

import styles from './StatisticsContainer.module.scss';

import {
	schedulePages,
	StatisticsTabsValues,
	statisticTabs,
} from '../../const/statistics';

const Component = () => {
	const {
		state: usersStatistics 
	} = useStore($usersStatisticsStore);
	const {
		state: subscriptionsStatistics 
	} = useStore(
		$subscriptionsStatistics,
	);
	const {
		state: rooms 
	} = useStore($roomsStatistics);
	const {
		state: usersMonetization 
	} = useStore($usersMonetizationStatistics);
	const {
		state: platformMonetization 
	} = useStore(
		$platformMonetizationStatistics,
	);

	const isUsersMonetizationStatisticLoading = useStore(
		getUsersMonetizationStatisticsFx.pending,
	);
	const isPlatformMonetizationStatisticLoading = useStore(
		getPlatformMonetizationStatisticsFx.pending,
	);

	const [usersPeriodType, setUsersPeriodType] = useState<
        ValuesSwitcherItem<MonetizationStatisticPeriods>
    >(schedulePages[0]);
	const [platformPeriodType, setPlatformPeriodType] = useState<
        ValuesSwitcherItem<MonetizationStatisticPeriods>
    >(schedulePages[0]);

	useEffect(() => {
		(async () => {
			getSubscriptionsStatisticsFx();
			getUsersStatisticsFx();
			getRoomsStatisticsFx();
		})();
	}, []);

	useEffect(() => {
		getUsersMonetizationStatisticsFx({
			period: usersPeriodType.value,
			type: 'users',
		});
	}, [usersPeriodType.value]);

	useEffect(() => {
		getPlatformMonetizationStatisticsFx({
			period: platformPeriodType.value,
			type: 'platform',
		});
	}, [platformPeriodType.value]);

	const {
		activeTab, onChange: onChangeTab 
	} = useNavigation({
		tabs: statisticTabs,
	});

	const renderTabs = useMemo(
		() =>
			statisticTabs.map(({
				value, translationKey 
			}) => (
				<CustomChip
					key={value}
					active={value === activeTab.value}
					className={styles.chip}
					label={
						<CustomTypography>
							<Translation
								nameSpace="statistics"
								translation={`pages.${translationKey}.title`}
							/>
						</CustomTypography>
					}
					onClick={() => onChangeTab(value)}
				/>
			)),
		[activeTab],
	);

	const handleChangeUsersPeriod = useCallback(
		(value: ValuesSwitcherItem<MonetizationStatisticPeriods>) => {
			resetUsersMonetization();
			setUsersPeriodType(value);
		},
		[],
	);

	const handleChangePlatformPeriod = useCallback(
		(value: ValuesSwitcherItem<MonetizationStatisticPeriods>) => {
			resetPlatformMonetization();
			setPlatformPeriodType(value);
		},
		[],
	);

	return (
		<CustomGrid
			container
			direction="column"
			alignItems="center"
			className={styles.wrapper}
		>
			<CustomTypography variant="h1">
				<Translation
					nameSpace="statistics"
					translation="common.title"
				/>
			</CustomTypography>
			<CustomGrid
				container
				alignItems="center"
				justifyContent="center"
				gap={1.75}
				className={styles.tabs}
			>
				{renderTabs}
			</CustomGrid>

			<CustomGrid className={styles.fadeWrapper}>
				<Fade
					in={activeTab.value === StatisticsTabsValues.Users}
					unmountOnExit
				>
					<CustomGrid
						className={styles.fadeContainer}
						container
						justifyContent="center"
						gap={2}
					>
						<UsersStatistics
							statistic={usersStatistics}
							className={styles.statisticBlock}
						/>
						<SubscriptionsStatistics
							statistic={subscriptionsStatistics}
							className={styles.statisticBlock}
						/>
					</CustomGrid>
				</Fade>

				<Fade
					in={activeTab.value === StatisticsTabsValues.Rooms}
					unmountOnExit
				>
					<CustomGrid
						container
						className={clsx(
							styles.fadeContainer,
							styles.roomsStatistics,
						)}
						direction="column"
						alignItems="center"
						justifyContent="center"
						gap={2}
					>
						<CommonRoomStatistics statistic={rooms} />
						<RoomsRating />
					</CustomGrid>
				</Fade>

				<Fade
					in={activeTab.value === StatisticsTabsValues.Monetization}
					unmountOnExit
				>
					<CustomGrid
						className={styles.fadeContainer}
						container
						justifyContent="center"
						gap={2}
					>
						<MonetizationStatistics
							key="usersMonetization"
							titleKey="usersMonetization"
							statistic={usersMonetization}
							className={styles.statisticBlock}
							periods={schedulePages}
							currentPeriod={usersPeriodType}
							onChangePeriod={handleChangeUsersPeriod}
							isDataLoading={isUsersMonetizationStatisticLoading}
						/>

						<MonetizationStatistics
							key="platformMonetization"
							titleKey="platformMonetization"
							statistic={platformMonetization}
							className={styles.statisticBlock}
							periods={schedulePages}
							currentPeriod={platformPeriodType}
							onChangePeriod={handleChangePlatformPeriod}
							isDataLoading={
								isPlatformMonetizationStatisticLoading
							}
						/>
					</CustomGrid>
				</Fade>
			</CustomGrid>
		</CustomGrid>
	);
};

export const StatisticsContainer = memo(Component);
