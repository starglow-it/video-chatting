import { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

import { planColors } from 'shared-const';

import { SubscriptionsStatisticsType } from 'shared-types';
import { PropsWithClassName } from 'shared-frontend/types';

// shared
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

// components
import { Translation } from '@components/Translation/Translation';
import { CustomDoughnutChart } from '@components/CustomDoughnutChart/CustomDoughnutChart';
import { ChartLegend } from '@components/ChartLegend/ChartLegend';

// styles
import styles from './SubscriptionsStatistics.module.scss';

// stores
import { getSubscriptionsStatisticsFx } from '../../../store';

const Component = ({
    className,
    statistic,
}: PropsWithClassName<{ statistic: SubscriptionsStatisticsType }>) => {
    const isGetSubscriptionsStatisticsPending = useStore(
        getSubscriptionsStatisticsFx.pending,
    );

    const data = {
        totalNumber: statistic.totalNumber ?? 0,
        dataSets:
            statistic?.data
                ?.filter(set =>
                    Array.isArray(set.value) ? true : set.value !== 0,
                )
                ?.map(statisticData => ({
                    label: statisticData.label,
                    parts: Array.isArray(statisticData.value)
                        ? statisticData.value
                        : [statisticData.value],
                    color: planColors[statisticData.label],
                    labels: [statisticData.label],
                })) ?? [],
    };

    const dataLoadingFallback = useMemo(
        () =>
            isGetSubscriptionsStatisticsPending ? (
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
                        alt="subscriptions-statistics"
                    />
                    <CustomTypography>
                        <Translation
                            nameSpace="statistics"
                            translation="users.subscription.noData"
                        />
                    </CustomTypography>
                </CustomGrid>
            ),
        [isGetSubscriptionsStatisticsPending],
    );

    return (
        <CustomPaper className={className}>
            <CustomTypography variant="h4bold">
                <Translation
                    nameSpace="statistics"
                    translation="users.subscription.title"
                />
            </CustomTypography>
            {statistic.totalNumber === 0 ||
            isGetSubscriptionsStatisticsPending ? (
                dataLoadingFallback
            ) : (
                <CustomGrid container direction="column">
                    <CustomDoughnutChart
                        className={styles.chartClass}
                        width="180px"
                        height="180px"
                        label="Subscriptions"
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
};

export const SubscriptionsStatistics = memo(Component);
