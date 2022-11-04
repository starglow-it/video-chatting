import React, { useCallback, memo, useEffect, useMemo, useState } from 'react';
import { Fade } from '@mui/material';
import { useStore } from 'effector-react';

// shared
import { CustomGrid, CustomTypography, CustomChip } from 'shared-frontend/library';
import { ValuesSwitcherItem } from 'shared-frontend/types';
import { useNavigation } from 'shared-frontend/hooks';

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
} from '../../store';

import styles from './StatisticsContainer.module.scss';

const tabs: { value: string; translationKey: string }[] = [
    {
        value: 'users',
        translationKey: 'users',
    },
    {
        value: 'monetization',
        translationKey: 'monetization',
    },
    {
        value: 'rooms',
        translationKey: 'rooms',
    },
];

enum MonetizationStatisticPeriods {
    Month = 'month',
    AllTime = 'allTime',
}

const schedulePages: ValuesSwitcherItem<string>[] = [
    { id: 1, value: 'month', label: 'Last month' },
    { id: 2, value: 'allTime', label: 'All time' },
];

const Component = () => {
    const { state: usersStatistics } = useStore($usersStatisticsStore);
    const { state: subscriptionsStatistics } = useStore($subscriptionsStatistics);
    const { state: rooms } = useStore($roomsStatistics);
    const { state: usersMonetization } = useStore($usersMonetizationStatistics);
    const { state: platformMonetization } = useStore($platformMonetizationStatistics);

    const [usersPeriodType, setUsersPeriodType] = useState(MonetizationStatisticPeriods.AllTime);
    const [platformPeriodType, setPlatformPeriodType] = useState(
        MonetizationStatisticPeriods.AllTime,
    );

    useEffect(() => {
        (async () => {
            getSubscriptionsStatisticsFx();
            getUsersStatisticsFx();
            getRoomsStatisticsFx();
        })();
    }, []);

    useEffect(() => {
        console.log(usersPeriodType);
        getUsersMonetizationStatisticsFx({
            period: usersPeriodType,
            type: 'users',
        });
    }, [usersPeriodType]);

    useEffect(() => {
        getPlatformMonetizationStatisticsFx({
            period: platformPeriodType,
            type: 'platform',
        });
    }, [platformPeriodType]);

    const { activeTab, onChange: onChangeTab } = useNavigation({ tabs });

    const renderTabs = useMemo(
        () =>
            tabs.map(({ value, translationKey }) => (
                <CustomChip
                    key={value}
                    active={value === activeTab.value}
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
        [activeTab, onChangeTab],
    );

    const handleChangeUsersPeriod = useCallback((value: MonetizationStatisticPeriods) => {
        setUsersPeriodType(value);
    }, []);

    const handleChangePlatformPeriod = useCallback((value: MonetizationStatisticPeriods) => {
        setPlatformPeriodType(value);
    }, []);

    return (
        <CustomGrid container className={styles.wrapper} justifyContent="center">
            <CustomTypography variant="h1">
                <Translation nameSpace="statistics" translation="common.title" />
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

            <Fade in={activeTab.value === 'users'} unmountOnExit>
                <CustomGrid container justifyContent="center" gap={2}>
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

            <Fade in={activeTab.value === 'monetization'} unmountOnExit>
                <CustomGrid container justifyContent="center" gap={2}>
                    <MonetizationStatistics
                        key="usersMonetization"
                        titleKey="usersMonetization"
                        statistic={usersMonetization}
                        className={styles.statisticBlock}
                        periods={schedulePages}
                        currentPeriod={usersPeriodType}
                        onChangePeriod={handleChangeUsersPeriod}
                    />

                    <MonetizationStatistics
                        key="platformMonetization"
                        titleKey="platformMonetization"
                        statistic={platformMonetization}
                        className={styles.statisticBlock}
                        periods={schedulePages}
                        currentPeriod={platformPeriodType}
                        onChangePeriod={handleChangePlatformPeriod}
                    />
                </CustomGrid>
            </Fade>

            <Fade in={activeTab.value === 'rooms'} unmountOnExit>
                <CustomGrid
                    container
                    className={styles.roomsStatistics}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                >
                    <CommonRoomStatistics statistic={rooms} />
                    <RoomsRating />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
};

export const StatisticsContainer = memo(Component);
