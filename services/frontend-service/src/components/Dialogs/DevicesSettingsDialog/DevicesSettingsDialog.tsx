import React, { memo, useCallback, useEffect, useState } from 'react';
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

// store
import {
    $appDialogsStore,
    $profileStore,
    appDialogsApi,
    addNotificationEvent,
} from '../../../store';
import {
    $backgroundAudioVolume,
    $changeStreamStore,
    $isAuraActive,
    $isBackgroundAudioActive,
    $isCameraActiveStore,
    $isMicActiveStore,
    $isOwner,
    $isStreamRequestedStore,
    $localUserStore,
    $meetingStore,
    $meetingTemplateStore,
    initDevicesEventFxWithStore,
    resetMediaStoreEvent,
    setActiveStreamEvent,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    setDevicesPermission,
    setIsAuraActive,
    toggleLocalDeviceEvent,
    updateLocalUserEvent,
    updateMeetingTemplateFxWithData,
    updateUserSocketEvent,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum, NotificationType, UserTemplate } from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

// validations
import { booleanSchema, simpleStringSchema } from '../../../validation/common';
import { templatePriceSchema } from '../../../validation/payments/templatePrice';
import { applyBlur } from '../../../store/roomStores/videoChat/helpers/applyBlur';

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
    const profile = useStore($profileStore);

    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isOwner = useStore($isOwner);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const changeStream = useStore($changeStreamStore);
    const isCameraActive = useStore($isCameraActiveStore);
    const isMicActive = useStore($isMicActiveStore);
    const isStreamRequested = useStore($isStreamRequestedStore);
    const isAuraActive = useStore($isAuraActive);

    const [volume, setVolume] = useState<number>(backgroundAudioVolume);

    const isSharingScreenActive = localUser.id === meeting.sharingUserId;

    const {
        value: isSettingsAudioBackgroundActive,
        onToggleSwitch: handleToggleBackgroundAudio,
        onSetSwitch: handleSetBackgroundAudio,
    } = useToggle(isBackgroundAudioActive);

    const {
        value: isAuraEnabled,
        onToggleSwitch: handleToggleAura,
        onSetSwitch: handleSetAura,
    } = useToggle(isAuraActive);

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
        handleSetAura(isAuraActive);
        setVolume(backgroundAudioVolume);
        methods.reset();
        resetMediaStoreEvent();
    }, [isBackgroundAudioActive, backgroundAudioVolume, isAuraActive]);

    useEffect(() => {
        (async () => {
            if (devicesSettingsDialog) {
                await initDevicesEventFxWithStore();
            }
        })();
    }, [devicesSettingsDialog]);

    useEffect(() => {
        if (!isStreamRequested) {
            toggleLocalDeviceEvent({
                isCamEnabled: localUser.cameraStatus !== 'inactive',
            });
            toggleLocalDeviceEvent({
                isMicEnabled: localUser.micStatus !== 'inactive',
            });
        }
    }, [localUser.cameraStatus, localUser.micStatus, devicesSettingsDialog, isStreamRequested]);

    useEffect(() => {
        setVolume(backgroundAudioVolume);
    }, [backgroundAudioVolume]);

    const handleSaveSettings = useCallback(async () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog,
        });

        setIsAuraActive(isAuraEnabled);
        setBackgroundAudioVolume(volume);
        setBackgroundAudioActive(isSettingsAudioBackgroundActive);

        if (changeStream) {
            if (isAuraActive !== isAuraEnabled) {
                updateLocalUserEvent({
                    isAuraActive: isAuraEnabled,
                });

                await updateUserSocketEvent({ isAuraActive: isAuraEnabled });
            }

            updateLocalUserEvent({
                cameraStatus: isCameraActive ? 'active' : 'inactive',
                micStatus: isMicActive ? 'active' : 'inactive',
            });

            setDevicesPermission({
                isMicEnabled: isMicActive,
                isCamEnabled: isCameraActive,
            });

            addNotificationEvent({
                type: NotificationType.DevicesAction,
                message: 'meeting.devices.saved',
            });

            const clonedStream = changeStream?.clone();

            const streamWithBackground = await applyBlur(clonedStream, {
                isAuraActive: isAuraEnabled,
            });

            setActiveStreamEvent(streamWithBackground);
        }
    }, [
        isCameraActive,
        isMicActive,
        changeStream,
        meeting.sharingUserId,
        isSharingScreenActive,
        volume,
        isSettingsAudioBackgroundActive,
        isAuraEnabled,
        isAuraActive,
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
                                    isAuraActive={isAuraEnabled}
                                    onToggleAura={handleToggleAura}
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
