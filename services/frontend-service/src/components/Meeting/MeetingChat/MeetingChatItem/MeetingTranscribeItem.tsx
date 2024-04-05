/* eslint-disable react/no-danger */
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import clsx from 'clsx';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { memo, useState } from 'react';
import { useStore } from 'effector-react';
import { $localUserStore } from 'src/store/roomStores';
import styles from './MeetingTranscriptItem.module.scss';

export const positionEmotion = [
    '10px',
    '35px',
    '60px',
    '85px',
    '110px',
    '125px',
];

export const MeetingTranscribeItem = memo(
    ({
        type = 'text',
        body,
        sender,
        isBreak,
    }: any) => {
        const localUser = useStore($localUserStore);

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
                                        {body.split('@')[0] || sender.username}
                                    </span>
                                </ConditionalRender>
                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{
                                        __html: body.split('@')[1],
                                    }}
                                />
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
            </CustomGrid>
        );
    },
);
