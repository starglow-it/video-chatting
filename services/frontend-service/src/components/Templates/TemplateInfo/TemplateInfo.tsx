import React, { memo } from 'react';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { LockIcon } from 'shared-frontend/icons';
import { PeopleIcon } from 'shared-frontend/icons';

// types
import { PropsWithClassName } from 'shared-frontend/types';
import { TemplateInfoProps } from '@components/Templates/TemplateInfo/types';

// styles
import styles from './TemplateInfo.module.scss';

const Component = ({
    className,
    description,
    name,
    isPublic,
    isCommonTemplate,
}: PropsWithClassName<TemplateInfoProps>) => (
    <CustomGrid container wrap="nowrap" className={className}>
        <CustomGrid container direction="column" className={styles.textWrapper}>
            <CustomGrid container flexWrap="nowrap" alignItems="center" gap={0.25}>
                <ConditionalRender condition={Boolean(isPublic)}>
                    <PeopleIcon width="20px" height="20px" className={styles.icon} />
                </ConditionalRender>
                <ConditionalRender condition={!isPublic && !isCommonTemplate}>
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
