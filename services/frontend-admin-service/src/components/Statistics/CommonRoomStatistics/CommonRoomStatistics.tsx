import React, { memo } from 'react';

import { RoomsStatistics } from 'shared-types';

import { CustomGrid, CustomPaper } from 'shared-frontend/library';
import { getRandomHexColor } from 'shared-utils';

import { CustomDoughnutChart } from '@components/CustomDoughnutChart/CustomDoughnutChart';
import { ChartLegend } from '@components/ChartLegend/ChartLegend';

import styles from './CommonRoomStatistics.module.scss';

const Component = ({ statistic }: { statistic: RoomsStatistics }) => {
    const data = {
        dataSets: statistic.data.map(dataSet => ({
            label: dataSet.label,
            parts: dataSet.value,
            color: dataSet.color ?? getRandomHexColor(100, 255),
        })),
        totalNumber: statistic.totalNumber,
    };

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomGrid container className={styles.chartClass}>
                <CustomDoughnutChart width="180px" height="180px" label="Total rooms" data={data} />
            </CustomGrid>
            <ChartLegend
                className={styles.legend}
                dataSets={data.dataSets}
                totalNumber={data.totalNumber}
            />
        </CustomPaper>
    );
};

export const CommonRoomStatistics = memo(Component);
