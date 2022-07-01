import {memo, useCallback} from "react";
import { useStore } from "effector-react";

// custom
import { CustomGrid } from "@library/custom/CustomGrid/CustomGrid";
import { CustomTypography } from "@library/custom/CustomTypography/CustomTypography";
import { CustomDivider } from "@library/custom/CustomDivider/CustomDivider";

// components
import { StripeElement } from "@components/Stripe/StripeElement/StripeElement";
import {WiggleLoader} from "@library/common/WiggleLoader/WiggleLoader";
import {CardDataForm} from "@components/Payments/CardDataForm/CardDataForm";

// stores
import {PaymentFormProps} from "@components/PaymentForm/types";
import {$meetingTemplateStore, $paymentIntent, createPaymentIntentWithData,addNotificationEvent} from "../../store";

// styles
import styles from './PaymentForm.module.scss';

// types
import {NotificationType} from "../../store/types";

const currencySigns = {
    USD: "$",
    CAD: "C$",
};

const Component = ({ onClose }: PaymentFormProps) => {
    const meetingTemplate = useStore($meetingTemplateStore);
    const paymentIntent = useStore($paymentIntent);
    const isCreatePaymentIntentPending = useStore(createPaymentIntentWithData.pending);

    const handleSubmit = useCallback(async () => {
        onClose();
        addNotificationEvent({
            type: NotificationType.PaymentSuccess,
            message: 'payments.paymentSuccess',
            withSuccessIcon: true,
        });
    }, []);

    const handleSubmitError = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.PaymentFail,
            message: 'payments.paymentFail',
            withErrorIcon: true,
        });
    }, []);

    return (
        <CustomGrid container direction="column">
            <CustomGrid container className={styles.title} alignItems="center">
                <CustomTypography variant="h3bold" color="colors.white.primary">
                    {currencySigns[meetingTemplate.templateCurrency]}{meetingTemplate.templatePrice}
                </CustomTypography>
                &nbsp;
                <CustomTypography className={styles.transparentWhite}>
                    &#8226;
                </CustomTypography>
                &nbsp;
                <CustomTypography className={styles.transparentWhite} nameSpace="meeting" translation="payments.perSession" />
            </CustomGrid>
            <CustomDivider light flexItem />
            {!isCreatePaymentIntentPending && paymentIntent.clientSecret
                ? (
                    <CustomGrid container direction="column" className={styles.paymentForm}>
                        <CustomTypography
                            variant="body1bold"
                            color="colors.white.primary"
                            nameSpace="meeting"
                            translation="payments.yourCard"
                            className={styles.title}
                        />
                        <StripeElement secret={paymentIntent.clientSecret}>
                            <CardDataForm onSubmit={handleSubmit} onError={handleSubmitError} paymentIntentSecret={paymentIntent.clientSecret} />
                        </StripeElement>
                    </CustomGrid>
                )
                : (
                    <CustomGrid container justifyContent="center" alignItems="center" className={styles.loader}>
                        <WiggleLoader />
                    </CustomGrid>
                )
            }
        </CustomGrid>
    );
}

export const PaymentForm = memo<PaymentFormProps>(Component);
