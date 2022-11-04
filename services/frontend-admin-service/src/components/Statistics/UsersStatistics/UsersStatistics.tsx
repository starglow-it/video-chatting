import { memo } from 'react';

//shared
import { PropsWithClassName } from 'shared-frontend/types';

// components
import { CustomPaper, CustomTypography, CustomGrid } from 'shared-frontend/library';
import { Translation } from '@components/Translation/Translation';
import { CustomDoughnutChart } from '@components/CustomDoughnutChart/CustomDoughnutChart';
import { ChartLegend } from '@components/ChartLegend/ChartLegend';

// styles
import styles from './UsersStatistics.module.scss';

const Component = ({ className, statistic }: PropsWithClassName<any>) => {
    const data = {
        totalNumber: statistic.totalNumber ?? 0,
        dataSets:
            statistic?.users?.map(data => ({
                label: data.key,
                parts: data.value,
                color: data.color,
            })) ?? [],
    };

    return (
        <CustomPaper className={className}>
            <CustomTypography variant="h4bold">
                <Translation nameSpace="statistics" translation="users.location.title" />
            </CustomTypography>
            <CustomGrid container direction="column">
                <CustomDoughnutChart
                    className={styles.chartClass}
                    width="180px"
                    height="180px"
                    label="Users Total"
                    data={data}
                />
                <ChartLegend dataSets={data.dataSets} totalNumber={data.totalNumber} />
            </CustomGrid>
        </CustomPaper>
    );
};

export const UsersStatistics = memo(Component);
