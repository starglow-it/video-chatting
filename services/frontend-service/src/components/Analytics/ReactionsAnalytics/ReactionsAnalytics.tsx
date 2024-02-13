import { memo, useEffect, useState } from 'react';

// shared
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

//@mui
import { styled } from '@mui/system';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { Translation } from '@library/common/Translation/Translation';

// styles
import styles from './ReactionsAnalytics.module.scss';

//const
import { AVAILABLE_REACTIONS } from '../../../const/meeting';
import { ReactionStatistics } from 'shared-types';

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

const ReactionsAnalytics = memo(
    ({
        className,
        statistic,
    }: PropsWithClassName<{
        statistic: ReactionStatistics;
    }>) => {
        const [statisticsData, setStatisticsData] = useState([]);

        useEffect(() => {
            setStatisticsData(statistic.reactions);
        }, [statistic]);

        const renderEmojiIcon = (emojiName: string) => {
            const emoji = AVAILABLE_REACTIONS.find(reaction => reaction.text === emojiName);

            return (
                <div className={styles.emojiBox}>
                    <img className={styles.emojiBtn} src={emoji.icon} data-key={emoji.text} height="30" />
                </div>
            );
        };

        const renderPopularReactions = () => {
            const reactions = statisticsData.sort((prev, next) => next.totalReactions - prev.totalReactions).slice(0, 6);
            return reactions.map(reaction => (
                <CustomGrid item xs={6} container className={styles.reactionWrapper} key={reaction.reactionName}>
                    <CustomGrid item xs={4}>
                        {renderEmojiIcon(reaction.reactionName)}
                    </CustomGrid>
                    <CustomGrid
                        item
                        xs={8}
                        container
                        direction="column"
                    >
                        <CustomTypography variant="body3" className={styles.popularReactionsText}>
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.reactionAnalytics.participants"
                            /> - {reaction.participantsNum}
                        </CustomTypography>
                        <CustomTypography variant="body3" className={styles.popularReactionsText}>
                            <Translation
                                nameSpace="common"
                                translation="statistics.users.reactionAnalytics.audience"
                            /> - {reaction.audienceNum}
                        </CustomTypography>
                    </CustomGrid>
                </CustomGrid>
            ));
        };

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
                                translation="statistics.users.reactionAnalytics.title"
                            />
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            {statistic.total}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <BorderLinearProgress
                            variant="determinate"
                            value={(statistic.participants / (statistic.participants + statistic.audiences)) * 100}
                            bgColor="#9243B7"
                        />
                        <CustomTypography variant="body3">
                            {statistic.participants}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <BorderLinearProgress
                            variant="determinate"
                            value={(statistic.audiences / (statistic.participants + statistic.audiences)) * 100}
                            bgColor="#27C54A"
                        />
                        <CustomTypography variant="body3">
                            {statistic.audiences}
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
                                translation="statistics.users.reactionAnalytics.popular"
                            />
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                    >
                        {renderPopularReactions()}
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
        );
    },
);

ReactionsAnalytics.displayName = 'ReactionsAnalytics';

export { ReactionsAnalytics };
