import React, { memo, useCallback, useContext, useEffect } from 'react';
import { useStore } from 'effector-react';

import { Divider } from '@mui/material';

// custom components
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { SelectDevices } from '@components/Media/SelectDevices/SelectDevices';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { AgoraController } from '../../../controllers/VideoChatController';
import { MediaContext } from '../../../contexts/MediaContext';

// store
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';
import { $localUserStore, updateLocalUserStateEvent } from '../../../store/users';
import { $meetingStore } from '../../../store/meeting';
import { addNotificationEvent } from '../../../store/notifications';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

const DevicesSettingsDialog = memo(() => {
    const { devicesSettingsDialog } = useStore($appDialogsStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const {
        data: { changeStream, error, videoDevices, audioDevices, isCameraActive, isMicActive },
        actions: { onToggleCamera, onToggleMic, onChangeActiveStream, onInitDevices },
    } = useContext(MediaContext);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });
    }, []);

    useEffect(() => {
        (async () => {
            if (devicesSettingsDialog) {
                await onInitDevices();
                onToggleCamera(localUser.cameraStatus !== 'inactive');
                onToggleMic(localUser.micStatus !== 'inactive');
            }
        })();
    }, [devicesSettingsDialog, localUser.cameraStatus, localUser.micStatus]);

    const handleSaveSettings = useCallback(async () => {
        handleClose();

        if (changeStream) {
            const newStream = onChangeActiveStream();

            if (newStream) {
                if (!meeting.sharingUserId) {
                    await AgoraController.setUpDevices(newStream);
                }

                AgoraController.setTracksState({
                    isCameraEnabled: isSharingScreenActive ? true : isCameraActive,
                    isMicEnabled: isMicActive,
                });
            }

            addNotificationEvent({
                type: NotificationType.DevicesAction,
            });

            updateLocalUserStateEvent({
                cameraStatus: isCameraActive ? 'active' : 'inactive',
                micStatus: isMicActive ? 'active' : 'inactive',
            });
        }
    }, [isCameraActive, isMicActive, changeStream, meeting.sharingUserId, isSharingScreenActive]);

    const isDevicesChecking = !(videoDevices.length && audioDevices.length) && !error;

    return (
        <CustomDialog open={devicesSettingsDialog} contentClassName={styles.wrapper}>
            <CustomGrid container direction="column">
                <CustomGrid container wrap="nowrap" className={styles.settingsContent}>
                    <MediaPreview />
                    <Divider orientation="vertical" flexItem />
                    <CustomGrid
                        className={styles.devicesWrapper}
                        container
                        direction="column"
                        wrap="nowrap"
                    >
                        <CustomTypography
                            className={styles.title}
                            variant="h3bold"
                            nameSpace="meeting"
                            translation="settings"
                        />
                        {isDevicesChecking ? (
                            <WiggleLoader className={styles.loader} />
                        ) : (
                            <SelectDevices className={styles.selectDevicesWrapper} />
                        )}
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
            <CustomButton
                onClick={handleSaveSettings}
                className={styles.saveSettings}
                nameSpace="meeting"
                translation="buttons.saveSettings"
            />
        </CustomDialog>
    );
});

export { DevicesSettingsDialog };
