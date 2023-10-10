/* eslint-disable react/no-danger */
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import clsx from 'clsx';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { memo } from 'react';
import { useStore } from 'effector-react';
import { $localUserStore } from 'src/store/roomStores';
import styles from './MeetingChatItem.module.scss';
import { ChatItem } from '../type';

export const MeetingChatItem = memo(
    ({ type = 'text', body, sender, isBreak }: ChatItem) => {
        const localUser = useStore($localUserStore);

        const isLocal = localUser.id === sender?.id;
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
            >
                {renderItem()}
            </CustomGrid>
        );
    },
);
