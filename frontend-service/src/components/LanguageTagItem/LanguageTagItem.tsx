import React, { memo } from 'react';
import clsx from 'clsx';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import { LanguageTagItemProps } from './types';

import styles from './LanguageTagItem.module.scss';

const LanguageTagItem = memo(({ className, language }: LanguageTagItemProps) => (
    <CustomGrid item alignItems="center" className={clsx(styles.languageWrapper, className)}>
        <CustomTypography component="span">{language?.value}</CustomTypography>
    </CustomGrid>
));

export { LanguageTagItem };
