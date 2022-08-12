import React, { memo } from 'react';
import clsx from 'clsx';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import { TranslationProps } from '../Translation/types';
import { BlockSeparatorProps } from './types';

import styles from './BlockSeparator.module.scss';

const BlockSeparator = memo(
    ({ className, nameSpace, translation }: BlockSeparatorProps & TranslationProps) => (
        <CustomGrid
            container
            className={clsx(className, styles.blockSeparator)}
            alignItems="center"
            justifyContent="center"
        >
            <CustomTypography
                variant="body2"
                className={styles.blockSeparatorText}
                color="text.secondary"
                nameSpace={nameSpace}
                translation={translation}
            />
        </CustomGrid>
    ),
);

export { BlockSeparator };
