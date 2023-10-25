import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { InputAdornment } from '@mui/material';
import { CopyLinkIcon } from 'shared-frontend/icons/OtherIcons/CopyLinkIcon';
import { CustomRange } from '@library/custom/CustomRange/CustomRange';
import { useCallback, useState } from 'react';
import { SpeakerIcon } from 'shared-frontend/icons/OtherIcons/SpeakerIcon';
import clsx from 'clsx';
import { YoutubeIcon } from 'shared-frontend/icons/OtherIcons/YoutubeIcon';
import {
    $meetingStore,
    $meetingYoutubeStore,
    toggleMuteYoutubeEvent,
    updateMeetingEvent,
    updateMeetingSocketEvent,
    updateMeetingTemplateFxWithData,
} from 'src/store/roomStores';
import { useStore } from 'effector-react';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';
import { hasYoutubeUrlRegex } from 'shared-frontend/const/regexp';
import debounce from '@mui/utils/debounce';
import styles from './MeetingYoutubeControl.module.scss';

export const MeetingYoutubeControl = () => {
    const { muted } = useStore($meetingYoutubeStore);
    const { volume } = useStore($meetingStore);
    const [error, setError] = useState('');

    const handleSyncVolume = useCallback(
        debounce(newVolume => {
            updateMeetingSocketEvent({ volume: newVolume });
        }, 300),
        [],
    );

    const handleChangeVolume = useCallback(
        (e: Event, value: number | number[]) => {
            const newVolume = typeof value === 'number' ? value : 0;
            updateMeetingEvent({
                meeting: { volume: newVolume },
            } as any);
            handleSyncVolume(newVolume);
        },
        [],
    );

    const handleSyncUrl = useCallback(
        debounce(newUrl => {
            updateMeetingTemplateFxWithData({
                url: newUrl,
                templateType: 'link',
            });
        }, 300),
        [],
    );

    const handleChangeUrl = useCallback((e: any) => {
        const newValue = e.target.value;
        if (!hasYoutubeUrlRegex.test(newValue)) {
            setError('This link is invalid, please try again');
        } else {
            error && setError('');
        }
        handleSyncUrl(newValue);
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

            <CustomGrid display="flex" flexDirection="column" gap={1}>
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
                    placeholder="Paste a Youtube link here"
                    onChange={handleChangeUrl}
                />
                <ErrorMessage error={error} />
            </CustomGrid>

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
