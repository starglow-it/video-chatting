import { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

// shared
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

import { Translation } from '@components/Translation/Translation';
import { CustomDoughnutChart } from '@components/CustomDoughnutChart/CustomDoughnutChart';
import { ChartLegend } from '@components/ChartLegend/ChartLegend';

// styles
import { ICountryStatistic } from 'shared-types';
import styles from './UsersStatistics.module.scss';

// stores
import { getUsersStatisticsFx } from '../../../store';

type OthersStatistics = {
    value: number | number[];
    key: string;
    color: string;
    labels?: string[];
};

const UsersStatistics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: { data: ICountryStatistic[]; totalNumber: number };
    }>) => {
        const isGetUsersStatisticsPending = useStore(
            getUsersStatisticsFx.pending,
        );

        let statisticsDataSets;

        if (statistic?.data?.length > 3) {
            const [first, second, third, ...others] = statistic.data;

            const othersInitialData: OthersStatistics = {
                value: [],
                key: 'Other',
                color: '#BDC8D3',
                labels: [],
            };

            statisticsDataSets = [
                first,
                second,
                third,
                others.reduce(
                    (acc: OthersStatistics, newData: ICountryStatistic) => ({
                        ...acc,
                        key: 'Other',
                        value: [
                            ...(Array.isArray(acc.value)
                                ? acc.value
                                : [acc.value]),
                            newData.value,
                        ],
                        labels: [...(acc.labels ?? []), newData.key],
                    }),
                    othersInitialData,
                ),
            ];
        } else {
            statisticsDataSets = statistic?.data;
        }

        const data = {
            totalNumber: statistic.totalNumber ?? 0,
            dataSets:
                statisticsDataSets
                    ?.filter(set =>
                        Array.isArray(set.value) ? true : set.value !== 0,
                    )
                    .map(statisticSet => ({
                        label: statisticSet.key,
                        parts: Array.isArray(statisticSet.value)
                            ? statisticSet.value
                            : [statisticSet.value],
                        color: statisticSet.color,
                        labels: statisticSet?.labels ?? [statisticSet.key],
                    })) ?? [],
        };

        const dataLoadingFallback = useMemo(
            () =>
                isGetUsersStatisticsPending ? (
                    <CustomLoader className={styles.loader} />
                ) : (
                    <CustomGrid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        className={styles.noData}
                    >
                        <CustomImage
                            src="/images/eyes.webp"
                            width={40}
                            height={40}
                            alt="users-statistics"
                        />
                        <CustomTypography>
                            <Translation
                                nameSpace="statistics"
                                translation="users.users.noData"
                            />
                        </CustomTypography>
                    </CustomGrid>
                ),
            [isGetUsersStatisticsPending],
        );

        return (
            <CustomPaper className={className}>
                <CustomTypography variant="h4bold">
                    <Translation
                        nameSpace="statistics"
                        translation="users.location.title"
                    />
                </CustomTypography>
                {statistic.totalNumber === 0 || isGetUsersStatisticsPending ? (
                    dataLoadingFallback
                ) : (
                    <CustomGrid container direction="column">
                        <CustomDoughnutChart
                            className={styles.chartClass}
                            width="180px"
                            height="180px"
                            label="Users Total"
                            data={data}
                        />
                        <ChartLegend
                            dataSets={data.dataSets}
                            totalNumber={data.totalNumber}
                        />
                    </CustomGrid>
                )}
            </CustomPaper>
        );
    },
);

UsersStatistics.displayName = 'UsersStatistics';

export { UsersStatistics };
