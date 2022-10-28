import React, { memo } from 'react';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { LockIcon } from '@library/icons/LockIcon';
import { PeopleIcon } from '@library/icons/PeopleIcon';

// types
import { PropsWithClassName } from '../../../types';
import { Template } from '../../../store/types';

// styles
import styles from './TemplateInfo.module.scss';

const Component = ({
    className,
    description,
    name,
    isPublic,
}: PropsWithClassName<{
    name: Template['name'];
    description: Template['description'];
    isPublic?: Template['isPublic'];
}>) => (
    <CustomGrid container wrap="nowrap" className={className}>
        <CustomGrid container direction="column" className={styles.textWrapper}>
            <CustomGrid container flexWrap="nowrap" alignItems="center" gap={0.25}>
                <ConditionalRender condition={isPublic === true}>
                    <PeopleIcon width="20px" height="20px" className={styles.icon} />
                </ConditionalRender>
                <ConditionalRender condition={isPublic === false}>
                    <LockIcon width="20px" height="20px" className={styles.icon} />
                </ConditionalRender>
                <CustomTypography
                    variant="body1"
                    fontWeight={600}
                    color="common.white"
                    className={styles.title}
                >
                    {name}
                </CustomTypography>
            </CustomGrid>
            <CustomTypography variant="body3" color="common.white" className={styles.description}>
                {description}
            </CustomTypography>
        </CustomGrid>
    </CustomGrid>
);

export const TemplateInfo = memo(Component);
