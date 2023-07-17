import React, { memo, useCallback } from 'react';
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
import styles from './MeetingFinishedDialog.module.scss';

const Component = () => {
    const { meetingFinishedDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.meetingFinishedDialog,
        });
    }, []);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={meetingFinishedDialog}
        >
            <CustomGrid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <CustomTypography
                    variant="h3bold"
                    nameSpace="dashboard"
                    translation="dialogs.meetingFinished.title"
                />

                <CustomTypography
                    className={styles.text}
                    nameSpace="dashboard"
                    translation="dialogs.meetingFinished.text"
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

export const MeetingFinishedDialog = memo(Component);
