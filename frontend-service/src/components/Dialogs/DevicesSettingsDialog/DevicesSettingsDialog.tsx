import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom components
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';

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
import { AppDialogsEnum, NotificationType, UserTemplate } from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

// validations
import { booleanSchema, simpleStringSchema } from '../../../validation/common';
import { templatePriceSchema } from '../../../validation/payments/templatePrice';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    isMonetizationEnabled: booleanSchema().required('required'),
    templateCurrency: simpleStringSchema().required('required'),
});

type MonetizationFormType = {
    templateCurrency: UserTemplate['templateCurrency'];
    templatePrice: UserTemplate['templatePrice'];
    isMonetizationEnabled: UserTemplate['isMonetizationEnabled'];
};

const Component = () => {
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
        data: { changeStream, isCameraActive, isMicActive, isStreamRequested },
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

    const resolver = useYupValidationResolver<MonetizationFormType>(validationSchema);

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
        if (!isStreamRequested) {
            onToggleCamera(localUser.cameraStatus !== 'inactive');
            onToggleMic(localUser.micStatus !== 'inactive');
        }
    }, [localUser.cameraStatus, localUser.micStatus, devicesSettingsDialog, isStreamRequested]);

    useEffect(() => {
        setVolume(backgroundAudioVolume);
    }, [backgroundAudioVolume]);

    const handleSaveSettings = useCallback(async () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });

        onSetBlur(isBlurEnabled);
        setBackgroundAudioVolume(volume);
        setBackgroundAudioActive(isSettingsAudioBackgroundActive);

        if (changeStream) {
            if (isBlurActive !== isBlurEnabled) {
                const newStream = onChangeActiveStream();

                const transformedStream = await onGetCanvasStream(newStream, {
                    isBlurActive: isBlurEnabled,
                });

                if (transformedStream) {
                    await AgoraController.setUpDevices(transformedStream, {
                        isCameraEnabled: isSharingScreenActive ? true : isCameraActive,
                        isMicEnabled: isMicActive,
                    });
                }

                updateLocalUserEvent({
                    isAuraActive: isBlurEnabled,
                });

                await updateUserSocketEvent({ isAuraActive: isBlurEnabled });
            } else {
                AgoraController.setTracksState({
                    isCameraEnabled: isSharingScreenActive ? true : isCameraActive,
                    isMicEnabled: isMicActive,
                });
            }

            updateLocalUserEvent({
                cameraStatus: isCameraActive ? 'active' : 'inactive',
                micStatus: isMicActive ? 'active' : 'inactive',
            });

            addNotificationEvent({
                type: NotificationType.DevicesAction,
                message: 'meeting.devices.saved',
            });
        }
    }, [
        isCameraActive,
        isMicActive,
        changeStream,
        meeting.sharingUserId,
        isSharingScreenActive,
        volume,
        isSettingsAudioBackgroundActive,
        isBlurEnabled,
        isBlurActive,
    ]);

    const onSubmit = useCallback(
        methods.handleSubmit(async data => {
            if (isOwner) {
                await updateMeetingTemplateFxWithData(data);
            }

            await handleSaveSettings();
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
                                <MeetingSettingsContent
                                    stream={changeStream}
                                    isBackgroundActive={isSettingsAudioBackgroundActive}
                                    onBackgroundToggle={handleToggleBackgroundAudio}
                                    backgroundVolume={volume}
                                    isMonetizationEnabled={Boolean(profile?.isStripeEnabled)}
                                    isMonetizationAvailable={false}
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
};

export const DevicesSettingsDialog = memo(Component);
