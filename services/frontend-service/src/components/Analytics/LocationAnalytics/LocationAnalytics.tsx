import { memo, useMemo } from 'react';

// shared
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

//@mui
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { PieChart } from '@mui/x-charts/PieChart';

import { Translation } from '@library/common/Translation/Translation';

// styles
import { LocationStatistics } from 'shared-types';
import styles from './LocationAnalytics.module.scss';

const pieChartColour = ['#3B1BFD', '#F81BFD', '#FBFF4E', '#27C54A', '#9243B7'];

const LocationAnalytics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: LocationStatistics;
    }>) => {
        const data = statistic.data.map(item => {
            return { label: item.country, value: item.num };
        });
        const pieData = data.map((item, index) => ({
            ...item,
            color: pieChartColour[index],
        }));

        const renderCountryAnalytics = useMemo(() => {
            return statistic.data.map((item, index) => {
                return (
                    <CustomGrid
                        key={item.country}
                        item
                        container
                        direction="column"
                        gap={0.75}
                    >
                        <CustomGrid
                            item
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <CustomGrid item container alignItems="center" className={styles.attendeesDescWrapper}>
                                <FiberManualRecordIcon style={{ color: pieChartColour[index] }} className={styles.participantsIcon} />
                                <CustomTypography variant="body2">
                                    {item.country}
                                </CustomTypography>
                            </CustomGrid>
                            <CustomTypography variant="body2">
                                {item.num}
                            </CustomTypography>
                        </CustomGrid>
                        {((item.country === 'canada' || item.country === 'united states') &&
                            item.state
                        ) &&
                            item.state.map((state, stateIndex) => (
                                <CustomGrid
                                    key={`${item.country}-${stateIndex}`} // Use a combination of country and index as the key
                                    item
                                    container
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    className={styles.stateWrapper}
                                >
                                    <CustomGrid item container alignItems="center" className={styles.attendeesDescWrapper}>
                                        <CustomTypography variant="body3">
                                            {state.name}
                                        </CustomTypography>
                                    </CustomGrid>
                                    <CustomTypography variant="body3">
                                        {state.num}
                                    </CustomTypography>
                                </CustomGrid>
                            ))
                        }
                    </CustomGrid>
                );
            })
        }, [statistic]);

        return (
            <CustomPaper className={className}>
                <CustomGrid
                    container
                    gap={1.5}
                    direction="column"
                >

                    <CustomTypography variant="body1">
                        <Translation
                            nameSpace="common"
                            translation="statistics.users.locationAnalytics.title"
                        />
                    </CustomTypography>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="center"
                    >
                        <PieChart
                            series={[
                                {
                                    paddingAngle: 0,
                                    innerRadius: 50,
                                    outerRadius: 80,
                                    data: pieData,
                                },
                            ]}
                            margin={{ right: 5 }}
                            width={170}
                            height={170}
                            legend={{ hidden: true }}
                        />
                    </CustomGrid>
                    <CustomScroll className={styles.scrollWrapper}>
                        <CustomGrid item container direction="column" className={styles.countryListWrapper}>
                            {renderCountryAnalytics}
                        </CustomGrid>
                    </CustomScroll>
                </CustomGrid>
            </CustomPaper>
        );
    },
);

LocationAnalytics.displayName = 'LocationAnalytics';

export { LocationAnalytics };
