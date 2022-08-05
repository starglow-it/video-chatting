import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';

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
import { useToggle } from '../../../hooks/useToggle';
import { useYupValidationResolver } from '../../../hooks/useYupValidationResolver';

// controllers
import { AgoraController } from '../../../controllers/VideoChatController';

// context
import { MediaContext } from '../../../contexts/MediaContext';
import { VideoEffectsContext } from '../../../contexts/VideoEffectContext';

// store
import {
    $appDialogsStore,
    $isOwner,
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    $localUserStore,
    $meetingStore,
    $meetingTemplateStore,
    $profileStore,
    appDialogsApi,
    updateUserSocketEvent,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    addNotificationEvent,
    updateLocalUserEvent,
    updateMeetingTemplateFxWithData,
} from '../../../store';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

import { booleanSchema, simpleStringSchema } from '../../../validation/common';
import { templatePriceSchema } from '../../../validation/payments/templatePrice';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    isMonetizationEnabled: booleanSchema().required('required'),
    templateCurrency: simpleStringSchema().required('required'),
});

const DevicesSettingsDialog = memo(() => {
    const { devicesSettingsDialog } = useStore($appDialogsStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const profile = useStore($profileStore);
    const isOwner = useStore($isOwner);
    const meetingTemplate = useStore($meetingTemplateStore);

    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);

    const [volume, setVolume] = useState<number>(backgroundAudioVolume);

    const isSharingScreenActive = localUser.meetingUserId === meeting.sharingUserId;

    const {
        data: { changeStream, error, videoDevices, audioDevices, isCameraActive, isMicActive },
        actions: {
            onToggleCamera,
            onToggleMic,
            onChangeActiveStream,
            onInitDevices,
            onClearCurrentDevices,
        },
    } = useContext(MediaContext);

    const {
        actions: { onGetCanvasStream, onSetBlur },
        data: { isBlurActive },
    } = useContext(VideoEffectsContext);

    const {
        value: isSettingsAudioBackgroundActive,
        onToggleSwitch: handleToggleBackgroundAudio,
        onSetSwitch: handleSetBackgroundAudio,
    } = useToggle(isBackgroundAudioActive);

    const {
        value: isBlurEnabled,
        onToggleSwitch: handleToggleBlur,
        onSetSwitch: handleSetBlur,
    } = useToggle(isBlurActive);

    const resolver = useYupValidationResolver<{
        templateCurrency: string;
        templatePrice: number;
        isMonetizationEnabled: boolean;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            isMonetizationEnabled: Boolean(meetingTemplate.isMonetizationEnabled),
            templatePrice: meetingTemplate.templatePrice || 10,
            templateCurrency: meetingTemplate.templateCurrency || 'USD',
        },
    });

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });

        handleSetBackgroundAudio(isBackgroundAudioActive);
        handleSetBlur(isBlurActive);
        setVolume(backgroundAudioVolume);
        methods.reset();
        onClearCurrentDevices();
    }, [isBackgroundAudioActive, backgroundAudioVolume, isBlurActive]);

    useEffect(() => {
        (async () => {
            if (devicesSettingsDialog) {
                await onInitDevices();
            }
        })();
    }, [devicesSettingsDialog]);

    useEffect(() => {
        if (changeStream) {
            onToggleCamera(localUser.cameraStatus !== 'inactive');
            onToggleMic(localUser.micStatus !== 'inactive');
        }
    }, [changeStream]);

    const handleSaveSettings = useCallback(async () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });

        onSetBlur(isBlurEnabled);
        setBackgroundAudioVolume(backgroundAudioVolume);
        setBackgroundAudioActive(isSettingsAudioBackgroundActive);

        if (changeStream) {
            const newStream = onChangeActiveStream();

            const transformedStream = await onGetCanvasStream(newStream, {
                isBlurActive: isBlurEnabled,
            });

            if (transformedStream) {
                await AgoraController.setUpDevices(transformedStream);

                AgoraController.setTracksState({
                    isCameraEnabled: isSharingScreenActive ? true : isCameraActive,
                    isMicEnabled: isMicActive,
                });
            }

            updateLocalUserEvent({
                cameraStatus: isCameraActive ? 'active' : 'inactive',
                micStatus: isMicActive ? 'active' : 'inactive',
                isAuraActive: isBlurEnabled,
            });

            addNotificationEvent({
                type: NotificationType.DevicesAction,
                message: 'meeting.devices.saved',
            });

            updateUserSocketEvent({ isAuraActive: isBlurEnabled });
        }
    }, [
        isCameraActive,
        isMicActive,
        changeStream,
        meeting.sharingUserId,
        isSharingScreenActive,
        backgroundAudioVolume,
        isSettingsAudioBackgroundActive,
        isBlurEnabled,
    ]);

    const isDevicesChecking = !(videoDevices.length && audioDevices.length) && !error;

    const onSubmit = useCallback(
        methods.handleSubmit(async data => {
            if (isOwner) {
                await updateMeetingTemplateFxWithData(data);
            }

            handleSaveSettings();
        }),
        [handleSaveSettings, isOwner],
    );

    return (
        <CustomDialog
            open={devicesSettingsDialog}
            contentClassName={styles.wrapper}
            onClose={handleClose}
        >
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
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
                                        isBackgroundActive={isSettingsAudioBackgroundActive}
                                        onBackgroundToggle={handleToggleBackgroundAudio}
                                        backgroundVolume={volume}
                                        isMonetizationEnabled={Boolean(profile?.isStripeEnabled)}
                                        onChangeBackgroundVolume={setVolume}
                                        isBlurActive={isBlurEnabled}
                                        onToggleBlur={handleToggleBlur}
                                        isAudioActive={meetingTemplate.isAudioAvailable}
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
                </form>
            </FormProvider>
        </CustomDialog>
    );
});

export { DevicesSettingsDialog };
