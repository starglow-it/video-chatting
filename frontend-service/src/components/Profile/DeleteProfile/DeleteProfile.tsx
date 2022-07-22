import {memo} from "react";
import {CustomPaper} from "@library/custom/CustomPaper/CustomPaper";

import styles from './DeleteProfile.module.scss';
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {DeleteIcon} from "@library/icons/DeleteIcon";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {appDialogsApi} from "../../../store";
import {AppDialogsEnum} from "../../../store/types";

const Component = () => {
    const handleOpenDeleteProfileDialog = () => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.deleteProfileDialog,
        });
    }

    return (
        <CustomPaper className={styles.paperWrapper}>
            <CustomGrid gap={0.5} container justifyContent="center" className={styles.deleteWrapper} onClick={handleOpenDeleteProfileDialog}>
                <DeleteIcon width="24px" height="24px" className={styles.delete} />
                <CustomTypography variant="body2bold" color="colors.red.primary" nameSpace="profile" translation="delete"/>
            </CustomGrid>
        </CustomPaper>
    )
}

export const DeleteProfile = memo(Component);