import React, { memo, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import { useFormContext } from 'react-hook-form';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomFade } from 'shared-frontend/library/custom/CustomFade';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { NewArrowIcon } from 'shared-frontend/icons/OtherIcons/NewArrowIcon';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomRange } from '@library/custom/CustomRange/CustomRange';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { SelectDevices } from '@components/Media/SelectDevices/SelectDevices';
import { LabeledSwitch } from '@library/common/LabeledSwitch/LabeledSwitch';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

// icons

// styles

// types
import { BackgroundBlurIcon } from 'shared-frontend/icons/OtherIcons/BackgroundBlurIcon';
import { ArrowIcon } from 'shared-frontend/icons/OtherIcons/ArrowIcon';
import { SpeakerIcon } from 'shared-frontend/icons/OtherIcons/SpeakerIcon';
import { MusicIcon } from 'shared-frontend/icons/OtherIcons/MusicIcon';
import { MeetingSettingsContentProps } from './types';
import styles from './MeetingSettingsContent.module.scss';

const Component = ({
    title,
    stream,
    isBackgroundActive,
    onBackgroundToggle,
    backgroundVolume,
    onChangeBackgroundVolume,
    isAuraActive,
    onToggleAura,
    isAudioActive,
}: MeetingSettingsContentProps) => {
    const { isSafari, isMobile } = useBrowserDetect();

    const {
        value: isAudioVideoSettingsOpened,
        onSwitchOff: handleCloseAudioVideoSettings,
        onSwitchOn: handleOpenAudioVideoSettings,
    } = useToggle(isMobile || isSafari);

    useEffect(() => {
        if (isSafari) {
            handleOpenAudioVideoSettings();
        }
    }, [isSafari]);

    const handleChangeVolume = useCallback(event => {
        onChangeBackgroundVolume(event.target.value);
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            className={styles.settingsWrapper}
        >
            <CustomGrid
                className={clsx(styles.settingPosition, {
                    [styles.relative]: !isAudioVideoSettingsOpened,
                })}
            >
                <Fade in={!isAudioVideoSettingsOpened} unmountOnExit>
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
                                onClick={
                                    !isSafari
                                        ? handleOpenAudioVideoSettings
                                        : undefined
                                }
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
                            <ConditionalRender condition={!isSafari}>
                                <LabeledSwitch
                                    Icon={
                                        <BackgroundBlurIcon
                                            width="24px"
                                            height="24px"
                                        />
                                    }
                                    nameSpace="meeting"
                                    translation="features.blurBackground"
                                    checked={isAuraActive}
                                    onChange={onToggleAura}
                                    className={styles.switchWrapper}
                                />
                            </ConditionalRender>
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
            </CustomGrid>
            <CustomGrid
                className={clsx(styles.advancedSettings, {
                    [styles.relative]: isAudioVideoSettingsOpened,
                })}
            >
                <Fade in={isAudioVideoSettingsOpened} unmountOnExit>
                    <CustomGrid container>
                        <CustomGrid container gap={1.5} alignItems="center">
                            <ConditionalRender
                                condition={!isMobile && !isSafari}
                            >
                                <ArrowIcon
                                    className={styles.arrowIcon}
                                    width="32px"
                                    height="32px"
                                    onClick={handleCloseAudioVideoSettings}
                                />
                            </ConditionalRender>
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
                            <ConditionalRender condition={isAudioActive}>
                                <CustomGrid
                                    container
                                    direction="column"
                                    wrap="nowrap"
                                    className={clsx(styles.audioSettings, {
                                        [styles.withVolume]: isBackgroundActive,
                                    })}
                                >
                                    <LabeledSwitch
                                        Icon={
                                            <MusicIcon
                                                width="24px"
                                                height="24px"
                                            />
                                        }
                                        nameSpace="meeting"
                                        translation="features.audioBackground"
                                        checked={isBackgroundActive}
                                        onChange={onBackgroundToggle}
                                        className={styles.audioWrapper}
                                    />
                                    <CustomFade open={isBackgroundActive}>
                                        <CustomDivider />
                                        <CustomRange
                                            color={
                                                backgroundVolume
                                                    ? 'primary'
                                                    : 'disabled'
                                            }
                                            value={backgroundVolume}
                                            onChange={handleChangeVolume}
                                            className={clsx(styles.audioRange, {
                                                [styles.inactive]:
                                                    !backgroundVolume,
                                            })}
                                            Icon={
                                                <SpeakerIcon
                                                    isActive={Boolean(
                                                        backgroundVolume,
                                                    )}
                                                    isHalfVolume={
                                                        backgroundVolume < 50
                                                    }
                                                    width="24px"
                                                    height="24px"
                                                />
                                            }
                                        />
                                    </CustomFade>
                                </CustomGrid>
                            </ConditionalRender>
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        </CustomGrid>
    );
};

export const MeetingSettingsContent = memo(Component);
