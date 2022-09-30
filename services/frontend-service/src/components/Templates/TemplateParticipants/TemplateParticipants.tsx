import React, { memo } from 'react';
import { PeopleIcon } from '@library/icons/PeopleIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { TemplateParticipantsProps } from './types';

import styles from './TemplateParticipants.module.scss';

const TemplateParticipants = memo(({ number }: TemplateParticipantsProps) => (
    <CustomGrid item alignItems="center" className={styles.templateParticipant}>
        <PeopleIcon width="22px" height="22px" />
        <CustomTypography variant="body2" color="colors.black.primary">
            {number}
        </CustomTypography>
    </CustomGrid>
));

export { TemplateParticipants };
