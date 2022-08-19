import React, { memo } from 'react';
import clsx from 'clsx';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import { PaymentIcon } from '@library/icons/PaymentIcon';
import { TemplatePaymentTypeProps } from './types';

import styles from './TemplatePaymentTypeProps.module.scss';

const TemplatePaymentType = memo(
    ({ priceInCents = 0, type = 'free' }: TemplatePaymentTypeProps) => (
        <CustomGrid
            item
            alignItems="center"
            className={clsx(styles.templatePayment, { [styles.paid]: Boolean(priceInCents) })}
        >
            <PaymentIcon width="22px" height="22px" />
            <CustomTypography
                variant="body2"
                color={priceInCents ? 'colors.blue.primary' : 'colors.green.primary'}
            >
                {priceInCents ? priceInCents / 100 : type}
            </CustomTypography>
        </CustomGrid>
    ),
);

export { TemplatePaymentType };
