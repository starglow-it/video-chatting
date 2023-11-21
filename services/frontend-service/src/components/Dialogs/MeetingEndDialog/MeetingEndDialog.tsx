import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { Translation } from '@library/common/Translation/Translation';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// stores
import { $appDialogsStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './MeetingEndDialog.module.scss';

const Component = () => {
    const { meetingEndDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.meetingEndDialog,
        });
    }, []);

    return (
        <CustomDialog contentClassName={styles.content} open={meetingEndDialog}>
            <CustomGrid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <CustomTypography
                    variant="h3bold"
                    nameSpace="dashboard"
                    translation="dialogs.meetingEnd.title"
                />

                <CustomButton
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.close"
                        />
                    }
                    onClick={handleClose}
                    className={styles.button}
                    variant="custom-cancel"
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const MeetingEndDialog = memo(Component);
