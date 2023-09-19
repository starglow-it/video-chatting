import { memo, useCallback } from 'react';
import clsx from 'clsx';
import { Fade } from '@mui/material';

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

// icons

// styles

// types
import { BackgroundBlurIcon } from 'shared-frontend/icons/OtherIcons/BackgroundBlurIcon';
import { ArrowIcon } from 'shared-frontend/icons/OtherIcons/ArrowIcon';
import { SpeakerIcon } from 'shared-frontend/icons/OtherIcons/SpeakerIcon';
import { MusicIcon } from 'shared-frontend/icons/OtherIcons/MusicIcon';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { CameraIcon } from 'shared-frontend/icons/OtherIcons/CameraIcon';
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
    isCamera,
    isMicrophone,
    onToggleCamera,
    onToggleMicrophone,
}: MeetingSettingsContentProps) => {
    const { isSafari, isMobile } = useBrowserDetect();

    const {
        value: isAudioVideoSettingsOpened,
        onSwitchOff: handleCloseAudioVideoSettings,
        onSwitchOn: handleOpenAudioVideoSettings,
    } = useToggle(isMobile);

    // useEffect(() => {
    //     if (isSafari) {
    //         handleOpenAudioVideoSettings();
    //     }
    // }, [isSafari]);

    const handleChangeVolume = useCallback((event: any) => {
        onChangeBackgroundVolume(event.target.value);
    }, []);

    const buttonsSize = isMobile ? '24px' : '24px';

    const renderManageDevice = () => {
        return (
            <CustomGrid container gap={2} direction="column">
                <LabeledSwitch
                    Icon={
                        <CameraIcon
                            width={buttonsSize}
                            height={buttonsSize}
                            className={styles.gapIcon}
                            isActive
                        />
                    }
                    nameSpace="meeting"
                    translation="features.peopleSeeMe"
                    checked={isCamera}
                    onChange={onToggleCamera}
                    className={clsx(styles.switchWrapper, {
                        [styles.switchWrapperMobile]: isMobile,
                    })}
                />
                <LabeledSwitch
                    Icon={
                        <MicIcon
                            width={buttonsSize}
                            height={buttonsSize}
                            className={styles.gapIcon}
                            isActive
                        />
                    }
                    nameSpace="meeting"
                    translation="features.peopleHearMe"
                    checked={isMicrophone}
                    onChange={onToggleMicrophone}
                    className={clsx(styles.switchWrapper, {
                        [styles.switchWrapperMobile]: isMobile,
                    })}
                />
            </CustomGrid>
        );
    };

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
                        {renderManageDevice()}
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
                            <ConditionalRender condition={!isMobile}>
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
                                sx={{
                                    fontSize: {
                                        xs: '18px',
                                        sm: '18px',
                                        xl: '24px',
                                        md: '24px',
                                    },
                                    lineHeight: {
                                        xs: '28px',
                                        sm: '28px',
                                        xl: '36px',
                                        md: '36px',
                                    },
                                    marginBottom: {
                                        xs: '15px',
                                        sm: '15px',
                                        xl: '0px',
                                        md: '0px',
                                    },
                                }}
                            />
                        </CustomGrid>
                        <ConditionalRender condition={isMobile}>
                            {renderManageDevice()}
                        </ConditionalRender>
                        <CustomGrid
                            container
                            direction="column"
                            gap={2}
                            className={styles.selectDevicesWrapper}
                            sx={{
                                marginTop: {
                                    xs: '15px',
                                    sm: '15px',
                                    xl: '30px',
                                    md: '30px',
                                },
                            }}
                        >
                            <SelectDevices key={stream?.id} />
                            <ConditionalRender condition={!isSafari}>
                                <LabeledSwitch
                                    Icon={
                                        <BackgroundBlurIcon
                                            width="24px"
                                            height="24px"
                                            className={styles.gapIcon}
                                        />
                                    }
                                    nameSpace="meeting"
                                    translation="features.blurBackground"
                                    checked={isAuraActive}
                                    onChange={onToggleAura}
                                    className={clsx(styles.switchWrapper, {
                                        [styles.switchWrapperMobile]: isMobile,
                                    })}
                                />
                            </ConditionalRender>
                            <ConditionalRender
                                condition={isAudioActive && !isMobile}
                            >
                                <CustomGrid
                                    container
                                    direction="column"
                                    wrap="nowrap"
                                    className={clsx(styles.audioSettings, {
                                        [styles.withVolume]:
                                            isBackgroundActive && !isMobile,
                                        [styles.mobile]: isMobile,
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
                                        className={clsx(styles.audioWrapper, {
                                            [styles.switchWrapperMobile]:
                                                isMobile,
                                        })}
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
                                            sx={{
                                                padding: {
                                                    xs: '0px 11px 6px 10px',
                                                    sm: '0px 11px 6px 10px',
                                                    xl: '13px 22px 13px 10px',
                                                    md: '13px 22px 13px 10px',
                                                },
                                            }}
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
