import { useStore } from 'effector-react';
import { useCallback, useRef } from 'react';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import { Translation } from '@library/common/Translation/Translation';
import { MeetingMonetization } from './MeetingMonetization';
import {
    $paymentIntent,
    $isOwner,
    createPaymentIntentWithData,
    $enabledPaymentMeetingParticipant,
    $enabledPaymentMeetingLurker,
    $paymentMeetingParticipant,
    $paymentMeetingLurker,
    cancelPaymentIntentWithData,
} from '../../../store/roomStores';
import { ChargeButtonBase } from './ChargeButtonBase';
import { PaymentType } from 'shared-const';

export const MeetingMonetizationButton = () => {
    const paymentIntent = useStore($paymentIntent);
    const isOwner = useStore($isOwner);
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const enabledPaymentMeetingLurker = useStore($enabledPaymentMeetingLurker);
    const intentId = paymentIntent?.id;
    console.log('#Duy Phan console intentID', intentId);
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentMeetingLurker = useStore($paymentMeetingLurker);

    const managePaymentRef = useRef<any>(null);

    const handleTogglePayment = (isToggle: boolean) => {
        console.log('#Duy Phan console', intentId);
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
        cancelPaymentIntentWithData();
    }, []);

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
                >
                    <PaymentForm
                        onClose={handleCloseForm}
                        payment={paymentMeetingParticipant}
                    />
                </ChargeButtonBase>
            </ConditionalRender>
            <ConditionalRender condition={enabledPaymentMeetingLurker}>
                <ChargeButtonBase
                    tooltipButton={
                        <Translation
                            nameSpace="meeting"
                            translation="features.sendMoney"
                        />
                    }
                    onToggle={handleTogglePayment}
                    ref={managePaymentRef}
                >
                    <PaymentForm
                        onClose={handleCloseForm}
                        payment={paymentMeetingLurker}
                    />
                </ChargeButtonBase>
            </ConditionalRender>
        </>
    );
};
