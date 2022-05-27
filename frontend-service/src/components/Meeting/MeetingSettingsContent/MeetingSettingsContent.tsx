import React, { memo, useCallback, useContext } from 'react';
import clsx from 'clsx';
import { Fade } from '@mui/material';

// helpers

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomRange } from '@library/custom/CustomRange/CustomRange';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { SelectDevices } from '@components/Media/SelectDevices/SelectDevices';
import { LabeledSwitch } from '@library/common/LabeledSwitch/LabeledSwitch';

// icons
import { NewArrowIcon } from '@library/icons/NewArrowIcon';
import { ArrowIcon } from '@library/icons/ArrowIcon';
import { MusicIcon } from '@library/icons/MusicIcon';
import { FaceTrackingIcon } from '@library/icons/FaceTrackingIcon';
import { BackgroundBlurIcon } from '@library/icons/BackgroundBlurIcon';
import { SpeakerIcon } from '@library/icons/SpeakerIcon/SpeakerIcon';
import { VideoEffectsContext } from '../../../contexts/VideoEffectContext';
import { useToggle } from '../../../hooks/useToggle';

// styles
import styles from './MeetingSettingsContent.module.scss';

// types
import { MeetingSettingsContentProps } from './types';

const Component = ({
    title,
    stream,
    volume,
    onChangeVolume,
    isBackgroundAudioActive,
    onToggleAudioBackground,
}: MeetingSettingsContentProps) => {
    const {
        value: isAudioVideoSettingsOpened,
        onSwitchOff: handleCloseAudioVideoSettings,
        onSwitchOn: handleOpenAudioVideoSettings,
    } = useToggle(false);

    const {
        actions: { onToggleBlur, onToggleFaceTracking },
        data: { isBlurActive, isFaceTrackingActive },
    } = useContext(VideoEffectsContext);

    const handleChangeVolume = useCallback(event => {
        onChangeVolume(event.target.value);
    }, []);

    return (
        <CustomGrid container direction="column" className={styles.settingsWrapper}>
            <CustomGrid
                className={clsx(styles.settingPosition, {
                    [styles.relative]: !isAudioVideoSettingsOpened,
                })}
            >
                <Fade in={!isAudioVideoSettingsOpened}>
                    <CustomGrid container gap={2.5}>
                        <CustomGrid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            wrap="nowrap"
                        >
                            {title}
                            <CustomGrid
                                container
                                justifyContent="center"
                                alignItems="center"
                                onClick={handleOpenAudioVideoSettings}
                                className={styles.advancedButton}
                            >
                                <CustomTypography
                                    color="colors.white.primary"
                                    nameSpace="meeting"
                                    translation="settings.audioVideo"
                                    variant="body2"
                                />
                                <NewArrowIcon width="18px" height="18px" />
                            </CustomGrid>
                        </CustomGrid>
                        <CustomGrid container gap={2} direction="column">
                            <LabeledSwitch
                                Icon={<BackgroundBlurIcon width="24px" height="24px" />}
                                nameSpace="meeting"
                                translation="features.blurBackground"
                                checked={isBlurActive}
                                onChange={onToggleBlur}
                                className={styles.switchWrapper}
                            />
                            <LabeledSwitch
                                Icon={<FaceTrackingIcon width="24px" height="24px" />}
                                nameSpace="meeting"
                                translation="features.faceTracking"
                                checked={isFaceTrackingActive}
                                onChange={onToggleFaceTracking}
                                className={styles.switchWrapper}
                            />
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
            </CustomGrid>
            <CustomGrid
                className={clsx(styles.advancedSettings, {
                    [styles.relative]: isAudioVideoSettingsOpened,
                })}
            >
                <Fade in={isAudioVideoSettingsOpened}>
                    <CustomGrid container>
                        <CustomGrid container gap={1.5} alignItems="center">
                            <ArrowIcon
                                className={styles.arrowIcon}
                                width="32px"
                                height="32px"
                                onClick={handleCloseAudioVideoSettings}
                            />
                            <CustomTypography
                                variant="h3bold"
                                nameSpace="meeting"
                                translation="settings.audioVideo"
                            />
                        </CustomGrid>
                        <SelectDevices key={stream?.id} className={styles.selectDevicesWrapper} />
                        <CustomGrid
                            container
                            direction="column"
                            wrap="nowrap"
                            className={clsx(styles.audioSettings, {
                                [styles.withVolume]: isBackgroundAudioActive,
                            })}
                        >
                            <LabeledSwitch
                                Icon={<MusicIcon width="24px" height="24px" />}
                                nameSpace="meeting"
                                translation="features.audioBackground"
                                checked={isBackgroundAudioActive}
                                onChange={onToggleAudioBackground}
                                className={styles.audioWrapper}
                            />
                            <Fade in={isBackgroundAudioActive}>
                                <CustomBox>
                                    <CustomDivider />
                                    <CustomRange
                                        color={volume ? 'primary' : 'disabled'}
                                        value={volume}
                                        onChange={handleChangeVolume}
                                        className={clsx(styles.audioRange, {
                                            [styles.inactive]: !volume,
                                        })}
                                        Icon={
                                            <SpeakerIcon
                                                isActive={Boolean(volume)}
                                                isHalfVolume={volume < 50}
                                                width="24px"
                                                height="24px"
                                            />
                                        }
                                    />
                                </CustomBox>
                            </Fade>
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        </CustomGrid>
    );
}

export const MeetingSettingsContent = memo(Component);
