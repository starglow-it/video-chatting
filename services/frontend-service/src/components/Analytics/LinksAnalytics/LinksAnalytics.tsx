import { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

// shared
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { Translation } from '@library/common/Translation/Translation';

// styles
import { linksStatistics } from 'shared-types';
import styles from './LinksAnalytics.module.scss';

const LinksAnalytics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: linksStatistics;
    }>) => {

        const renderedLinks = useMemo(() => {
            return statistic.data.map(item => {
                return (
                    <CustomGrid
                        key={item.link}
                        item
                        container
                    >
                        <CustomGrid
                            item
                            xs={6}
                        >
                            <CustomTypography variant="body2">
                                {item.link}
                            </CustomTypography>
                        </CustomGrid>
                        <CustomGrid
                            item
                            xs={3}
                        >
                            <CustomTypography variant="body2">
                                {item.click}
                            </CustomTypography>
                        </CustomGrid>
                        <CustomGrid
                            item
                            xs={3}
                            container
                            justifyContent="center"
                        >
                            <CustomTypography variant="body2">
                                { item.clickThroughRate }%
                            </CustomTypography>
                        </CustomGrid>
                    </CustomGrid>
                );
            });
        }, []);

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
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        className={styles.qaTitleWrapper}
                    >
                        <CustomTypography variant="h2">
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.linksAnalytics.title"
                            />
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                    >
                        <CustomGrid
                            item
                            xs={6}
                        ></CustomGrid>
                        <CustomGrid
                            item
                            xs={3}
                        >
                            <CustomTypography variant="body2bold">
                                <Translation
                                    nameSpace="common"
                                    translation="statistics.users.linksAnalytics.clicks"
                                />
                            </CustomTypography>
                        </CustomGrid>
                        <CustomGrid
                            item
                            xs={3}
                        >
                            <CustomTypography variant="body2bold">
                                <Translation
                                    nameSpace="common"
                                    translation="statistics.users.linksAnalytics.clickThroughRate"
                                />
                            </CustomTypography>
                        </CustomGrid>
                    </CustomGrid>
                    {renderedLinks}
                </CustomGrid>
            </CustomPaper>
        );
    },
);

LinksAnalytics.displayName = 'LinksAnalytics';

export { LinksAnalytics };
