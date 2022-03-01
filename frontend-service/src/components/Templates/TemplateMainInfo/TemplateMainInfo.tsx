import React, { forwardRef, memo } from 'react';
import Image from 'next/image';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { TemplateParticipants } from '@components/Templates/TemplateParticipants/TemplateParticipants';
import { TemplatePaymentType } from '@components/Templates/TemplatePaymentType/TemplatePaymentType';

// types
import { TemplateMainInfoProps } from '@components/Templates/TemplateMainInfo/types';

// styles
import styles from './TemplateMainInfo.module.scss';

const TemplateMainInfo = memo(
    forwardRef(({ name, description, maxParticipants, type }: TemplateMainInfoProps, ref) => (
        <CustomGrid ref={ref} className={styles.templateInfo} display="grid">
            <CustomGrid container alignItems="center" className={styles.participants}>
                <Image src="/images/avatarStubImage1.png" layout="fill" />
            </CustomGrid>
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
            <CustomBox className={styles.emptySpace} />
            <CustomGrid container alignItems="flex-end" gap={1} className={styles.businessInfo}>
                <TemplateParticipants number={maxParticipants} />
                <TemplatePaymentType type={type} />
            </CustomGrid>
        </CustomGrid>
    )),
);

export { TemplateMainInfo };
