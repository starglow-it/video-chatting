import { memo } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// types
import { isMobile } from 'shared-utils';
import CustomVideoPlayer from '@library/custom/CustomVideoPlayer/CustomVideoPlayer';
import { CustomYoutubePlayer } from '@library/custom/CustomYoutubePlayer/CustomYoutubePlayer';
import { MeetingBackgroundVideoProps } from './types';

// stores
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    $isScreenSharingStore,
    $meetingYoutubeStore,
} from '../../../store/roomStores';

// styles
import styles from './MeetingBackgroundVideo.module.scss';

const Component = ({
    children,
    src,
    templateType,
    videoClassName = '',
}: MeetingBackgroundVideoProps) => {
    const isScreenSharing = useStore($isScreenSharingStore);
    const isAudioBackgroundActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const { url, volume } = useStore($meetingYoutubeStore);
    console.log('#Duy Phan console', url);

    return (
        <ConditionalRender condition={Boolean(src)}>
            <CustomGrid
                className={clsx([styles.backgroundVideo, videoClassName])}
            >
                <ConditionalRender
                    condition={templateType === 'video' && !isMobile()}
                >
                    <CustomVideoPlayer
                        isPlaying={!isScreenSharing}
                        isMuted={!isAudioBackgroundActive}
                        volume={backgroundAudioVolume}
                        src={src}
                        className={styles.player}
                    />
                </ConditionalRender>

                <CustomYoutubePlayer
                    url={url}
                    className={styles.player}
                    volume={volume}
                />

                {children}
            </CustomGrid>
        </ConditionalRender>
    );
};

export const MeetingBackgroundVideo = memo(Component);
