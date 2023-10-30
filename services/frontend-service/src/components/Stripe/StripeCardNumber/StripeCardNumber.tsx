import { memo } from 'react';
import clsx from 'clsx';

import {
    CardNumberElement,
    CardNumberElementProps,
} from '@stripe/react-stripe-js';

import { PropsWithClassName } from 'shared-frontend/types';
import styles from '../StripeCommon.module.scss';

interface Props extends CardNumberElementProps {
    colorForm?: string;
    styleBase?: any;
}
const Component = ({
    className,
    colorForm = 'white',
    styleBase,
    ...rest
}: PropsWithClassName<Props>) => {
    return (
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
                        color: colorForm,
                        lineHeight: '50px',
                        fontSize: '16px',
                        height: '58px',
                        '::placeholder': {
                            color: 'rgba(white, 0.6)',
                            fontFamily: 'Poppins, sans-serif',
                        },
                        ...styleBase,
                    },
                },
            }}
            {...rest}
        />
    );
};

export const StripeCardNumber = memo(Component);
