import { memo } from 'react';

import { RoomsStatistics } from 'shared-types';
import { getRandomHexColor } from 'shared-utils';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';

import { CustomDoughnutChart } from '@components/CustomDoughnutChart/CustomDoughnutChart';
import { ChartLegend } from '@components/ChartLegend/ChartLegend';

import styles from './CommonRoomStatistics.module.scss';

const Component = ({
	statistic 
}: { statistic: RoomsStatistics }) => {
	const data = {
		totalNumber: statistic.totalNumber ?? 0,
		dataSets:
            statistic?.data?.filter(set => Array.isArray(set.value) ? true : set.value !== 0)?.map(statisticData => ({
            	label: statisticData.label,
            	parts: Array.isArray(statisticData.value)
            		? statisticData.value
            		: [statisticData.value],
            	color: statisticData.color ?? getRandomHexColor(100, 255),
            	labels: [statisticData.label],
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
