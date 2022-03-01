import React, { memo } from 'react';
import clsx from 'clsx';

// custom components
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { BusinessCategoryItemProps } from './types';

// styles
import styles from './BusinessCategoryItem.module.scss';

const BusinessCategoryItem = memo(
    ({ category, className, typographyVariant }: BusinessCategoryItemProps) => (
        <CustomGrid item alignItems="center" className={clsx(styles.categoryWrapper, className)}>
            <CustomTypography
                className={styles.tagText}
                variant={typographyVariant}
                component="span"
                color={category.color}
            >
                {category.value}
            </CustomTypography>
        </CustomGrid>
    ),
);

export { BusinessCategoryItem };
