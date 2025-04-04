import { useStore } from 'effector-react';
import { useCallback, useRef, useEffect } from 'react';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import { Translation } from '@library/common/Translation/Translation';
import { PaymentType } from 'shared-const';
import { MeetingMonetization } from './MeetingMonetization';
import {
    $paymentIntent,
    $isOwner,
    createPaymentIntentWithData,
    $enabledPaymentMeetingParticipant,
    $enabledPaymentMeetingAudience,
    $paymentMeetingParticipant,
    $paymentMeetingAudience,
    cancelPaymentIntentWithData,
} from '../../../store/roomStores';
import { ChargeButtonBase } from './ChargeButtonBase';

export const MeetingMonetizationButton = () => {
    const paymentIntent = useStore($paymentIntent);
    const isOwner = useStore($isOwner);
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const enabledPaymentMeetingAudience = useStore($enabledPaymentMeetingAudience);
    const intentId = paymentIntent?.id;
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentMeetingAudience = useStore($paymentMeetingAudience);

    const managePaymentRef = useRef<any>(null);

    const handleTogglePayment = () => {
        if (!isCreatePaymentIntentPending) {
            if (!intentId) {
                createPaymentIntentWithData({
                    paymentType: PaymentType.Meeting,
                });
            }
        }
    };

    const handleCloseForm = useCallback(() => {
        managePaymentRef.current?.close();
        if (!isOwner) {
            cancelPaymentIntentWithData();
        }
    }, [isOwner]);

    return (
        <>
            <ConditionalRender condition={isOwner}>
                <ChargeButtonBase
                    tooltipButton={
                        <Translation
                            nameSpace="meeting"
                            translation="features.getPaid"
                        />
                    }
                    ref={managePaymentRef}
                >
                    <MeetingMonetization onUpdate={handleCloseForm} />
                </ChargeButtonBase>
            </ConditionalRender>
            <ConditionalRender condition={enabledPaymentMeetingParticipant}>
                <ChargeButtonBase
                    tooltipButton={
                        <Translation
                            nameSpace="meeting"
                            translation="features.sendMoney"
                        />
                    }
                    onToggle={handleTogglePayment}
                    ref={managePaymentRef}
                    transformOriginVertical={410}
                >
                    <PaymentForm
                        onClose={handleCloseForm}
                        payment={paymentMeetingParticipant}
                    />
                </ChargeButtonBase>
            </ConditionalRender>
            <ConditionalRender condition={enabledPaymentMeetingAudience}>
                <ChargeButtonBase
                    tooltipButton={
                        <Translation
                            nameSpace="meeting"
                            translation="features.sendMoney"
                        />
                    }
                    onToggle={handleTogglePayment}
                    ref={managePaymentRef}
                    transformOriginVertical={410}
                >
                    <PaymentForm
                        onClose={handleCloseForm}
                        payment={paymentMeetingAudience}
                    />
                </ChargeButtonBase>
            </ConditionalRender>
        </>
    );
};
