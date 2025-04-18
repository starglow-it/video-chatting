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

const pieChartColor = ['#3B1BFD', '#F81BFD', '#FBFF4E', '#27C54A', '#9243B7', '#F97A1C', '#00A6ED', '#E63946', '#F4E285'];

const LocationAnalytics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: LocationStatistics;
    }>) => {
        const data = (statistic.data || []).map(item => {
            return { label: item.country, value: item.num };
        });
        const pieData = data.map((item, index) => ({
            ...item,
            color: pieChartColor[index],
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
                                <FiberManualRecordIcon style={{ color: pieChartColor[index] }} className={styles.participantsIcon} />
                                <CustomTypography variant="body2">
                                    {item.country}
                                </CustomTypography>
                            </CustomGrid>
                            <CustomTypography variant="body2">
                                {item.num}
                            </CustomTypography>
                        </CustomGrid>
                        {((item.country === 'Canada' || item.country === 'United States') &&
                            !!item.state
                        ) &&
                            item.state.map((state, stateIndex) => (
                                <CustomGrid
                                    key={`${item.country}-${stateIndex}`}
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
                        <CustomGrid
                            item
                            container
                            direction="column"
                            gap={1.5}
                            className={styles.countryListWrapper}
                        >
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
