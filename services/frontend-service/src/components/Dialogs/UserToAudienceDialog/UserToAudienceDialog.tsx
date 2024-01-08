import { memo, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// stores
import { Translation } from '@library/common/Translation/Translation';
import { $appDialogsStore, appDialogsApi } from '../../../store';
import {
    $meetingStore,
    $meetingUsersStore,
    $moveUserToAudience,
    requestSwitchRoleFromParticipantToAudienceByHostEvent
} from '../../../store/roomStores';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './UserToAudienceDialog.module.scss';

const Component = () => {
    const { userToAudienceDialog } = useStore($appDialogsStore);
    const moveUserToAudience = useStore($moveUserToAudience);
    const meeting = useStore($meetingStore);

    const userData = useStoreMap({
        store: $meetingUsersStore,
        keys: [moveUserToAudience],
        fn: (state, [userId]) => state.find(user => user.id === userId),
    });

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.userToAudienceDialog,
        });
    }, []);

    const handleMoveToAudience = useCallback(() => {
        if (moveUserToAudience) {
            
            requestSwitchRoleFromParticipantToAudienceByHostEvent({
                meetingId: meeting.id,
                meetingUserId: moveUserToAudience,
            });
        }
        handleClose();
    }, [moveUserToAudience]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={userToAudienceDialog}
            onClose={handleClose}
        >
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <CustomTypography
                    variant="h3bold"
                    textAlign="center"
                    className={styles.username}
                >
                    Move user {userData?.username} to audience?
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
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="buttons.cancel"
                            />
                        }
                    />
                    <CustomButton
                        className={styles.button}
                        onClick={handleMoveToAudience}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="buttons.move"
                            />
                        }
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const UserToAudienceDialog = memo(Component);
