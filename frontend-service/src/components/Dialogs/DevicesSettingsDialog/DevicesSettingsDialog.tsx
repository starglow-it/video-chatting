import React, { memo, useCallback, useContext, useEffect } from 'react';
import { useStore } from 'effector-react';
import * as yup from "yup";
import {FormProvider, useForm} from "react-hook-form";

// hooks

// custom components
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';
import {useYupValidationResolver} from "../../../hooks/useYupValidationResolver";

// controllers
import { AgoraController } from '../../../controllers/VideoChatController';

// context
import { MediaContext } from '../../../contexts/MediaContext';
import { VideoEffectsContext } from '../../../contexts/VideoEffectContext';

// store
import { $appDialogsStore, appDialogsApi } from '../../../store';
import {$localUserStore, emitUpdateUserEvent, updateLocalUserStateEvent} from '../../../store';
import {$meetingStore, $meetingTemplateStore, updateMeetingTemplateFxWithData} from '../../../store';
import { addNotificationEvent } from '../../../store';
import {
    $isSettingsBackgroundAudioActive,
    $settingsBackgroundAudioVolume,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
} from '../../../store';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

import {booleanSchema, simpleStringSchema} from "../../../validation/common";

const validationSchema = yup.object({
    templatePrice: simpleStringSchema().required('required'),
    isMonetizationEnabled: booleanSchema().required('required'),
    templateCurrency: simpleStringSchema().required('required'),
});

const DevicesSettingsDialog = memo(() => {
    const { devicesSettingsDialog } = useStore($appDialogsStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const meetingTemplate = useStore($meetingTemplateStore);

    const isSettingsAudioBackgroundActive = useStore($isSettingsBackgroundAudioActive);
    const settingsBackgroundAudioVolume = useStore($settingsBackgroundAudioVolume);

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const {
        data: { changeStream, error, videoDevices, audioDevices, isCameraActive, isMicActive },
        actions: { onToggleCamera, onToggleMic, onChangeActiveStream, onInitDevices },
    } = useContext(MediaContext);

    const {
        actions: { onGetCanvasStream },
        data: { isBlurActive, isFaceTrackingActive },
    } = useContext(VideoEffectsContext);

    const resolver = useYupValidationResolver<{ amount: number; isMonetizationEnabled: boolean }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            isMonetizationEnabled: Boolean(meetingTemplate.isMonetizationEnabled),
            templatePrice: '',
            templateCurrency: 'USD',
        }
    });

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

            const transformedStream = await onGetCanvasStream(newStream);

            if (transformedStream) {
                if (!meeting.sharingUserId) {
                    await AgoraController.setUpDevices(transformedStream);
                }

                AgoraController.setTracksState({
                    isCameraEnabled: isSharingScreenActive ? true : isCameraActive,
                    isMicEnabled: isMicActive,
                });
            }

            updateLocalUserStateEvent({
                cameraStatus: isCameraActive ? 'active' : 'inactive',
                micStatus: isMicActive ? 'active' : 'inactive',
                isAuraActive: isBlurActive
            });

            addNotificationEvent({
                type: NotificationType.DevicesAction,
                message: 'meeting.devices.saved',
            });

            emitUpdateUserEvent({ isAuraActive: isBlurActive });

            setBackgroundAudioVolume(settingsBackgroundAudioVolume);
            setBackgroundAudioActive(isSettingsAudioBackgroundActive);
        }
    }, [
        isCameraActive,
        isMicActive,
        changeStream,
        meeting.sharingUserId,
        isSharingScreenActive,
        isBlurActive,
        isFaceTrackingActive,
        settingsBackgroundAudioVolume,
        isSettingsAudioBackgroundActive,
    ]);

    const isDevicesChecking = !(videoDevices.length && audioDevices.length) && !error;

    const onSubmit = useCallback(async (data) => {
        await updateMeetingTemplateFxWithData(data);

        handleSaveSettings();
    }, []);

    return (
        <CustomDialog open={devicesSettingsDialog} contentClassName={styles.wrapper} onClose={handleClose}>
            <FormProvider {...methods}>
                <CustomGrid container direction="column">
                    <CustomGrid container wrap="nowrap">
                        <MediaPreview stream={changeStream} />
                        <CustomDivider orientation="vertical" flexItem />
                        <CustomGrid
                            className={styles.devicesWrapper}
                            container
                            direction="column"
                            wrap="nowrap"
                            gap={2}
                        >
                            {isDevicesChecking ? (
                                <WiggleLoader className={styles.loader} />
                            ) : (
                                <MeetingSettingsContent
                                    stream={changeStream}
                                    title={
                                        <CustomTypography
                                            className={styles.title}
                                            variant="h3bold"
                                            nameSpace="meeting"
                                            translation="settings.main"
                                        />
                                    }
                                />
                            )}
                        </CustomGrid>
                    </CustomGrid>
                </CustomGrid>
                <CustomButton
                    onClick={onSubmit}
                    className={styles.saveSettings}
                    nameSpace="meeting"
                    translation="buttons.saveSettings"
                />
            </FormProvider>
        </CustomDialog>
    );
});

export { DevicesSettingsDialog };
