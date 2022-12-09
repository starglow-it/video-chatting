import React, { memo } from 'react';

import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

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
