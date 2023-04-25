import React, { memo } from 'react';
import clsx from 'clsx';

import { CardExpiryElement, CardExpiryElementProps } from '@stripe/react-stripe-js';
import { PropsWithClassName } from 'shared-frontend/types';

import styles from '../StripeCommon.module.scss';

interface Props extends CardExpiryElementProps{
    colorForm?: string
}

const Component = ({ className, colorForm = 'white', ...rest }: PropsWithClassName<Props>) => (
    <CardExpiryElement
        className={clsx(styles.cardField, className)}
        options={{
            placeholder: 'MM.YY',
            classes: {
                empty: styles.empty,
                focus: styles.focus,
            },
            style: {
                base: {
                    color: colorForm,
                    lineHeight: '58px',
                    fontSize: '16px',
                    height: '58px',
                    '::placeholder': {
                        color: ' rgba(white, 0.6)',
                    },
                },
            },
        }}
        {...rest}
    />
);

export const StripeCardExpiry = memo(Component);
