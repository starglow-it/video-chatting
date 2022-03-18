import React, { memo } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import styles from './MeetingBackgroundVideo.module.scss';

const MeetingBackgroundVideo = memo(({ src }: { src: string }) => (
    <CustomGrid className={styles.backgroundVideo} container justifyContent="center" alignItems="center">
        <video className={styles.video} src={src} autoPlay playsInline controls={false} loop />
        <video className={styles.videoFullHeight} src={src} autoPlay playsInline controls={false} loop />
        />
    </CustomGrid>
));

export { MeetingBackgroundVideo };
