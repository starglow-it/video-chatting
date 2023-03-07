import {
    memo, useCallback
} from 'react';
import { useStore } from 'effector-react';

// shared
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';

// types
import { AdminDialogsEnum } from '../../../store/types';

// styles
import styles from './ConfirmSaveChangesDialog.module.scss';

// stores
import {
    $commonTemplateStore,
    $saveRoomChangesDialogStore,
    closeAdminDialogEvent,
} from '../../../store';

const Component = ({ onConfirm }: { onConfirm: () => void }) => {
    const {
        state: commonTemplate
    } = useStore($commonTemplateStore);

    const saveChangesDialogStore = useStore($saveRoomChangesDialogStore);

    const handleClose = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.saveRoomChangesDialog);
    }, []);

    const handleSaveChanges = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.saveRoomChangesDialog);
        onConfirm?.();
    }, [onConfirm]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={saveChangesDialogStore}
        >
            <CustomTypography variant="h3bold">
                <Translation
                    nameSpace="rooms"
                    translation={commonTemplate?.isPublic
                        ? "saveChanges.title"
                        : "savePublishedChanges.title"
                    }
                />
            </CustomTypography>

            {!commonTemplate?.isPublic
                ? (
                    <CustomTypography textAlign="center">
                        <Translation
                            nameSpace="rooms"
                            translation="savePublishedChanges.text"
                        />
                    </CustomTypography>
                )
                : null
            }
            <ButtonsGroup className={styles.buttons}>
                <CustomButton
                    variant="custom-cancel"
                    onClick={handleClose}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.cancel"
                        />
                    }
                />
                <CustomButton
                    onClick={handleSaveChanges}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.save"
                        />
                    }
                />
            </ButtonsGroup>
        </CustomDialog>
    );
};

export const ConfirmSaveChangesDialog = memo(Component);
