import React, { memo } from 'react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// shared
import { CustomImage } from 'shared-frontend/library';

// styles
import styles from './NotValidLink.module.scss';

const Component = () => (
    <CustomGrid container direction="column" justifyContent="center" alignItems="center">
        <CustomImage src="/images/clock.png" width="52px" height="52px" />
        <CustomTypography
            className={styles.title}
            variant="h2bold"
            nameSpace="common"
            translation="linkNotValid.title"
        />
        <CustomTypography textAlign="center" nameSpace="common" translation="linkNotValid.text" />
    </CustomGrid>
);

export const NotValidLink = memo(Component);
