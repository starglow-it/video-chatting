import { memo, useEffect } from 'react';
import { useStore } from 'effector-react';

// hooks

import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PaymentType } from 'shared-const';
import {
    createPaymentIntentWithData,
    $paymentIntent,
    $enabledPaymentPaywallParticipant,
    $enabledPaymentPaywallAudience,
    $paymentPaywallAudience,
    $paymentPaywallParticipant,
} from '../../../store/roomStores';

// types
import styles from './MeetingPaywall.module.scss';

interface Props {
    onPaymentSuccess: () => void;
}
const Component = ({ onPaymentSuccess }: Props) => {
    const paymentIntent = useStore($paymentIntent);
    const intentId = paymentIntent?.id;
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const enabledPaymentPaywallParticipant = useStore(
        $enabledPaymentPaywallParticipant,
    );
    const enabledPaymentPaywallAudience = useStore($enabledPaymentPaywallAudience);
    const paymentPaywallParticipant = useStore($paymentPaywallParticipant);
    const paymentPaywallAudience = useStore($paymentPaywallAudience);

    const initStripe = () => {
        if (!isCreatePaymentIntentPending && !intentId) {
            if (
                enabledPaymentPaywallParticipant ||
                enabledPaymentPaywallAudience
            ) {
                createPaymentIntentWithData({
                    paymentType: PaymentType.Paywall,
                });
            }
        }
    };

    useEffect(() => {
        initStripe();
    }, []);
    return (
        <CustomBox sx={{ width: '100%' }}>
            <CustomTypography
                nameSpace="subscriptions"
                translation="paywall.title"
                textAlign="center"
                marginBottom={1}
                component="div"
                className={styles.title}
            />
            <ConditionalRender condition={enabledPaymentPaywallParticipant}>
                <PaymentForm
                    onClose={onPaymentSuccess}
                    payment={paymentPaywallParticipant}
                    subLabel={
                        <CustomTypography
                            nameSpace="subscriptions"
                            translation="paywall.labelForm"
                            sx={{
                                marginRight: '5px',
                            }}
                        />
                    }
                />
            </ConditionalRender>
            <ConditionalRender condition={enabledPaymentPaywallAudience}>
                <PaymentForm
                    onClose={onPaymentSuccess}
                    payment={paymentPaywallAudience}
                    subLabel={
                        <CustomTypography
                            nameSpace="subscriptions"
                            translation="paywall.labelForm"
                            sx={{
                                marginRight: '5px',
                            }}
                        />
                    }
                />
            </ConditionalRender>
        </CustomBox>
    );
};

export const MeetingPaywall = memo(Component);
