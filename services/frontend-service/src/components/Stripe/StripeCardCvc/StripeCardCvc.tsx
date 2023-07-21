import { memo } from 'react';
import clsx from 'clsx';

import { CardCvcElement, CardCvcElementProps } from '@stripe/react-stripe-js';

import { PropsWithClassName } from 'shared-frontend/types';

import styles from '../StripeCommon.module.scss';

interface Props extends CardCvcElementProps {
    colorForm?: string;
}

const Component = ({
    className,
    colorForm = 'white',
    ...rest
}: PropsWithClassName<Props>) => (
    <CardCvcElement
        className={clsx(styles.cardField, className)}
        options={{
            placeholder: 'CVC',
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
                        color: `rgba(${colorForm}, 0.6)`,
                    },
                },
            },
        }}
        {...rest}
    />
);

export const StripeCardCvc = memo(Component);
