import { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

// shared
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { Translation } from '@library/common/Translation/Translation';

// styles
import { qaStatistics } from 'shared-types';
import styles from './QAAnalytics.module.scss';

const QAAnalytics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: qaStatistics;
    }>) => {

        const renderedQuestions = useMemo(() => {
            return statistic.data.questions.map((q, index) => {
                return (
                    <CustomGrid
                        key={index}
                        item
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        className={styles.questionList}
                    >
                        <CustomGrid item container alignItems="center" className={styles.attendeesDescWrapper}>
                            <CustomTypography variant="body2">
                                {q.content}
                            </CustomTypography>
                        </CustomGrid>
                        <CustomTypography variant="body2">
                            {q.who}
                        </CustomTypography>
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
                        justifyContent="space-between"
                        className={styles.qaTitleWrapper}
                    >
                        <CustomGrid
                            item
                            xs={7}
                            container
                        >
                            <CustomTypography variant="h2">
                                <Translation
                                    nameSpace="common"
                                    translation="statistics.users.qaAnalytics.title"
                                />
                            </CustomTypography>
                        </CustomGrid>
                        <CustomGrid
                            item
                            xs={5}
                            container
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <CustomGrid
                                item
                                container
                                alignItems="center"
                                justifyContent="center"
                                direction="column"
                                className={styles.questionsNumWrapper}
                            >
                                <CustomTypography variant="h2">
                                    {statistic.data.questions ? statistic.data.questions.length : 0}
                                </CustomTypography>
                                <CustomTypography variant="body2">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.qaAnalytics.questions"
                                    />
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid
                                item
                                container
                                alignItems="center"
                                justifyContent="center"
                                direction="column"
                                className={styles.questionsNumWrapper}
                            >
                                <CustomTypography variant="h2">
                                    {statistic.data.questions &&
                                        statistic.data.questions.filter(q => q.answered).length
                                    }
                                </CustomTypography>
                                <CustomTypography variant="body2">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.qaAnalytics.answered"
                                    />
                                </CustomTypography>
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                    {renderedQuestions}
                </CustomGrid>
            </CustomPaper>
        );
    },
);

QAAnalytics.displayName = 'QAAnalytics';

export { QAAnalytics };
