import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomPaper } from '../../custom/CustomPaper';

// types
import { PropsWithClassName } from '../../../types';

// styles
import styles from './HiddenPaper.module.scss';

const HiddenPaper = memo(
    ({
        className,
        open,
        children,
    }: React.PropsWithChildren<PropsWithClassName<{ open: boolean }>>) => (
        <CustomPaper className={clsx(className, styles.hiddenContainer, { [styles.open]: open })}>
            {children}
        </CustomPaper>
    ),
);

export default HiddenPaper;
