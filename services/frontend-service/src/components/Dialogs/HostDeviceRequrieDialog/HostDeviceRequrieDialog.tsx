import { memo, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// stores
import { Translation } from '@library/common/Translation/Translation';
import { $appDialogsStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './HostDeviceRequrieDialog.module.scss';

const Component = () => {
    const { hostDeviceRequireDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.hostDeviceRequireDialog,
        });
    }, []);

    const handleGoToSetting = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.hostDeviceRequireDialog,
        });
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });
    }, []);


    return (
        <CustomDialog
            contentClassName={styles.content}
            open={hostDeviceRequireDialog}
            onClose={handleClose}
        >
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <CustomTypography
                    variant="h3bold"
                    textAlign="center"
                    className={styles.title}
                    nameSpace="meeting"
                    translation="hostDeviceRequireTitle"
                >
                </CustomTypography>
                <CustomTypography
                    textAlign="left"
                    fontSize={14}
                    className={styles.description}
                    nameSpace="meeting"
                    translation="hostDeviceRequire"
                >
                </CustomTypography>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    className={styles.buttonsWrapper}
                    wrap="nowrap"
                >
                    <CustomButton
                        variant="custom-cancel"
                        className={styles.button}
                        onClick={handleClose}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="buttons.cancel"
                            />
                        }
                    />
                    <CustomButton
                        className={styles.button}
                        onClick={handleGoToSetting}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="buttons.goToSetting"
                            />
                        }
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const HostDeviceRequrieDialog = memo(Component);
