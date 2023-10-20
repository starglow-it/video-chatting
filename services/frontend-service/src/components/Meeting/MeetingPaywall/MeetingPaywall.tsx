import { memo, useEffect } from 'react';
import { useStore } from 'effector-react';

// hooks

import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import {
    createPaymentIntentWithData,
    $paymentIntent,
    $enabledPaymentPaywallParticipant,
    $enabledPaymentPaywallLurker,
    $paymentPaywallLurker,
    $paymentPaywallParticipant,
} from '../../../store/roomStores';

// types
import styles from './MeetingPaywall.module.scss';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PaymentType } from 'shared-const';

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
    const enabledPaymentPaywallLurker = useStore($enabledPaymentPaywallLurker);
    const paymentPaywallParticipant = useStore($paymentPaywallParticipant);
    const paymentPaywallLurker = useStore($paymentPaywallLurker);

    const initStripe = () => {
        if (!isCreatePaymentIntentPending && !intentId) {
            if(enabledPaymentPaywallParticipant || enabledPaymentPaywallLurker) {
                createPaymentIntentWithData({
                    paymentType: PaymentType.Paywall
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
            <ConditionalRender condition={enabledPaymentPaywallLurker}>
                <PaymentForm
                    onClose={onPaymentSuccess}
                    payment={paymentPaywallLurker}
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
