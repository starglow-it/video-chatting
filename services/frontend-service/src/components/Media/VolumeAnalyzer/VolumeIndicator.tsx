import { memo } from 'react';
import { alpha } from '@mui/material';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

import styles from './VolumeAnalyzer.module.scss';

const VolumeIndicator = memo(({ opacity }: { opacity: number }) => (
    <CustomGrid
        className={styles.indicator}
        sx={{
            background: theme =>
                `${alpha(theme.palette.success.main, opacity)}`,
        }}
    >
        <CustomBox className={styles.inactiveIndicator} />
    </CustomGrid>
));

export { VolumeIndicator };
