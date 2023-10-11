/* eslint-disable react/no-danger */
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import clsx from 'clsx';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CSSProperties, memo, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import { $localUserStore } from 'src/store/roomStores';
import { EmojiIcon } from 'shared-frontend/icons/OtherIcons/EmojiIcon';
import styles from './MeetingChatItem.module.scss';
import { ChatItem } from '../type';
import { Zoom } from '@mui/material';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { Emoji } from 'emoji-picker-react';
import { MeetingReactionKind } from 'shared-types';

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

export const positionEmotion = ['10px', '16px', '22px', '28px', '34px', '40px'];

export const MeetingChatItem = memo(
    ({
        type = 'text',
        body,
        sender,
        isBreak,
        id,
        reactionsCount,
        onReaction,
    }: ChatItem) => {
        const localUser = useStore($localUserStore);

        const parentRef = useRef<any>(null);

        const [showPreview, setShowPreview] = useState(false);
        const [showReaction, setShowReaction] = useState(false);
        const [anchor, setAnchor] = useState(null);

        const isLocal = localUser.id === sender?.id;

        const handleShowPreview = () => {
            setShowPreview(true);
        };

        const handleHidePreview = () => {
            setShowPreview(false);
            setAnchor(null);
            setShowReaction(false);
        };

        const handleReaction = (kind: MeetingReactionKind) => {
            onReaction?.(id, kind);
        };

        const renderEmotions = () => {
            if(!Object.keys(reactionsCount).length) return null;

            const emotions = Array.from(
                reactionsCount.keys(),
            ) as MeetingReactionKind[];

            return emotions.map((item, index) => {
                const count = reactionsCount.get(item) ?? 0;
                const emoji =
                    Emotions.find(emo => emo.id === item)?.emoji ?? '';
                const style = {
                    '--right': positionEmotion[index],
                } as CSSProperties;
                return (
                    <CustomGrid
                        className={styles.releasedEmotion}
                        key={item}
                        style={style}
                    >
                        <Emoji unified={emoji} size={15} />
                        {count > 1 && <span>{count}</span>}
                    </CustomGrid>
                );
            });
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
                                <span className={styles.userName}>
                                    {sender.username}
                                </span>
                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{
                                        __html: body,
                                    }}
                                />
                            </CustomGrid>
                            {renderEmotions()}
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
                            </CustomGrid>
                            <CustomGrid className={styles.releasedEmotion}>
                                <Emoji unified="1f602" size={15} />
                            </CustomGrid>
                            {renderEmotions()}
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
                    <EmojiIcon
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
                    <Zoom in>
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
                                    onClick={() => handleReaction(item.id)}
                                >
                                    <Emoji unified={item.emoji} size={27} />
                                </CustomGrid>
                            ))}
                        </CustomGrid>
                    </Zoom>
                </CustomPopover>
                {renderItem()}
                <ConditionalRender condition={showPreview && !isLocal}>
                    <EmojiIcon
                        width="18px"
                        height="18px"
                        // onClick={openPicker}
                        className={styles.emotionRight}
                    />
                </ConditionalRender>
            </CustomGrid>
        );
    },
);
