import {memo, useCallback} from "react";
import {useStore, useStoreMap} from "effector-react";

// components
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {Translation} from "@components/Translation/Translation";
import {ButtonsGroup} from "@components/ButtonsGroup/ButtonsGroup";
import {CustomButton} from "shared-frontend/library/custom/CustomButton";
import {CustomDialog} from "shared-frontend/library/custom/CustomDialog";

import {
    $activeTemplateIdStore,
    $commonTemplates,
    $confirmDeleteRoomDialogStore,
    closeAdminDialogEvent,
    deleteCommonTemplateFx,
    setActiveTemplateIdEvent
} from "../../../store";

// types
import {AdminDialogsEnum} from "../../../store/types";

// styles
import styles from "./ConfirmDeleteRoomDialog.module.scss";

const ConfirmDeleteRoomDialog = memo(() => {
    const confirmDeleteRoomDialog = useStore($confirmDeleteRoomDialogStore);
    const activeTemplateId = useStore($activeTemplateIdStore);

    const templateData = useStoreMap({
        store: $commonTemplates,
        keys: [activeTemplateId],
        fn: (state, [templateId]) =>
            state.state.list.find(template => template.id === templateId),
    });

    const handleClose = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.confirmDeleteRoomDialog);
        setActiveTemplateIdEvent(null);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.confirmDeleteRoomDialog);
        deleteCommonTemplateFx({
        	templateId: templateData?.id,
        });
        setActiveTemplateIdEvent(null);
    }, [templateData?.id]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={confirmDeleteRoomDialog}
        >
            <CustomTypography variant="h3bold">
                <Translation
                    nameSpace="rooms"
                    translation="confirmDeleteRoom.title"
                />
            </CustomTypography>

            <CustomTypography textAlign="center">
                <Translation
                    nameSpace="rooms"
                    translation="confirmDeleteRoom.text"
                    options={{
                        roomName: templateData?.name
                    }}
                />
            </CustomTypography>
            <ButtonsGroup className={styles.buttons}>
                <CustomButton
                    onClick={handleClose}
                    variant="custom-cancel"
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.cancel"
                        />
                    }
                />
                <CustomButton
                    variant="custom-danger"
                    onClick={handleConfirmDelete}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.delete"
                        />
                    }
                />
            </ButtonsGroup>
        </CustomDialog>
    )
})

export { ConfirmDeleteRoomDialog };