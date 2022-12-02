import React, {
	memo 
} from 'react';

import {
	RoomsStatistics 
} from 'shared-types';

import {
	CustomGrid, CustomPaper 
} from 'shared-frontend/library';
import {
	getRandomHexColor 
} from 'shared-utils';

import {
	CustomDoughnutChart 
} from '@components/CustomDoughnutChart/CustomDoughnutChart';
import {
	ChartLegend 
} from '@components/ChartLegend/ChartLegend';

import styles from './CommonRoomStatistics.module.scss';

const Component = ({
	statistic 
}: { statistic: RoomsStatistics }) => {
	const data = {
		totalNumber: statistic.totalNumber ?? 0,
		dataSets:
            statistic?.data?.map(data => ({
            	label: data.label,
            	parts: Array.isArray(data.value) ? data.value : [data.value],
            	color: data.color ?? getRandomHexColor(100, 255),
            	labels: [data.label],
            })) ?? [],
	};

	return (
		<CustomPaper className={styles.wrapper}>
			<CustomGrid
				container
				className={styles.chartClass}
			>
				<CustomDoughnutChart
					width="180px"
					height="180px"
					label="Total Rooms"
					data={data}
				/>
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
