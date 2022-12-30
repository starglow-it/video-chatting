import React, { memo } from 'react';

// utils

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { getRandomNumber } from '../../../utils/functions/getRandomNumber';

// shared

// styles
import styles from './ScreenSharingPlaceholder.module.scss';

const images = [
    '/images/winking-face.webp',
    '/images/eyes.webp',
    '/images/stars.webp',
    '/images/time-clock.webp',
];

const Component = () => (
    <CustomGrid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={styles.placeholder}
    >
        <CustomImage src={images[getRandomNumber(3)]} width="40px" height="40px" />
        <CustomTypography
            variant="body2"
            color="colors.white.primary"
            nameSpace="meeting"
            translation="modes.screensharing.selfSharing"
        />
    </CustomGrid>
);

export const ScreenSharingPlaceholder = memo(Component);
