import React, { memo } from 'react';
import clsx from 'clsx';

import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

import styles from './CenteredPaper.module.scss';

// types
import { CenteredPaperProps } from './types';

const CenteredPaper = memo(
    ({ className, children }: React.PropsWithChildren<CenteredPaperProps>) => (
        <CustomPaper className={clsx(styles.wrapper, className)}>{children}</CustomPaper>
    ),
);

export { CenteredPaper };
