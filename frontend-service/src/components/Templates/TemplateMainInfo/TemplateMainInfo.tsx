import React, { memo } from 'react';
import { Fade } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { TemplateParticipants } from '@components/Templates/TemplateParticipants/TemplateParticipants';
import { TemplatePaymentType } from '@components/Templates/TemplatePaymentType/TemplatePaymentType';
import { TemplateInfo } from '@components/Templates/TemplateInfo/TemplateInfo';

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
}: TemplateMainInfoProps) => (
    <Fade in={show}>
        <CustomGrid className={styles.templateInfo} display="grid">
            <TemplateInfo className={styles.avatar} name={name} description={description} />
            <CustomBox className={styles.emptySpace} />
            {isNeedToShowBusinessInfo && (
                <CustomGrid container alignItems="flex-end" gap={1} className={styles.businessInfo}>
                    <TemplateParticipants number={maxParticipants} />
                    <TemplatePaymentType type={type} />
                </CustomGrid>
            )}
        </CustomGrid>
    </Fade>
);

export const TemplateMainInfo = memo<TemplateMainInfoProps>(Component);
