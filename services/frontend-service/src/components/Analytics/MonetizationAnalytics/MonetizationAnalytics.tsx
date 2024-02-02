import { memo, useMemo } from 'react';

// shared
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';


import { Translation } from '@library/common/Translation/Translation';

// styles
import { linksStatistics } from 'shared-types';
import styles from './MonetizationAnalytics.module.scss';

const MonetizationAnalytics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: linksStatistics;
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
                        justifyContent="flex-start"
                        className={styles.qaTitleWrapper}
                    >
                        <CustomTypography variant="h2">
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.monetizationAnalytics.title"
                            />
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
                                translation="statistics.users.monetizationAnalytics.entryFees"
                            /> - ${statistic.data.entryFee} USD/person
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            ${statistic.data.total}
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
                                translation="statistics.users.monetizationAnalytics.donations"
                            />
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            ${statistic.data.donations}
                        </CustomTypography>
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
        );
    },
);

MonetizationAnalytics.displayName = 'MonetizationAnalytics';

export { MonetizationAnalytics };
