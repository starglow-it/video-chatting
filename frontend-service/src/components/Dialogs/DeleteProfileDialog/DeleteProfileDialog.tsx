import {memo} from "react";
import {useStore} from "effector-react";
import Router from "next/router";

import styles from "./DeleteProfileDialog.module.scss";

import {$appDialogsStore, appDialogsApi, deleteProfileFx} from "../../../store";

import {AppDialogsEnum} from "../../../store/types";

import {CustomDialog} from "@library/custom/CustomDialog/CustomDialog";
import {CustomButton} from "@library/custom/CustomButton/CustomButton";
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";

const Component = () => {
    const { deleteProfileDialog } = useStore($appDialogsStore);

    const handleClose = () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.deleteProfileDialog,
        });
    }

    const handleDeleteProfile = async () => {
        await deleteProfileFx();

        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.deleteProfileDialog,
        });

        await Router.push('/login');
    }

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={deleteProfileDialog}
        >
            <CustomTypography display="block" textAlign="center" nameSpace="profile" translation="deleteProfileConfirm" />
            <CustomGrid container wrap="nowrap" gap={2} className={styles.buttonsWrapper}>
                <CustomButton
                    variant="custom-cancel"
                    className={styles.button}
                    onClick={handleClose}
                    nameSpace="common"
                    translation="buttons.cancel"
                />
                <CustomButton
                    variant="custom-danger"
                    className={styles.button}
                    onClick={handleDeleteProfile}
                    nameSpace="common"
                    translation="buttons.delete"
                />
            </CustomGrid>
        </CustomDialog>
    );
}

export const DeleteProfileDialog = memo(Component);