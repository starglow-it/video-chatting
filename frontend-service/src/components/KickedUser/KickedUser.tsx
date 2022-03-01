import React, { memo } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import { WarningIcon } from '@library/icons/WarningIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import styles from './KickedUser.module.scss';

const KickedUser = memo(() => (
    <CustomPaper className={styles.wrapper}>
        <CustomGrid direction="column" container alignItems="center" justifyContent="center">
            <CustomGrid container alignItems="center" justifyContent="center">
                <WarningIcon width="36px" height="36px" className={styles.icon} />
                <CustomTypography variant="h3bold" nameSpace="meeting" translation="over" />
            </CustomGrid>
            <CustomTypography className={styles.text} nameSpace="meeting" translation="kicked" />
        </CustomGrid>
    </CustomPaper>
));

export { KickedUser };
