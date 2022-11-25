import {memo, useCallback} from "react";
import {useStore} from "effector-react";

import {useLocalization} from "@hooks/useTranslation";

import {CustomButton, CustomDialog, CustomGrid, CustomImage, CustomTypography} from "shared-frontend";

import {Translation} from "@library/common/Translation/Translation";

import {$appDialogsStore, appDialogsApi} from "../../../store";

import styles from "./UserBlockedDialog.module.scss";

import frontendConfig from '../../../const/config';

import {AppDialogsEnum} from "../../../store/types";

const Component = () => {
    const { userBlockedDialog } = useStore($appDialogsStore);

    const { translation } = useLocalization('common');

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.userBlockedDialog,
        });
    }, []);

    return (
        <CustomDialog
            contentClassName={styles.dialog}
            open={userBlockedDialog}
        >
            <CustomGrid container justifyContent="center" alignItems="center" gap={1.5}>
                <CustomImage src="/images/robot.png" width="40px" height="40px" />
                <CustomTypography
                    className={styles.text}
                    textAlign="center"
                    dangerouslySetInnerHTML={{
                        __html: translation('login.blocked.text', { supportEmail: frontendConfig.supportEmail })
                    }}
                />
                <CustomButton
                    variant="custom-cancel"
                    onClick={handleClose}
                    label={<Translation nameSpace="common" translation="buttons.close" />}
                />
            </CustomGrid>
        </CustomDialog>
    )
}

export const UserBlockedDialog = memo(Component);