import {memo} from "react";
import clsx from 'clsx';

import { CardNumberElement } from '@stripe/react-stripe-js';

import styles from './CardNumberField.module.scss';

const Component = ({ className, ...rest }) => (
        <CardNumberElement
            className={clsx(styles.cardField, className)}
            options={{
                classes: {
                    base: styles.cardField,
                    empty: styles.empty,
                    focus: styles.focus
                },
                style: {
                    base: {
                        color: 'white',
                        lineHeight: '58px',
                        fontSize: '16px',
                        height: "58px",
                        "&::placeholder": {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    },
                },
            }}
            {...rest}
        />
    )

export const CardNumberField = memo(Component);