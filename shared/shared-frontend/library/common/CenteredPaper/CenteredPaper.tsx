import React, { memo } from 'react';
import clsx from 'clsx';

import { CustomPaper } from '../../custom/CustomPaper';

import styles from './CenteredPaper.module.scss';

// types
import { CenteredPaperProps } from './CenteredPaper.types';

const Component = ({ className, children }: React.PropsWithChildren<CenteredPaperProps>) => (
    <CustomPaper className={clsx(styles.wrapper, className)}>
        {children}
    </CustomPaper>
)

const CenteredPaper = memo(Component);

export default CenteredPaper;
