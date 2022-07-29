import React, { memo, useCallback } from 'react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import { useStore } from 'effector-react';
import { useFormContext } from 'react-hook-form';

// helpers

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomFade } from '@library/custom/CustomFade/CustomFade';
import { CustomRange } from '@library/custom/CustomRange/CustomRange';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { SelectDevices } from '@components/Media/SelectDevices/SelectDevices';
import { EditMonetization } from '@components/Meeting/EditMonetization/EditMonetization';
import { LabeledSwitch } from '@library/common/LabeledSwitch/LabeledSwitch';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

// icons
import { NewArrowIcon } from '@library/icons/NewArrowIcon';
import { SpeakerIcon } from '@library/icons/SpeakerIcon/SpeakerIcon';
import { MusicIcon } from '@library/icons/MusicIcon';
import { ArrowIcon } from '@library/icons/ArrowIcon';
import { BackgroundBlurIcon } from '@library/icons/BackgroundBlurIcon';
import { useToggle } from '../../../hooks/useToggle';

// stores
import { $isOwner } from '../../../store';

// styles
import styles from './MeetingSettingsContent.module.scss';

// types
import { MeetingSettingsContentProps } from './types';

const Component = ({
    title,
    stream,
    isBackgroundActive,
    onBackgroundToggle,
    backgroundVolume,
    onChangeBackgroundVolume,
    isBlurActive,
    onToggleBlur,
    isMonetizationEnabled,
}: MeetingSettingsContentProps) => {
    const isOwner = useStore($isOwner);

    const {
        formState: { errors },
    } = useFormContext();

    const {
        value: isAudioVideoSettingsOpened,
        onSwitchOff: handleCloseAudioVideoSettings,
        onSwitchOn: handleOpenAudioVideoSettings,
    } = useToggle(false);

    const handleChangeVolume = useCallback(event => {
        onChangeBackgroundVolume(event.target.value);
    }, []);

    const templatePriceMessage = ['min', 'max'].includes(errors?.templatePrice?.[0]?.type)
        ? errors?.templatePrice?.[0]?.message
        : '';

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
                            {isOwner && isMonetizationEnabled ? <EditMonetization /> : null}
                            <ErrorMessage error={templatePriceMessage} />
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
                        <CustomGrid
                            container
                            direction="column"
                            gap={2}
                            className={styles.selectDevicesWrapper}
                        >
                            <SelectDevices key={stream?.id} />
                            <CustomGrid
                                container
                                direction="column"
                                wrap="nowrap"
                                className={clsx(styles.audioSettings, {
                                    [styles.withVolume]: isBackgroundActive,
                                })}
                            >
                                <LabeledSwitch
                                    Icon={<MusicIcon width="24px" height="24px" />}
                                    nameSpace="meeting"
                                    translation="features.audioBackground"
                                    checked={isBackgroundActive}
                                    onChange={onBackgroundToggle}
                                    className={styles.audioWrapper}
                                />
                                <CustomFade open={isBackgroundActive}>
                                    <CustomDivider />
                                    <CustomRange
                                        color={backgroundVolume ? 'primary' : 'disabled'}
                                        value={backgroundVolume}
                                        onChange={handleChangeVolume}
                                        className={clsx(styles.audioRange, {
                                            [styles.inactive]: !backgroundVolume,
                                        })}
                                        Icon={
                                            <SpeakerIcon
                                                isActive={Boolean(backgroundVolume)}
                                                isHalfVolume={backgroundVolume < 50}
                                                width="24px"
                                                height="24px"
                                            />
                                        }
                                    />
                                </CustomFade>
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        </CustomGrid>
    );
};

export const MeetingSettingsContent = memo(Component);
