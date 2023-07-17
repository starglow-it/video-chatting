import React, { memo, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

// store
import { Translation } from '@library/common/Translation/Translation';
import {
    $appDialogsStore,
    appDialogsApi,
    $deleteProfileTemplateId,
    deleteProfileTemplateFx,
    getProfileTemplateFx,
    $profileStore,
    $profileTemplatesStore,
} from '../../../store';

// styles
import styles from './DeleteTemplateDialog.module.scss';

// types
import { AppDialogsEnum } from '../../../store/types';

const Component = () => {
    const { deleteTemplateDialog } = useStore($appDialogsStore);
    const deleteProfileTemplateId = useStore($deleteProfileTemplateId);
    const profile = useStore($profileStore);
    const isGetProfileTemplatePending = useStore(getProfileTemplateFx.pending);

    const templateToDelete = useStoreMap({
        store: $profileTemplatesStore,
        keys: [deleteProfileTemplateId],
        fn: (state, [templateId]) =>
            state?.list
                ? state.list.find(template => template.id === templateId)
                : null,
    });

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.deleteTemplateDialog,
        });
    }, []);

    const handleDeleteTemplate = useCallback(async () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.deleteTemplateDialog,
        });

        await deleteProfileTemplateFx({
            templateId: deleteProfileTemplateId,
        });
    }, [deleteProfileTemplateId]);

    if (isGetProfileTemplatePending) {
        return (
            <CustomDialog
                open={deleteTemplateDialog}
                contentClassName={styles.content}
                onBackdropClick={handleClose}
                onClose={handleClose}
            >
                <CustomLoader />
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
            <CustomGrid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <CustomTypography
                    variant="h4bold"
                    nameSpace="templates"
                    translation="deleteTemplate.title"
                />

                {profile.id === templateToDelete?.author &&
                templateToDelete?.isPublic ? (
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
                        className={styles.button}
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
                        className={styles.button}
                        onClick={handleDeleteTemplate}
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.delete"
                            />
                        }
                        variant="custom-danger"
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const DeleteTemplateDialog = memo(Component);
