import {
    memo, useCallback
} from 'react';
import {
    useStore
} from 'effector-react';
import {useRouter} from "next/router";

// shared
import {
    CustomDialog
} from 'shared-frontend/library/custom/CustomDialog';
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {Translation} from "@components/Translation/Translation";
import {CustomButton} from "shared-frontend/library/custom/CustomButton";
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';

// types
import {
    AdminDialogsEnum
} from '../../../store/types';

// styles
import styles from './CancelCreateRoomDialog.module.scss';

// stores
import {
    $cancelCreateRoomDialogStore,
    $commonTemplateStore,
    closeAdminDialogEvent,
    deleteCommonTemplateFx
} from "../../../store";

const Component = () => {
    const router = useRouter();

    const {
        state: commonTemplate
    } = useStore($commonTemplateStore);

    const cancelCreateRoomDialog = useStore($cancelCreateRoomDialogStore);

    const handleClose = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.cancelCreateRoomDialog);
    }, []);

    const handleCancelCreateRoom = useCallback(() => {
        deleteCommonTemplateFx({ templateId: commonTemplate?.id });
        router.push('/rooms');
    }, [commonTemplate?.id]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={cancelCreateRoomDialog}
        >
            <CustomTypography variant="h3">
                <Translation
                    nameSpace="rooms"
                    translation="cancelCreate.title"
                />
            </CustomTypography>

            <CustomTypography>
                <Translation
                    nameSpace="rooms"
                    translation="cancelCreate.text"
                />
            </CustomTypography>
            <ButtonsGroup
                className={styles.buttons}
            >
                <CustomButton
                    variant="custom-cancel"
                    onClick={handleCancelCreateRoom}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.stay"
                        />
                    }
                />
                <CustomButton
                    variant="custom-danger"
                    onClick={handleClose}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.cancel"
                        />
                    }
                />
            </ButtonsGroup>
        </CustomDialog>
    );
};

export const CancelCreateRoomDialog = memo(Component);
