import React, { memo } from 'react';

//shared
import { PropsWithClassName } from 'shared-frontend/types';

// components
import { ValuesSwitcher, CustomPaper, CustomTypography, CustomGrid } from 'shared-frontend/library';
import { Translation } from '@components/Translation/Translation';
import { CustomDoughnutChart } from '@components/CustomDoughnutChart/CustomDoughnutChart';
import { ChartLegend } from '@components/ChartLegend/ChartLegend';

// styles
import styles from './MonetizationStatistics.module.scss';

const Component = ({
    className,
    titleKey,
    statistic,
    periods,
    currentPeriod,
    onChangePeriod,
}: PropsWithClassName<{ titleKey: string }>) => {
    const data = {
        totalNumber: statistic.totalNumber ?? 0,
        dataSets:
            statistic?.data?.map(data => ({
                label: data.key,
                parts: data.value,
                color: data.color,
            })) ?? [],
    };

    return (
        <CustomPaper className={className}>
            <CustomGrid container justifyContent="space-between" alignItems="center">
                <CustomTypography variant="h4bold">
                    <Translation nameSpace="statistics" translation={`users.${titleKey}.title`} />
                </CustomTypography>
                <ValuesSwitcher
                    values={periods}
                    activeValue={currentPeriod}
                    onValueChanged={onChangePeriod}
                    className={styles.switcher}
                />
            </CustomGrid>

            <CustomGrid container direction="column">
                <CustomDoughnutChart
                    className={styles.chartClass}
                    width="180px"
                    height="180px"
                    label="Total"
                    data={data}
                />
                <ChartLegend dataSets={data.dataSets} totalNumber={data.totalNumber} />
            </CustomGrid>
        </CustomPaper>
    );
};

export const MonetizationStatistics = memo(Component);
