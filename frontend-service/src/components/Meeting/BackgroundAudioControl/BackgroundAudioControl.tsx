import React, { useRef, useCallback, memo } from "react";
import {useStore} from "effector-react";
import clsx from "clsx";

// helpers
import {useToggle} from "../../../hooks/useToggle";

// custom
import {CustomPaper} from "@library/custom/CustomPaper/CustomPaper";
import {CustomTooltip} from "@library/custom/CustomTooltip/CustomTooltip";
import {CustomRange} from "@library/custom/CustomRange/CustomRange";
import {CustomPopper} from "@library/custom/CustomPopper/CustomPopper";

// components
import {ActionButton} from "@library/common/ActionButton/ActionButton";

// icons
import {SpeakerIcon} from "@library/icons/SpeakerIcon/SpeakerIcon";

// styles
import styles from './BackgroundAudioControl.module.scss';

// stores
import {$backgroundAudioVolume, $isBackgroundAudioActive, setBackgroundAudioVolume} from "../../../store/other";

const Component = () => {
    const volume = useStore($backgroundAudioVolume);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);

    const buttonRef = useRef(null);

    const {
        value: isAudioControlOpen,
        onToggleSwitch: handleToggleAudioControl
    } = useToggle(false);

    const handleMouseEnter = useCallback(() => {
        if (isBackgroundAudioActive) {
            handleToggleAudioControl()
        }
    }, [isBackgroundAudioActive]);

    const handleMouseLeave = useCallback(() => {
        if (isBackgroundAudioActive) {
            handleToggleAudioControl()
        }
    }, [isBackgroundAudioActive]);

    const handleChangeVolume = useCallback((event) => {
        setBackgroundAudioVolume(event.target.value);
    },[]);

    return (
        <CustomTooltip
            classes={{ tooltip: styles.tooltip }}
            nameSpace="meeting"
            translation={isBackgroundAudioActive ? "features.audioBackground" : "features.audioBackgroundDisabled"}
        >
            <CustomPaper variant="black-glass" className={styles.deviceButton} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <ActionButton
                    ref={buttonRef}
                    className={clsx(styles.iconButton, {[styles.disabled]: !isBackgroundAudioActive })}
                    Icon={<SpeakerIcon isActive width="32px" height="32px" />}
                />
                <CustomPopper
                    id="audioControl"
                    open={isAudioControlOpen}
                    anchorEl={buttonRef.current}
                >
                    <CustomPaper variant="black-glass" className={styles.audioControl}>
                        <CustomRange
                            className={styles.range}
                            color="primary"
                            value={volume}
                            onChange={handleChangeVolume}
                            orientation="vertical"
                        />
                    </CustomPaper>
                </CustomPopper>
            </CustomPaper>
        </CustomTooltip>
    );
};

export const BackgroundAudioControl = memo(Component);