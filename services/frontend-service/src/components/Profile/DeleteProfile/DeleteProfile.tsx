import React, { memo } from 'react';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// icons
import { DeleteIcon } from 'shared-frontend/icons';

// store
import { appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './DeleteProfile.module.scss';

const Component = () => {
    const handleOpenDeleteProfileDialog = () => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.deleteProfileDialog,
        });
    };

    return (
        <CustomPaper className={styles.paperWrapper}>
            <CustomGrid
                gap={0.5}
                container
                justifyContent="center"
                className={styles.deleteWrapper}
                onClick={handleOpenDeleteProfileDialog}
            >
                <DeleteIcon width="24px" height="24px" className={styles.delete} />
                <CustomTypography
                    variant="body2bold"
                    color="colors.red.primary"
                    nameSpace="profile"
                    translation="delete"
                />
            </CustomGrid>
        </CustomPaper>
    );
};

export const DeleteProfile = memo(Component);
