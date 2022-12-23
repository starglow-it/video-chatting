import {memo, useCallback} from "react";
import { useStore } from "effector-react";

import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {Translation} from "@components/Translation/Translation";
import {ButtonsGroup} from "@components/ButtonsGroup/ButtonsGroup";
import {CustomButton} from "shared-frontend/library/custom/CustomButton";
import {CustomDialog} from "shared-frontend/library/custom/CustomDialog";

import {$confirmCreateAndPublishRoomDialogStore, closeAdminDialogEvent} from "../../../store";

import {AdminDialogsEnum} from "../../../store/types";

import styles from "./ConfirmCreateRoomDialog.module.scss";

export const ConfirmCreateRoomDialog = memo(({ onCreate }: {
    onCreate: (data: { isNeedToPublish: boolean }) => void;
}) => {
    const confirmCreateAndPublishDialog = useStore($confirmCreateAndPublishRoomDialogStore);

    const handleClose = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.confirmCreateAndPublishRoomDialog)
    }, []);

    const handleConfirmCreate = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.confirmCreateAndPublishRoomDialog);
        onCreate?.({ isNeedToPublish: true });
    }, [onCreate]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={confirmCreateAndPublishDialog}
        >
            <CustomTypography variant="h3bold">
                <Translation
                    nameSpace="rooms"
                    translation="createRoomDialog.title"
                />
            </CustomTypography>

            <CustomTypography textAlign="center">
                <Translation
                    nameSpace="rooms"
                    translation="createRoomDialog.text"
                />
            </CustomTypography>
            <ButtonsGroup
                className={styles.buttons}
            >
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
                    onClick={handleConfirmCreate}
                    label={
                        <Translation
                            nameSpace="rooms"
                            translation="buttons.createAndPublish"
                        />
                    }
                />
            </ButtonsGroup>
        </CustomDialog>
    )
});