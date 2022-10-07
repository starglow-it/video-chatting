import React, { memo, useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';

// store
import {
    $appDialogsStore,
    appDialogsApi,
    $deleteProfileTemplateId,
    deleteProfileTemplateFx,
    getProfileTemplateFx,
    $profileTemplateStore,
    $profileStore,
} from '../../../store';

// styles
import styles from './DeleteTemplateDialog.module.scss';

// types
import { AppDialogsEnum } from '../../../store/types';

const Component = () => {
    const { deleteTemplateDialog } = useStore($appDialogsStore);
    const deleteProfileTemplateId = useStore($deleteProfileTemplateId);
    const profileTemplateToDelete = useStore($profileTemplateStore);
    const profile = useStore($profileStore);
    const isGetProfileTemplatePending = useStore(getProfileTemplateFx.pending);

    useEffect(() => {
        if (deleteProfileTemplateId) {
            getProfileTemplateFx({ templateId: deleteProfileTemplateId });
        }
    }, [deleteProfileTemplateId]);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.deleteTemplateDialog,
        });
    }, []);

    const handleDeleteTemplate = useCallback(async () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.deleteTemplateDialog,
        });

        await deleteProfileTemplateFx({ templateId: deleteProfileTemplateId });
    }, [deleteProfileTemplateId]);

    if (isGetProfileTemplatePending) {
        return (
            <CustomDialog
                open={deleteTemplateDialog}
                contentClassName={styles.content}
                onBackdropClick={handleClose}
                onClose={handleClose}
            >
                <WiggleLoader />
            </CustomDialog>
        );
    }

    return (
        <CustomDialog
            open={deleteTemplateDialog}
            contentClassName={styles.content}
            onBackdropClick={handleClose}
            onClose={handleClose}
        >
            <CustomGrid container direction="column" justifyContent="center" alignItems="center">
                <CustomTypography
                    variant="h4"
                    nameSpace="templates"
                    translation="deleteTemplate.title"
                />

                {profile.id === profileTemplateToDelete?.author &&
                profileTemplateToDelete.isPublic ? (
                    <CustomTypography
                        nameSpace="templates"
                        translation="deleteTemplate.textPublicTemplate"
                        variant="body2"
                        className={styles.text}
                    />
                ) : (
                    <CustomTypography
                        nameSpace="templates"
                        translation="deleteTemplate.text"
                        className={styles.text}
                    />
                )}
                <CustomGrid container wrap="nowrap" gap={2}>
                    <CustomButton
                        variant="custom-cancel"
                        onClick={handleClose}
                        nameSpace="common"
                        translation="buttons.cancel"
                    />
                    <CustomButton
                        onClick={handleDeleteTemplate}
                        nameSpace="common"
                        translation="buttons.delete"
                        variant="custom-danger"
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const DeleteTemplateDialog = memo(Component);
