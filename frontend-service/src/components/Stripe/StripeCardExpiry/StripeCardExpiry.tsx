import React, { memo } from 'react';
import clsx from "clsx";

import { CardExpiryElement } from '@stripe/react-stripe-js';
import {PropsWithClassName} from "../../../types";

import styles from "../StripeCommon.module.scss";

const Component = ({ className, ...rest }: PropsWithClassName<any>) => (
        <CardExpiryElement
            className={clsx(styles.cardField, className)}
            options={{
                placeholder: "MM.YY",
                classes: {
                    empty: styles.empty,
                    focus: styles.focus
                },
                style: {
                    base: {
                        color: 'white',
                        lineHeight: '58px',
                        fontSize: '16px',
                        height: "58px",
                        "::placeholder": {
                            color:" rgba(white, 0.6)"
                        }
                    },
                },
            }}
            {...rest}
        />
    )

export const StripeCardExpiry = memo(Component);