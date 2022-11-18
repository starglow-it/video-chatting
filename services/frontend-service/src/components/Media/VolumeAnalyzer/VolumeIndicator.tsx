import React, { memo } from 'react';
import { alpha } from '@mui/material';

import { CustomGrid , CustomBox } from 'shared-frontend/library';
import styles from './VolumeAnalyzer.module.scss';

const VolumeIndicator = memo(({ opacity }: { opacity: number }) => (
    <CustomGrid
        className={styles.indicator}
        sx={{
            background: theme => `${alpha(theme.palette.success.main, opacity)}`,
        }}
    >
        <CustomBox className={styles.inactiveIndicator} />
    </CustomGrid>
));

export { VolumeIndicator };
