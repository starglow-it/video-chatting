import React, { memo } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import { PaymentIcon } from '@library/icons/PaymentIcon';
import { TemplatePaymentTypeProps } from './types';

import styles from './TemplatePaymentTypeProps.module.scss';

const TemplatePaymentType = memo(({ type }: TemplatePaymentTypeProps) => (
    <CustomGrid item alignItems="center" className={styles.templatePayment}>
        <PaymentIcon width="22px" height="22px" />
        <CustomTypography variant="body2" color="colors.green.primary">
            {type}
        </CustomTypography>
    </CustomGrid>
));

export { TemplatePaymentType };
