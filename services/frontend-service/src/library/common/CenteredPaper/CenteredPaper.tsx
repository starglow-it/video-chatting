import React, { memo } from 'react';
import clsx from 'clsx';

import { RoundCloseIcon } from '@library/icons//RoundIcons/RoundCloseIcon';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

import styles from './CenteredPaper.module.scss';

// types
import { CenteredPaperProps } from './types';

const CenteredPaper = memo(
    ({ onClose, className, children }: React.PropsWithChildren<CenteredPaperProps>) => (
        <CustomPaper className={clsx(styles.wrapper, className)}>
            {Boolean(onClose) && (
                <RoundCloseIcon
                    width="24px"
                    height="24px"
                    className={styles.closeIcon}
                    onClick={onClose}
                />
            )}
            {children}
        </CustomPaper>
    ),
);

export { CenteredPaper };
