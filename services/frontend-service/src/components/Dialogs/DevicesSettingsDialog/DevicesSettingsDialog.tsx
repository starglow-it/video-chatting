import React, {
	memo, useCallback, useEffect, useState 
} from 'react';
import {
	useStore 
} from 'effector-react';
import * as yup from 'yup';
import {
	FormProvider, useForm 
} from 'react-hook-form';

// hooks
import {
	useToggle 
} from '@hooks/useToggle';
import {
	useYupValidationResolver 
} from '@hooks/useYupValidationResolver';

// custom components
import {
	CustomButton 
} from 'shared-frontend/library';
import {
	CustomDialog 
} from 'shared-frontend/library';
import {
	CustomGrid 
} from 'shared-frontend/library';
import {
	CustomTypography 
} from '@library/custom/CustomTypography/CustomTypography';
import {
	CustomDivider 
} from 'shared-frontend/library';

// components
import {
	MediaPreview 
} from '@components/Media/MediaPreview/MediaPreview';
import {
	MeetingSettingsContent 
} from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';

// store
import {
	Translation 
} from '@library/common/Translation/Translation';
import {
	IUserTemplate 
} from 'shared-types';
import {
	$appDialogsStore,
	$profileStore,
	appDialogsApi,
	addNotificationEvent,
} from '../../../store';
import {
	$audioDevicesStore,
	$audioErrorStore,
	$backgroundAudioVolume,
	$changeStreamStore,
	$isAuraActive,
	$isBackgroundAudioActive,
	$isCameraActiveStore,
	$isMicActiveStore,
	$isOwner,
	$isStreamRequestedStore,
	$localUserStore,
	$meetingTemplateStore,
	$videoDevicesStore,
	$videoErrorStore,
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
import {
	AppDialogsEnum, NotificationType 
} from '../../../store/types';

// styles
import styles from './DevicesSettingsDialog.module.scss';

// validations
import {
	booleanSchema, simpleStringSchema 
} from '../../../validation/common';
import {
	templatePriceSchema 
} from '../../../validation/payments/templatePrice';
import {
	BackgroundManager 
} from '../../../helpers/media/applyBlur';
import {
	changeTracksState 
} from '../../../helpers/media/changeTrackState';

const validationSchema = yup.object({
	templatePrice: templatePriceSchema(),
	isMonetizationEnabled: booleanSchema().required('required'),
	templateCurrency: simpleStringSchema().required('required'),
});

type MonetizationFormType = {
    templateCurrency: IUserTemplate['templateCurrency'];
    templatePrice: IUserTemplate['templatePrice'];
    isMonetizationEnabled: IUserTemplate['isMonetizationEnabled'];
};

const Component = () => {
	const {
		devicesSettingsDialog 
	} = useStore($appDialogsStore);
	const profile = useStore($profileStore);

	const localUser = useStore($localUserStore);
	const isOwner = useStore($isOwner);
	const meetingTemplate = useStore($meetingTemplateStore);
	const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
	const backgroundAudioVolume = useStore($backgroundAudioVolume);
	const changeStream = useStore($changeStreamStore);
	const isCameraActive = useStore($isCameraActiveStore);
	const isMicActive = useStore($isMicActiveStore);
	const isStreamRequested = useStore($isStreamRequestedStore);
	const isAuraActive = useStore($isAuraActive);
	const videoDevices = useStore($videoDevicesStore);
	const audioDevices = useStore($audioDevicesStore);
	const videoError = useStore($videoErrorStore);
	const audioError = useStore($audioErrorStore);

	const [volume, setVolume] = useState<number>(backgroundAudioVolume);

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

	const {
		value: isNewCameraSettingActive,
		onToggleSwitch: handleToggleNewCameraSetting,
	} = useToggle(isCameraActive);

	const {
		value: isNewMicSettingActive,
		onToggleSwitch: handleToggleNewMicSetting,
	} = useToggle(isMicActive);

	const resolver =
        useYupValidationResolver<MonetizationFormType>(validationSchema);

	const methods = useForm({
		criteriaMode: 'all',
		resolver,
		defaultValues: {
			isMonetizationEnabled: Boolean(
				meetingTemplate.isMonetizationEnabled,
			),
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
	}, [
		localUser.cameraStatus,
		localUser.micStatus,
		devicesSettingsDialog,
		isStreamRequested,
	]);

	useEffect(() => {
		setVolume(backgroundAudioVolume);
	}, [backgroundAudioVolume]);

	const handleToggleCamera = () => {
		changeTracksState({
			enabled: !isNewCameraSettingActive,
			tracks: changeStream?.getVideoTracks(),
		});
		handleToggleNewCameraSetting();
	};

	const handleToggleMic = () => {
		changeTracksState({
			enabled: !isNewMicSettingActive,
			tracks: changeStream?.getAudioTracks(),
		});
		handleToggleNewMicSetting();
	};

	const handleSaveSettings = useCallback(async () => {
		if (changeStream) {
			if (isAuraActive !== isAuraEnabled) {
				updateLocalUserEvent({
					isAuraActive: isAuraEnabled,
				});

				await updateUserSocketEvent({
					isAuraActive: isAuraEnabled,
				});

				if (isAuraEnabled) {
					const clonedStream = changeStream?.clone();

					const streamWithBackground =
                        await BackgroundManager.applyBlur(
                        	clonedStream,
                        	isNewCameraSettingActive,
                        	isAuraEnabled,
                        );

					setActiveStreamEvent(streamWithBackground);
				} else {
					setActiveStreamEvent(changeStream);
				}
			}

			appDialogsApi.closeDialog({
				dialogKey: AppDialogsEnum.devicesSettingsDialog,
			});

			setIsAuraActive(isAuraEnabled);
			setBackgroundAudioVolume(volume);
			setBackgroundAudioActive(isSettingsAudioBackgroundActive);

			updateLocalUserEvent({
				cameraStatus: isNewCameraSettingActive ? 'active' : 'inactive',
				micStatus: isNewMicSettingActive ? 'active' : 'inactive',
			});

			setDevicesPermission({
				isMicEnabled: isNewMicSettingActive,
				isCamEnabled: isNewCameraSettingActive,
			});

			addNotificationEvent({
				type: NotificationType.DevicesAction,
				message: 'meeting.devices.saved',
			});
		}
	}, [
		isNewCameraSettingActive,
		isNewMicSettingActive,
		changeStream,
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
					<CustomGrid
						container
						direction="column"
					>
						<CustomGrid
							container
							wrap="nowrap"
						>
							<MediaPreview
								videoError={videoError}
								audioError={audioError}
								videoDevices={videoDevices}
								audioDevices={audioDevices}
								isCameraActive={isNewCameraSettingActive}
								isMicActive={isNewMicSettingActive}
								onToggleVideo={handleToggleCamera}
								onToggleAudio={handleToggleMic}
								stream={changeStream}
								profileAvatar={profile.profileAvatar?.url}
								userName={localUser?.username}
							/>
							<CustomDivider
								orientation="vertical"
								flexItem
							/>
							<CustomGrid
								className={styles.devicesWrapper}
								container
								direction="column"
								wrap="nowrap"
								gap={2}
							>
								<MeetingSettingsContent
									stream={changeStream}
									isBackgroundActive={
										isSettingsAudioBackgroundActive
									}
									onBackgroundToggle={
										handleToggleBackgroundAudio
									}
									backgroundVolume={volume}
									isMonetizationEnabled={Boolean(
										profile?.isStripeEnabled,
									)}
									isMonetizationAvailable={false}
									onChangeBackgroundVolume={setVolume}
									isAuraActive={isAuraEnabled}
									onToggleAura={handleToggleAura}
									isAudioActive={
										meetingTemplate.isAudioAvailable
									}
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
						label={
							<Translation
								nameSpace="meeting"
								translation="buttons.saveSettings"
							/>
						}
					/>
				</form>
			</FormProvider>
		</CustomDialog>
	);
};

export const DevicesSettingsDialog = memo(Component);
