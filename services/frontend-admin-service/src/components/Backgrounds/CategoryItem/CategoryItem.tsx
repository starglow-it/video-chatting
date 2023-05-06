import { memo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './CategoryItem.module.scss';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';

const Component = () => {
    return (
        <CustomPaper  className={styles.wrapper}>
            <CustomGrid container flexDirection="row" alignItems="center">
                <CustomGrid className={styles.emoji}>{String.fromCodePoint('0x1f600')}</CustomGrid>
                <CustomTypography>Breathing!!</CustomTypography>
            </CustomGrid>
        </CustomPaper>
    );
};
export const CategoryItem = memo(Component);
