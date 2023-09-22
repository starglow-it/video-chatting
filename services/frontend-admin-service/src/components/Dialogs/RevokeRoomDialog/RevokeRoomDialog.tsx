import { memo, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// shared
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';

// components
import { Translation } from '@components/Translation/Translation';
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';

import {
    $activeTemplateIdStore,
    $commonTemplates,
    $revokeRoomDialogStore,
    addNotificationEvent,
    closeAdminDialogEvent,
    setActiveTemplateIdEvent,
    updateCommonTemplateFx,
} from '../../../store';

import { AdminDialogsEnum, NotificationType } from '../../../store/types';

import styles from './RevokeRoomDialog.module.scss';

const Component = () => {
    const activeTemplateId = useStore($activeTemplateIdStore);
    const revokeRoomDialog = useStore($revokeRoomDialogStore);

    const templateData = useStoreMap({
        store: $commonTemplates,
        keys: [activeTemplateId],
        fn: (state, [templateId]) =>
            state.state.list.find(template => template.id === templateId),
    });

    const handleClose = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.revokeRoomDialog);
        setActiveTemplateIdEvent(null);
    }, []);

    const handleRevokeRoom = useCallback(async () => {
        if (templateData?.id) {
            await updateCommonTemplateFx({
                templateId: templateData.id,
                data: {
                    draft: true,
                    isPublic: false,
                },
            });

            closeAdminDialogEvent(AdminDialogsEnum.revokeRoomDialog);
            setActiveTemplateIdEvent(null);

            addNotificationEvent({
                type: NotificationType.roomRevoked,
                message: 'templates.revoked',
                messageOptions: {
                    templateName: templateData?.name,
                },
            });
        }
    }, [templateData?.name]);

    return (
        <CustomDialog contentClassName={styles.content} open={revokeRoomDialog}>
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <CustomTypography variant="h4bold">
                    <Translation
                        nameSpace="rooms"
                        translation="revokeRoomDialog.title"
                    />
                </CustomTypography>

                <CustomTypography textAlign="center">
                    <Translation
                        nameSpace="rooms"
                        translation="revokeRoomDialog.text"
                    />
                </CustomTypography>

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
                        variant="custom-danger"
                        onClick={handleRevokeRoom}
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.revoke"
                            />
                        }
                    />
                </ButtonsGroup>
            </CustomGrid>
        </CustomDialog>
    );
};

export const RevokeRoomDialog = memo(Component);
