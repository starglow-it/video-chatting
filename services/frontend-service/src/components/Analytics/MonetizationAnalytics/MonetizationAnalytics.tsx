import { memo } from 'react';

// shared
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { Translation } from '@library/common/Translation/Translation';

//types
import { MeetingStatisticsState } from 'src/store/types';

// styles
import styles from './MonetizationAnalytics.module.scss';

const MonetizationAnalytics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: MeetingStatisticsState
    }>) => {

        return (
            <CustomPaper className={className}>
                <CustomGrid
                    container
                    gap={3}
                    direction="column"
                >
                    <CustomGrid
                        item
                        container
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        className={styles.qaTitleWrapper}
                    >
                        <CustomTypography variant="h2">
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.monetizationAnalytics.title"
                            />
                        </CustomTypography>
                        <CustomTypography variant="h2">
                            ${
                                statistic.data.audienceFees + 
                                statistic.data.participantFees + 
                                statistic.data.participantDonationsTotal +
                                statistic.data.audienceDonationsTotal
                            }
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <CustomTypography variant="body1" >
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.monetizationAnalytics.participantEntryFee"
                            /> - ${statistic.data.participantEntryFee} USD/person
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            ${statistic.data.participantFees}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        className={styles.donation}
                    >
                        <CustomTypography variant="body1" >
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.monetizationAnalytics.participantDonation"
                            /> - ${statistic.data.participantDonationPrice} USD/person
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            ${statistic.data.participantDonationsTotal}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <CustomTypography variant="body1">
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.monetizationAnalytics.audienceEntryFee"
                            /> - ${statistic.data.audienceEntryFee} USD/person
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            ${statistic.data.audienceFees}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        className={styles.donation}
                    >
                        <CustomTypography variant="body1">
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.monetizationAnalytics.audienceDonation"
                            /> - ${statistic.data.audienceDonationPrice} USD/person
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            ${statistic.data.audienceDonationsTotal}
                        </CustomTypography>
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
        );
    },
);

MonetizationAnalytics.displayName = 'MonetizationAnalytics';

export { MonetizationAnalytics };
