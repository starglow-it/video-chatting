import React, { memo } from 'react';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// types
import { PropsWithClassName } from '../../../types';
import { Template } from '../../../store/types';

// styles
import styles from './TemplateInfo.module.scss';

const Component = ({
    className,
    description,
    name,
}: PropsWithClassName<{
    name: Template['name'];
    description: Template['description'];
}>) => (
    <CustomGrid container wrap="nowrap" className={className}>
        <CustomGrid container direction="column" className={styles.textWrapper}>
            <CustomTypography
                variant="body1"
                fontWeight={600}
                color="common.white"
                className={styles.title}
            >
                {name}
            </CustomTypography>
            <CustomTypography variant="body3" color="common.white" className={styles.description}>
                {description}
            </CustomTypography>
        </CustomGrid>
    </CustomGrid>
);

export const TemplateInfo = memo(Component);
