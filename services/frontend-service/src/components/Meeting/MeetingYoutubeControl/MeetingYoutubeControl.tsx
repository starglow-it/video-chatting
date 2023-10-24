import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { InputAdornment } from '@mui/material';
import { CopyLinkIcon } from 'shared-frontend/icons/OtherIcons/CopyLinkIcon';
import { CustomRange } from '@library/custom/CustomRange/CustomRange';
import { useCallback } from 'react';
import { SpeakerIcon } from 'shared-frontend/icons/OtherIcons/SpeakerIcon';
import clsx from 'clsx';
import { YoutubeIcon } from 'shared-frontend/icons/OtherIcons/YoutubeIcon';
import {
    $meetingYoutubeStore,
    toggleMuteYoutubeEvent,
    updateUrlYoutubeEvent,
    updateVolumeYoutubeEvent,
} from 'src/store/roomStores';
import { useStore } from 'effector-react';
import styles from './MeetingYoutubeControl.module.scss';

export const MeetingYoutubeControl = () => {
    const { volume, muted } = useStore($meetingYoutubeStore);

    const handleChangeVolume = useCallback(
        (e: Event, value: number | number[]) => {
            const newVolume = typeof value === 'number' ? value : 0;

            updateVolumeYoutubeEvent(newVolume);
        },
        [],
    );

    const handleChangeUrl = useCallback((e: any) => {
        updateUrlYoutubeEvent(e.target.value);
    }, []);

    return (
        <CustomGrid
            className={styles.container}
            display="flex"
            flexDirection="column"
            gap={1}
            marginTop="5px"
            p={1}
        >
            <CustomGrid display="flex" alignItems="center" gap={1}>
                <YoutubeIcon width="22px" height="22px" />
                <CustomTypography
                    nameSpace="meeting"
                    translation="youtubeVideo"
                    fontSize={13}
                    color="colors.white.primary"
                    fontWeight="bold"
                />
            </CustomGrid>

            <CustomInput
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <CopyLinkIcon
                                width="23px"
                                height="23px"
                                className={styles.icon}
                            />
                        </InputAdornment>
                    ),
                    classes: { root: styles.textField },
                }}
                placeholder="Type a Youtube url"
                onChange={handleChangeUrl}
            />

            <CustomGrid display="flex" flexDirection="column" gap={1}>
                <CustomTypography
                    nameSpace="meeting"
                    translation="originalVideoSound"
                    color="colors.white.primary"
                    fontSize={12}
                />
                <CustomRange
                    color="secondary"
                    value={volume}
                    onChange={handleChangeVolume}
                    className={clsx(styles.audioRange, {
                        [styles.inactive]: !volume,
                    })}
                    size="small"
                    Icon={
                        <SpeakerIcon
                            isActive={!muted && volume > 0}
                            isHalfVolume={volume < 50}
                            width="18px"
                            height="18px"
                            className={styles.icon}
                            onClick={() => toggleMuteYoutubeEvent()}
                        />
                    }
                    classes={{ thumb: styles.thumb, root: styles.thumbRoot }}
                />
            </CustomGrid>
        </CustomGrid>
    );
};
