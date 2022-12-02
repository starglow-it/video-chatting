import React, {
	memo 
} from 'react';
import {
	useStore 
} from 'effector-react';

// shared
import {
	PropsWithClassName 
} from 'shared-frontend/types';

// components
import {
	CustomPaper,
	CustomTypography,
	CustomGrid,
	WiggleLoader,
	CustomImage,
} from 'shared-frontend/library';
import {
	Translation 
} from '@components/Translation/Translation';
import {
	CustomDoughnutChart 
} from '@components/CustomDoughnutChart/CustomDoughnutChart';
import {
	ChartLegend 
} from '@components/ChartLegend/ChartLegend';

// styles
import styles from './UsersStatistics.module.scss';

// stores
import {
	getUsersStatisticsFx 
} from '../../../store';

const Component = ({
	className, 
	statistic 
}: PropsWithClassName<any>) => {
	const isGetUsersStatisticsPending = useStore(getUsersStatisticsFx.pending);

	let statisticsDataSets;

	if (statistic?.data?.length > 3) {
		const [first, second, third, ...others] = statistic?.data;

		statisticsDataSets = [
			first,
			second,
			third,
			others.reduce(
				(acc, data) => ({
					...acc,
					value: [...acc.value, data.value],
					labels: [...acc.labels, data.key],
				}),
				{
					value: [],
					key: 'Others',
					color: '#BDC8D3',
					labels: [],
				},
			),
		];
	} else {
		statisticsDataSets = statistic?.data;
	}

	const data = {
		totalNumber: statistic.totalNumber ?? 0,
		dataSets:
            statisticsDataSets?.map(data => ({
            	label: data.key,
            	parts: Array.isArray(data.value) ? data.value : [data.value],
            	color: data.color,
            	labels: data.labels ?? [data.key],
            })) ?? [],
	};

	return (
		<CustomPaper className={className}>
			<CustomTypography variant="h4bold">
				<Translation
					nameSpace="statistics"
					translation="users.location.title"
				/>
			</CustomTypography>
			{statistic.totalNumber === 0 ? (
				<>
					{isGetUsersStatisticsPending ? (
						<WiggleLoader className={styles.loader} />
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
							/>
							<CustomTypography>
								<Translation
									nameSpace="statistics"
									translation="users.users.noData"
								/>
							</CustomTypography>
						</CustomGrid>
					)}
				</>
			) : (
				<CustomGrid
					container
					direction="column"
				>
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
};

export const UsersStatistics = memo(Component);
