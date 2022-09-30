import React, { memo, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// stores
import { $appDialogsStore, appDialogsApi } from '../../../store';
import { $meetingUsersStore, $userToKick, removeUserSocketEvent } from '../../../store/roomStores';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './UserToKickDialog.module.scss';

const Component = () => {
    const { userToKickDialog } = useStore($appDialogsStore);
    const userToKick = useStore($userToKick);

    const userData = useStoreMap({
        store: $meetingUsersStore,
        keys: [userToKick],
        fn: (state, [userId]) => state.find(user => user.id === userId),
    });

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.userToKickDialog,
        });
    }, []);

    const handleKickUser = useCallback(() => {
        if (userToKick) removeUserSocketEvent({ id: userToKick });
        handleClose();
    }, [userToKick]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={userToKickDialog}
            onClose={handleClose}
        >
            <CustomGrid container direction="column" alignItems="center" justifyContent="center">
                <CustomTypography variant="h3bold" textAlign="center" className={styles.username}>
                    Kick user {userData?.username}?
                </CustomTypography>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    className={styles.buttonsWrapper}
                    wrap="nowrap"
                >
                    <CustomButton
                        variant="custom-cancel"
                        className={styles.button}
                        onClick={handleClose}
                        nameSpace="meeting"
                        translation="buttons.cancel"
                    />
                    <CustomButton
                        className={styles.button}
                        onClick={handleKickUser}
                        nameSpace="meeting"
                        translation="buttons.kick"
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const UserToKickDialog = memo(Component);
