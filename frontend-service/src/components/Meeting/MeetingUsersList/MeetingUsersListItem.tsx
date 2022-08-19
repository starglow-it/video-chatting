import React, { memo } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { CloseIcon } from '@library/icons/CloseIcon';
import { AcceptIcon } from '@library/icons/AcceptIcon';
import { HostIcon } from '@library/icons/HostIcon';

// stores
import { $isMeetingHostStore } from '../../../store';

// types
import { MeetingUsersListItemProps } from './types';

// styles
import styles from './MeetingUsersList.module.scss';

const MeetingUsersListItem = memo(
    ({
        user,
        isAcceptRequest = false,
        onAcceptUser,
        onDeleteUser,
        onChangeHost,
        isLocalItem,
        isOwnerItem,
    }: MeetingUsersListItemProps) => {
        const isMeetingHost = useStore($isMeetingHostStore);

        const handleAcceptRequest = () => {
            onAcceptUser?.({ userId: user.id });
        };

        const handleDeleteRequest = () => {
            onDeleteUser?.({ userId: user.id });
        };

        const handleChangeHost = () => {
            onChangeHost?.({ userId: user.id });
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
                <CustomGrid className={styles.btnGroup} gap={1} container wrap="nowrap">
                    <ConditionalRender condition={isAcceptRequest}>
                        <ActionButton
                            variant="accept"
                            onAction={handleAcceptRequest}
                            className={styles.acceptUser}
                            Icon={<AcceptIcon width="23px" height="23px" />}
                        />
                    </ConditionalRender>

                    <ConditionalRender
                        condition={!isLocalItem && !isAcceptRequest && isMeetingHost}
                    >
                        <ActionButton
                            variant="decline"
                            onAction={handleChangeHost}
                            className={styles.deleteUser}
                            Icon={<HostIcon width="23px" height="23px" />}
                        />
                    </ConditionalRender>

                    <ConditionalRender
                        condition={Boolean(!isLocalItem && onDeleteUser && !isOwnerItem)}
                    >
                        <ActionButton
                            variant="decline"
                            onAction={handleDeleteRequest}
                            className={styles.deleteUser}
                            Icon={<CloseIcon width="23px" height="23px" />}
                        />
                    </ConditionalRender>
                </CustomGrid>
            </CustomGrid>
        );
    },
);

export { MeetingUsersListItem };
