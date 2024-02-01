import { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

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
import { AttendeesNumbers } from 'shared-types';
import styles from './ReactionsAnalytics.module.scss';

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
                                translation="statistics.users.reactionAnalytics.title"
                            />
                        </CustomTypography>
                        <CustomTypography variant="body1">
                            {statistic.totalNumber}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <BorderLinearProgress variant="determinate" value={(statistic.participantsAvgMin / 60) * 100} bgColor="#9243B7" />
                        <CustomTypography variant="body3">
                            {statistic.participantsAvgMin}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <BorderLinearProgress variant="determinate" value={(statistic.audienceAvgMin / 60) * 100} bgColor="#27C54A" />
                        <CustomTypography variant="body3">
                            {statistic.audienceAvgMin}
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
                        <CustomGrid item xs={6} container className={styles.reactionWrapper}>
                            <CustomGrid item xs={4}>
                                <CustomTypography variant="h2" fontSize='30px'>
                                    💖
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid
                                item
                                xs={8}
                                container
                                direction="column"
                            >
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.participants"
                                    /> - {statistic.participants}
                                </CustomTypography>
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.audience"
                                    /> - {statistic.audience}
                                </CustomTypography>
                            </CustomGrid>
                        </CustomGrid>
                        <CustomGrid item xs={6} container className={styles.reactionWrapper}>
                            <CustomGrid item xs={4}>
                                <CustomTypography variant="h2" fontSize='30px'>
                                🙏
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid
                                item
                                xs={8}
                                container
                                direction="column"
                            >
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.participants"
                                    /> - {statistic.participants}
                                </CustomTypography>
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.audience"
                                    /> - {statistic.audience}
                                </CustomTypography>
                            </CustomGrid>
                        </CustomGrid>
                        <CustomGrid item xs={6} container className={styles.reactionWrapper}>
                            <CustomGrid item xs={4}>
                                <CustomTypography variant="h2" fontSize='30px'>
                                🤯
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid
                                item
                                xs={8}
                                container
                                direction="column"
                            >
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.participants"
                                    /> - {statistic.participants}
                                </CustomTypography>
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.audience"
                                    /> - {statistic.audience}
                                </CustomTypography>
                            </CustomGrid>
                        </CustomGrid>
                        <CustomGrid item xs={6} container className={styles.reactionWrapper}>
                            <CustomGrid item xs={4}>
                                <CustomTypography variant="h2" fontSize='30px'>
                                😍
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid
                                item
                                xs={8}
                                container
                                direction="column"
                            >
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.participants"
                                    /> - {statistic.participants}
                                </CustomTypography>
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.audience"
                                    /> - {statistic.audience}
                                </CustomTypography>
                            </CustomGrid>
                        </CustomGrid>
                        <CustomGrid item xs={6} container className={styles.reactionWrapper}>
                            <CustomGrid item xs={4}>
                                <CustomTypography variant="h2" fontSize='30px'>
                                🔥
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid
                                item
                                xs={8}
                                container
                                direction="column"
                            >
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.participants"
                                    /> - {statistic.participants}
                                </CustomTypography>
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.audience"
                                    /> - {statistic.audience}
                                </CustomTypography>
                            </CustomGrid>
                        </CustomGrid>
                        <CustomGrid item xs={6} container className={styles.reactionWrapper}>
                            <CustomGrid item xs={4}>
                                <CustomTypography variant="h2" fontSize='30px'>
                                👏
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid
                                item
                                xs={8}
                                container
                                direction="column"
                            >
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.participants"
                                    /> - {statistic.participants}
                                </CustomTypography>
                                <CustomTypography variant="body3">
                                    <Translation
                                        nameSpace="common"
                                        translation="statistics.users.reactionAnalytics.audience"
                                    /> - {statistic.audience}
                                </CustomTypography>
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
        );
    },
);

ReactionsAnalytics.displayName = 'ReactionsAnalytics';

export { ReactionsAnalytics };
