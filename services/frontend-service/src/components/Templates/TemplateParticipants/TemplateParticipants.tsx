import React, { memo } from 'react';

import { AuthorLogo } from 'shared-frontend/icons/OtherIcons/AuthorLogo';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import { TemplateParticipantsProps } from './types';

import styles from './TemplateParticipants.module.scss';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

const TemplateParticipants = memo(
    ({ number, authorRole, authorThumbnail }: TemplateParticipantsProps) => (
        <CustomGrid
            item
            alignItems="center"
            className={styles.templateParticipant}
        >
            <ConditionalRender condition={authorRole === 'admin'}>
                <AuthorLogo width="18px" height="18px" />
            </ConditionalRender>
            <ConditionalRender
                condition={authorRole === 'user' && Boolean(authorThumbnail)}
            >
                <CustomImage
                    src={authorThumbnail || ''}
                    width={20}
                    height={20}
                />
            </ConditionalRender>
            <CustomTypography variant="body2" color="colors.black.primary">
                {number}
            </CustomTypography>
        </CustomGrid>
    ),
);

export { TemplateParticipants };
