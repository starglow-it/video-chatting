import { memo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './MediaItem.module.scss';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';

const Component = () => {
    return (
        <CustomPaper  className={styles.wrapper}>
            <CustomGrid container flexDirection="row" alignItems="center">
                <CustomTypography>Breathing!!</CustomTypography>
            </CustomGrid>
        </CustomPaper>
    );
};
export const MediaItem = memo(Component);
