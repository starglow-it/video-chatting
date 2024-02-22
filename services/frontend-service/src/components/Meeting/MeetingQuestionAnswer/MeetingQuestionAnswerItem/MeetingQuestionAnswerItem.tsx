/* eslint-disable react/no-danger */
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import clsx from 'clsx';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { memo, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { $localUserStore } from 'src/store/roomStores';
import { MeetingReactionKind } from 'shared-types';
import { QuestionAnswerItem } from '../type';
import styles from './MeetingQuestionAnswerItem.module.scss';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

export const MeetingQuestionAnswerItem = memo(
    ({
        type = 'text',
        body,
        sender,
        isBreak,
        id,
        reactions,
        onReaction,
        onUnReaction,
    }: QuestionAnswerItem) => {
        const localUser = useStore($localUserStore);

        const [showPreview, setShowPreview] = useState(false);
        const [isReaction, setIsReaction] = useState(false);

        useEffect(() => {
            const emotionKeys = Object.keys(reactions) as MeetingReactionKind[];
            setIsReaction(emotionKeys.length > 0);
        }, [reactions])

        const isLocal = localUser.id === sender?.id;

        const handleShowPreview = () => {
            setShowPreview(true);
        };

        const handleHidePreview = () => {
            setShowPreview(false);
        };

        const handleReaction = (kind: MeetingReactionKind) => {
            const kindReactions = reactions[kind] ?? [];
            const hasReaction = kindReactions.find(
                item => item === localUser.id,
            );
            if (hasReaction) {
                onUnReaction?.(id, kind);
            } else {
                onReaction?.(id, kind);
            }
        };

        const renderEmotions = () => {
            const emotionKeys = Object.keys(reactions) as MeetingReactionKind[];
            if (!emotionKeys.length) return null;

            return (
                <CustomBox className={styles.questionMarked} >
                    <span
                        onClick={(e: any) => {
                            handleReaction(MeetingReactionKind.Like)
                        }}
                        className={clsx(styles.emotionRight, styles.reactionMark)}
                    >✓</span>
                </CustomBox>
            );
        };

        const renderItem = () => {
            switch (type) {
                case 'text':
                    return (
                        <CustomGrid className={styles.main}>
                            <ConditionalRender condition={!isLocal}>
                                <ProfileAvatar
                                    userName={sender?.username}
                                    width="25px"
                                    height="25px"
                                    className={styles.avatar}
                                />
                            </ConditionalRender>
                            <CustomGrid className={styles.right}>
                                <ConditionalRender condition={!isLocal}>
                                    <span className={styles.userName}>
                                        {sender.username} - {sender.meetingRole}
                                    </span>
                                </ConditionalRender>
                                <div
                                    className={clsx(styles.content, {
                                        [styles.grey]: isReaction,
                                    })}
                                    dangerouslySetInnerHTML={{
                                        __html: body,
                                    }}
                                />
                                <ConditionalRender condition={isLocal}>
                                    {renderEmotions()}
                                </ConditionalRender>
                            </CustomGrid>
                        </CustomGrid>
                    );
                case 'recently':
                    return (
                        <CustomGrid
                            className={clsx(styles.main, styles.recently)}
                        >
                            <CustomGrid className={styles.right}>
                                <div
                                    className={clsx(styles.content, {
                                        [styles.grey]: isReaction,
                                    })}
                                    dangerouslySetInnerHTML={{
                                        __html: body,
                                    }}
                                />
                                <ConditionalRender condition={isLocal}>
                                    {renderEmotions()}
                                </ConditionalRender>
                            </CustomGrid>
                        </CustomGrid>
                    );
                default:
                    return null;
            }
        };

        if (type === 'time') {
            return <CustomGrid className={styles.time}>{body}</CustomGrid>;
        }

        return (
            <CustomGrid
                className={clsx(styles.containter, {
                    [styles.myMessage]: isLocal,
                    [styles.yourMessage]: !isLocal,
                    [styles.break]: isBreak,
                })}
                onMouseEnter={handleShowPreview}
                onMouseLeave={handleHidePreview}
            >
                {renderItem()}
                <ConditionalRender condition={showPreview && !isLocal && !isReaction}>
                    <span
                        onClick={(e: any) => {
                            handleReaction(MeetingReactionKind.Like)
                        }}
                        className={clsx(styles.emotionRight, styles.reactionButton)}
                    >✓</span>
                </ConditionalRender>
                <ConditionalRender condition={showPreview && !isLocal && isReaction}>
                    <span
                        onClick={(e: any) => {
                            handleReaction(MeetingReactionKind.Like)
                        }}
                        className={clsx(styles.emotionRight, styles.reactionButton, styles.xBtn)}
                    >
                        &times;
                    </span>
                </ConditionalRender>
            </CustomGrid>
        );
    },
);
