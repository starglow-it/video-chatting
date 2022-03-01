import React, { memo } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { DeleteIcon } from '@library/icons/DeleteIcon';
import { AcceptIcon } from '@library/icons/AcceptIcon';

import { MeetingUsersListItemProps } from './types';

import styles from './MeetingUsersList.module.scss';

const MeetingUsersListItem = memo(
    ({
        user,
        isAcceptRequest,
        onAcceptUser,
        onDeleteUser,
        isLocalItem,
    }: MeetingUsersListItemProps) => {
        const handleAcceptRequest = () => {
            onAcceptUser?.({ userId: user.id });
        };

        const handleDeleteRequest = () => {
            onDeleteUser?.({ userId: user.id });
        };

        return (
            <CustomGrid className={styles.userItem} container alignItems="center" wrap="nowrap">
                <ProfileAvatar
                    className={styles.profileAvatar}
                    src={user?.profileAvatar}
                    width="32px"
                    height="32px"
                    userName={user.username}
                />
                <CustomTypography className={styles.userName} color="common.white">
                    {user.username}
                </CustomTypography>
                <CustomGrid className={styles.btnGroup} container wrap="nowrap">
                    {isAcceptRequest && (
                        <ActionButton
                            onAction={handleAcceptRequest}
                            className={styles.acceptUser}
                            Icon={<AcceptIcon width="23px" height="23px" />}
                        />
                    )}
                    {!isLocalItem && onDeleteUser && (
                        <ActionButton
                            onAction={handleDeleteRequest}
                            className={styles.deleteUser}
                            Icon={<DeleteIcon width="23px" height="23px" />}
                        />
                    )}
                </CustomGrid>
            </CustomGrid>
        );
    },
);

export { MeetingUsersListItem };
