/* eslint-disable react/no-danger */
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import clsx from 'clsx';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CSSProperties, memo, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import { $localUserStore } from 'src/store/roomStores';
import { EmotionIcon } from 'shared-frontend/icons/OtherIcons/EmotionIcon';
import { Zoom } from '@mui/material';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { Emoji } from 'emoji-picker-react';
import { MeetingReactionKind } from 'shared-types';
import { ChatItem } from '../type';
import styles from './MeetingChatItem.module.scss';
import { useBrowserDetect } from 'shared-frontend/hooks/useBrowserDetect';

const Emotions = [
    {
        id: MeetingReactionKind.Like,
        emoji: '1f44d',
    },
    {
        id: MeetingReactionKind.Heart,
        emoji: '2764-fe0f',
    },
    {
        id: MeetingReactionKind.RollingEyes,
        emoji: '1f644',
    },
    {
        id: MeetingReactionKind.Crying,
        emoji: '1f622',
    },
    {
        id: MeetingReactionKind.Smiling,
        emoji: '1f642',
    },
    {
        id: MeetingReactionKind.TearsOfJoy,
        emoji: '1f602',
    },
];

export const positionEmotion = [
    '10px',
    '35px',
    '60px',
    '85px',
    '110px',
    '125px',
];

export const MeetingChatItem = memo(
    ({
        type = 'text',
        body,
        sender,
        isBreak,
        id,
        reactions,
        onReaction,
        onUnReaction,
    }: ChatItem) => {
        const localUser = useStore($localUserStore);

        const parentRef = useRef<any>(null);

        const [showPreview, setShowPreview] = useState(false);
        const [showReaction, setShowReaction] = useState(false);
        const [anchor, setAnchor] = useState(null);

        const isLocal = localUser.id === sender?.id;
        const { isMobile } = useBrowserDetect();

        const handleShowPreview = () => {
            setShowPreview(true);
        };

        const handleHidePreview = () => {
            setShowPreview(false);
            setAnchor(null);
            setShowReaction(false);
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
            handleHidePreview();
        };

        const handleTransformEmotion = (elId: string) => {
            const el = document.getElementById(elId);
            el && el.classList.add(styles.tranformEmotion);
        };

        const handleRemoveTransfromEmotion = (elId: string) => {
            const el = document.getElementById(elId);
            el && el.classList.remove(styles.tranformEmotion);
        };

        const renderEmotions = () => {
            const emotionKeys = Object.keys(reactions) as MeetingReactionKind[];
            if (!emotionKeys.length) return null;

            return (
                <CustomGrid
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                >
                    {emotionKeys.map((item, index) => {
                        const reactionItem = reactions[item];
                        const count = reactionItem?.length ?? 0;
                        const emoji =
                            Emotions.find(emo => emo.id === item)?.emoji ?? '';
                        const style = {
                            '--right': positionEmotion[index],
                        } as CSSProperties;
                        return (
                            <CustomGrid
                                className={clsx(styles.releasedEmotion, {
                                    [styles.active]: reactionItem.includes(
                                        localUser.id,
                                    ),
                                })}
                                key={item}
                                style={style}
                            >
                                <CustomGrid
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    p="2px"
                                    width="100%"
                                    height="100%"
                                >
                                    <Emoji unified={emoji} size={12} />
                                    <div className={styles.emotionCount}>
                                        {count}
                                    </div>
                                </CustomGrid>
                            </CustomGrid>
                        );
                    })}
                </CustomGrid>
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
                            <CustomGrid className={clsx(styles.right, { [styles.mobile]: isMobile })}>
                                <ConditionalRender condition={!isLocal}>
                                    <span className={styles.userName}>
                                        {sender.username}
                                    </span>
                                </ConditionalRender>
                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{
                                        __html: body,
                                    }}
                                />
                                {renderEmotions()}
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
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{
                                        __html: body,
                                    }}
                                />
                                {renderEmotions()}
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
                <ConditionalRender condition={showPreview && isLocal}>
                    <EmotionIcon
                        width="18px"
                        height="18px"
                        onClick={(e: any) => {
                            setShowReaction(true);
                            setAnchor(e.currentTarget);
                        }}
                        className={styles.emotionLeft}
                    />
                </ConditionalRender>
                <CustomPopover
                    id={`reaction-${id}`}
                    open={showReaction}
                    onClose={handleHidePreview}
                    anchorEl={anchor}
                    container={parentRef.current}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Zoom in style={{ borderRadius: '16px' }}>
                        <CustomGrid
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            gap={1}
                            padding={1}
                        >
                            {Emotions.map(item => (
                                <CustomGrid
                                    key={item.id}
                                    id={`emotion-${item.id}`}
                                    onClick={() => handleReaction(item.id)}
                                    onMouseEnter={() =>
                                        handleTransformEmotion(
                                            `emotion-${item.id}`,
                                        )
                                    }
                                    onMouseLeave={() =>
                                        handleRemoveTransfromEmotion(
                                            `emotion-${item.id}`,
                                        )
                                    }
                                    className={clsx(styles.emotion)}
                                >
                                    <Emoji unified={item.emoji} size={27} />
                                </CustomGrid>
                            ))}
                        </CustomGrid>
                    </Zoom>
                </CustomPopover>
                {renderItem()}
                <ConditionalRender condition={showPreview && !isLocal}>
                    <EmotionIcon
                        width="18px"
                        height="18px"
                        onClick={(e: any) => {
                            setShowReaction(true);
                            setAnchor(e.currentTarget);
                        }}
                        className={styles.emotionRight}
                    />
                </ConditionalRender>
            </CustomGrid>
        );
    },
);
