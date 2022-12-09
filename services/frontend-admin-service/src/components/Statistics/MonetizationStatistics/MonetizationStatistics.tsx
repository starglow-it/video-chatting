import React, {
	memo 
} from 'react';
import clsx from 'clsx';

// hooks
import {
	useLocalization 
} from '@hooks/useTranslation';

// shared
import {
	PropsWithClassName 
} from 'shared-frontend/types';
import {
	MonetizationStatisticPeriods 
} from 'shared-types';

// shared
import {
	CustomPaper 
} from 'shared-frontend/library/custom/CustomPaper';
import {
	CustomTypography 
} from 'shared-frontend/library/custom/CustomTypography';
import {
	CustomGrid 
} from 'shared-frontend/library/custom/CustomGrid';
import {
	CustomImage 
} from 'shared-frontend/library/custom/CustomImage';
import {
	CustomLoader
} from 'shared-frontend/library/custom/CustomLoader';
import {
	ValuesSwitcher 
} from 'shared-frontend/library/common/ValuesSwitcher';

// components
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
import styles from './MonetizationStatistics.module.scss';

// types
import {
	MonetizationStatisticsProps 
} from './MonetizationStatistics.types';

const Component = ({
	className,
	titleKey,
	statistic,
	periods,
	currentPeriod,
	onChangePeriod,
	isDataLoading,
}: PropsWithClassName<MonetizationStatisticsProps>) => {
	const {
		translation 
	} = useLocalization('statistics');

	const data = {
		totalNumber: statistic.totalNumber ?? 0,
		totalLabel: `$${Math.round(statistic.totalNumber / 100)}`,
		dataSets:
            statistic?.data?.map(data => ({
            	label: translation(`monetization.${data.label}`),
            	parts: Array.isArray(data.value)
            		? Math.round(data.value / 100)
            		: [Math.round(data.value / 100)],
            	color: data.color,
            	labels: [translation(`monetization.${data.label}`)],
            })) ?? [],
	};

	return (
		<CustomPaper className={clsx(styles.wrapper, className)}>
			<CustomGrid
				container
				justifyContent="space-between"
				alignItems="center"
			>
				<CustomTypography variant="h4bold">
					<Translation
						nameSpace="statistics"
						translation={`users.${titleKey}.title`}
					/>
				</CustomTypography>
				<ValuesSwitcher<MonetizationStatisticPeriods>
					values={periods}
					activeValue={currentPeriod}
					onValueChanged={onChangePeriod}
					className={styles.switcher}
				/>
			</CustomGrid>

			{statistic.totalNumber === 0 ? (
				<>
					{isDataLoading ? (
						<CustomLoader className={styles.loader} />
					) : (
						<CustomGrid
							container
							direction="column"
							justifyContent="center"
							alignItems="center"
							flex="1 1"
						>
							<CustomImage
								src="/images/eyes.webp"
								width={40}
								height={40}
							/>
							<CustomTypography>
								<Translation
									nameSpace="statistics"
									translation="users.monetization.noData"
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
						label="Total"
						data={data}
					/>
					<ChartLegend
						dataSets={data.dataSets}
						totalNumber={Math.round(data.totalNumber / 100)}
					/>
				</CustomGrid>
			)}
		</CustomPaper>
	);
};

export const MonetizationStatistics = memo(Component);
