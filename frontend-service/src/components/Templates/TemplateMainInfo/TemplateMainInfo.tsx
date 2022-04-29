import React, { memo } from 'react';

import { Fade } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { TemplateParticipants } from '@components/Templates/TemplateParticipants/TemplateParticipants';
import { TemplatePaymentType } from '@components/Templates/TemplatePaymentType/TemplatePaymentType';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// types
import { TemplateMainInfoProps } from '@components/Templates/TemplateMainInfo/types';

// styles
import styles from './TemplateMainInfo.module.scss';

const Component = ({
    show,
    name,
    description,
    maxParticipants,
    type,
    isNeedToShowBusinessInfo = true,
    avatar,
}: TemplateMainInfoProps) => (
        <Fade in={show}>
            <CustomGrid className={styles.templateInfo} display="grid">
                <ProfileAvatar
                    className={styles.participants}
                    src={avatar}
                    width="38px"
                    height="38px"
                    userName={name}
                />
                <CustomTypography
                    variant="body1"
                    fontWeight={600}
                    color="common.white"
                    className={styles.title}
                >
                    {name}
                </CustomTypography>
                <CustomTypography
                    variant="body3"
                    color="common.white"
                    className={styles.description}
                >
                    {description}
                </CustomTypography>
                <CustomBox className={styles.emptySpace} />
                {isNeedToShowBusinessInfo && (
                    <CustomGrid
                        container
                        alignItems="flex-end"
                        gap={1}
                        className={styles.businessInfo}
                    >
                        <TemplateParticipants number={maxParticipants} />
                        <TemplatePaymentType type={type} />
                    </CustomGrid>
                )}
            </CustomGrid>
        </Fade>
    )

export const TemplateMainInfo = memo<TemplateMainInfoProps>(Component);
