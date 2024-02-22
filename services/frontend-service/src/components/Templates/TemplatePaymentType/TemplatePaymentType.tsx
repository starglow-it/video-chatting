import { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { PaymentIcon } from 'shared-frontend/icons/OtherIcons/PaymentIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { TemplatePaymentTypeProps } from './types';

// styles
import styles from './TemplatePaymentTypeProps.module.scss';

const Component = ({
    priceInCents = 0,
    type = 'free',
}: TemplatePaymentTypeProps) => (
    <CustomGrid
        item
        alignItems="center"
        className={clsx(styles.templatePayment, {
            [styles.paid]: Boolean(priceInCents),
        })}
    >
        <PaymentIcon width="22px" height="22px" />
        <CustomTypography
            variant="body2"
            color={
                priceInCents ? 'colors.blue.primary' : 'colors.green.primary'
            }
            className={styles.typeText}
        >
            {priceInCents ? priceInCents / 100 : type}
        </CustomTypography>
    </CustomGrid>
);

export const TemplatePaymentType = memo(Component);
