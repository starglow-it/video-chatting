import React, { memo } from 'react';
import { useStore } from 'effector-react';

// shared
import { planColors } from 'shared-const';
import { SubscriptionsStatisticsType } from 'shared-types';
import { PropsWithClassName } from 'shared-frontend/types';
import {
    CustomImage,
    CustomGrid,
    CustomPaper,
    CustomTypography,
    WiggleLoader,
} from 'shared-frontend/library';

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
    const isGetSubscriptionsStatisticsPending = useStore(getSubscriptionsStatisticsFx.pending);

    const data = {
        totalNumber: statistic.totalNumber ?? 0,
        dataSets:
            statistic?.data?.map(data => ({
                label: data.label,
                parts: Array.isArray(data.value) ? data.value : [data.value],
                color: planColors[data.label],
                labels: [data.label],
            })) ?? [],
    };

    return (
        <CustomPaper className={className}>
            <CustomTypography variant="h4bold">
                <Translation nameSpace="statistics" translation="users.subscription.title" />
            </CustomTypography>
            {statistic.totalNumber === 0 ? (
                <>
                    {isGetSubscriptionsStatisticsPending ? (
                        <WiggleLoader className={styles.loader} />
                    ) : (
                        <CustomGrid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <CustomImage src="/images/eyes.png" width={40} height={40} />
                            <CustomTypography>
                                <Translation
                                    nameSpace="statistics"
                                    translation="users.subscription.noData"
                                />
                            </CustomTypography>
                        </CustomGrid>
                    )}
                </>
            ) : (
                <CustomGrid container direction="column">
                    <CustomDoughnutChart
                        className={styles.chartClass}
                        width="180px"
                        height="180px"
                        label="Subscriptions"
                        data={data}
                    />
                    <ChartLegend dataSets={data.dataSets} totalNumber={data.totalNumber} />
                </CustomGrid>
            )}
        </CustomPaper>
    );
};

export const SubscriptionsStatistics = memo(Component);
