import React, { memo } from 'react';
import clsx from 'clsx';

import { CardNumberElement, CardNumberElementProps } from '@stripe/react-stripe-js';

import styles from '../StripeCommon.module.scss';

import { PropsWithClassName } from '../../../types';

const Component = ({ className, ...rest }: PropsWithClassName<CardNumberElementProps>) => (
    <CardNumberElement
        className={clsx(styles.cardField, className)}
        options={{
            placeholder: 'Card number',
            classes: {
                empty: styles.empty,
                focus: styles.focus,
            },
            style: {
                base: {
                    color: 'white',
                    lineHeight: '58px',
                    fontSize: '16px',
                    height: '58px',
                    '::placeholder': {
                        color: 'rgba(white, 0.6)',
                        fontFamily: 'Poppins, sans-serif',
                    },
                },
            },
        }}
        {...rest}
    />
);

export const StripeCardNumber = memo(Component);
