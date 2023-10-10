/* eslint-disable react/no-danger */
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import clsx from 'clsx';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { memo } from 'react';
import styles from './MeetingChatItem.module.scss';
import { ChatItem } from '../type';

export const MeetingChatItem = memo(({
    type = 'text',
    isLocal = false,
}: ChatItem) => {
    const renderItem = () => {
        switch (type) {
            case 'time':
                return <CustomGrid className={styles.time}>08:00</CustomGrid>;

            case 'text':
                return (
                    <CustomGrid className={styles.main}>
                        <ConditionalRender condition={!isLocal}>
                            <ProfileAvatar
                                userName="Duy"
                                width="25px"
                                height="25px"
                                className={styles.avatar}
                            />
                        </ConditionalRender>
                        <CustomGrid className={styles.right}>
                            <span className={styles.userName}>Duy nè</span>
                            <div
                                className={styles.content}
                                dangerouslySetInnerHTML={{
                                    __html: `Nhìn cái chó gì?`,
                                }}
                            />
                        </CustomGrid>
                    </CustomGrid>
                );
            case 'recently':
                return (
                    <CustomGrid className={clsx(styles.main, styles.recently)}>
                        <CustomGrid className={styles.right}>
                            <div
                                className={styles.content}
                                dangerouslySetInnerHTML={{
                                    __html: `Thích nhìn không`,
                                }}
                            />
                        </CustomGrid>
                    </CustomGrid>
                );
            default:
                return null;
        }
    };

    return (
        <CustomGrid
            className={clsx(styles.containter, {
                [styles.myMessage]: isLocal,
                [styles.yourMessage]: !isLocal,
            })}
        >
            {renderItem()}
        </CustomGrid>
    );
});
