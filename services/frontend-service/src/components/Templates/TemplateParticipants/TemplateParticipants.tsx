import { memo } from 'react';

import { AuthorLogo } from 'shared-frontend/icons/OtherIcons/AuthorLogo';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { TemplateParticipantsProps } from './types';

import styles from './TemplateParticipants.module.scss';

const TemplateParticipants = memo(
    ({
        number,
        authorRole,
        authorThumbnail,
        authorName,
    }: TemplateParticipantsProps) => (
        <CustomGrid
            item
            alignItems="center"
            className={styles.templateParticipant}
        >
            <ConditionalRender condition={authorRole === 'admin'}>
                <AuthorLogo width="18px" height="18px" />
            </ConditionalRender>
            <ConditionalRender condition={authorRole === 'user'}>
                <ProfileAvatar
                    src={authorThumbnail || ''}
                    width="18px"
                    height="18px"
                    userName={authorName || ''}
                />
            </ConditionalRender>
            <CustomTypography
                variant="body2"
                color="colors.black.primary"
                marginLeft="3px"
            >
                {number}
            </CustomTypography>
        </CustomGrid>
    ),
);

export { TemplateParticipants };
