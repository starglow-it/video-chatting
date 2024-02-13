import { memo } from 'react';

// shared
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

//@mui
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { styled } from '@mui/system';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { Translation } from '@library/common/Translation/Translation';

// styles
import { AttendeesNumbers } from 'shared-types';
import styles from './AttendeesAnalytics.module.scss';

const BorderLinearProgress = styled(LinearProgress, {
    shouldForwardProp: (prop) => prop !== 'bgColor',
})(({ theme, bgColor }) => ({
    width: '90%',
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: 'transparent',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: bgColor,
    },
}));

const AttendeesAnalytics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: AttendeesNumbers;
    }>) => {

        return (
            <CustomPaper className={className}>
                <CustomGrid
                    container
                    gap={1.5}
                    direction="column"
                >
                    <CustomGrid
                        item
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <CustomTypography variant="body1">
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.attendeesNumbers.numberOfAttendees"
                            />
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            {statistic.totalNumber}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <CustomGrid item container alignItems="center" className={styles.attendeesDescWrapper}>
                            <FiberManualRecordIcon className={styles.participantsIcon} />
                            <CustomTypography variant="body2">

                                <Translation
                                    nameSpace="common"
                                    translation="statistics.users.attendeesNumbers.participants"
                                />
                            </CustomTypography>
                        </CustomGrid>
                        <CustomTypography variant="body2">
                            {statistic.participants}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <CustomGrid item container alignItems="center" className={styles.attendeesDescWrapper}>
                            <FiberManualRecordIcon className={styles.audienceIcon} />
                            <CustomTypography variant="body2">

                                <Translation
                                    nameSpace="common"
                                    translation="statistics.users.attendeesNumbers.audience"
                                />
                            </CustomTypography>
                        </CustomGrid>
                        <CustomTypography variant="body2">
                            {statistic.audience}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        className={styles.avgMinTitle}
                    >
                        <CustomTypography variant="body1">
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.attendeesNumbers.avgMin"
                            />
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                    >
                        <CustomGrid item xs={10} container>
                            <BorderLinearProgress
                                variant="determinate"
                                value={(statistic.participantsAvgMin / (statistic.participantsAvgMin + statistic.audienceAvgMin)) * 100
                                }
                                bgColor="#9243B7"
                            />
                        </CustomGrid>
                        <CustomGrid item xs={2} container justifyContent="flex-end">
                            <CustomTypography variant="body2">
                                {statistic.participantsAvgMin}
                                <CustomTypography variant="body2" className={styles.avgMinUnit} >
                                    <Translation
                                        nameSpace="common"
                                        translation={statistic.participantsAvgMin > 1 ? "statistics.users.attendeesNumbers.mins" : "statistics.users.attendeesNumbers.min"}
                                    />
                                </CustomTypography>
                            </CustomTypography>
                        </CustomGrid>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                    >
                        <CustomGrid item xs={10} container>
                            <BorderLinearProgress
                                variant="determinate"
                                value={(statistic.audienceAvgMin / (statistic.participantsAvgMin + statistic.audienceAvgMin)) * 100}
                                bgColor="#27C54A"
                            />
                        </CustomGrid>
                        <CustomGrid item xs={2} container justifyContent="flex-end">
                            <CustomTypography variant="body2">
                                {statistic.audienceAvgMin}
                                <CustomTypography variant="body2" className={styles.avgMinUnit} >
                                    <Translation
                                        nameSpace="common"
                                        translation={statistic.audienceAvgMin > 1 ? "statistics.users.attendeesNumbers.mins" : "statistics.users.attendeesNumbers.min"}
                                    />
                                </CustomTypography>
                            </CustomTypography>
                        </CustomGrid>
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
        );
    },
);

AttendeesAnalytics.displayName = 'AttendeesAnalytics';

export { AttendeesAnalytics };
