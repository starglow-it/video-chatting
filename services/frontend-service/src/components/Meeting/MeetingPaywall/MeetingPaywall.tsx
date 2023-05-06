import {
	memo, useEffect
} from 'react';
import {
	useStore
} from 'effector-react';

// hooks

import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import {
    $isOwner,
    cancelPaymentIntentWithData,
  createPaymentIntentWithData,
	$isTogglePayment,
	$paymentIntent,
	togglePaymentFormEvent,
} from '../../../store/roomStores';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types


interface Props{
	onPaymentSuccess: () => void
}
const Component = ({onPaymentSuccess}: Props) => {
	const paymentIntent = useStore($paymentIntent);
	const isOwner = useStore($isOwner);
	const intentId = paymentIntent?.id;
	const isPaymentOpen = useStore($isTogglePayment);
	const isCreatePaymentIntentPending = useStore(
		createPaymentIntentWithData.pending,
	);
	const initStripe = () => {
		if (!isCreatePaymentIntentPending) {
				if (!isPaymentOpen && !intentId && !isOwner) {
						createPaymentIntentWithData({
							isPaymentPaywall: true
						});
				}
				if (intentId) cancelPaymentIntentWithData({
					isPaymentPaywall: true
				});
				togglePaymentFormEvent();
		}
	};

	useEffect(() => {
		initStripe()
	}, []) 
	return (
		<CustomBox>
			<CustomTypography
				nameSpace="subscriptions"
				translation="paywall.title"
				textAlign="center"
				marginBottom={1}
				variant='body1bold'
				component="div"
			/>
			<CustomTypography
				nameSpace="subscriptions"
				translation="paywall.labelForm"
			/>
			<PaymentForm onClose={onPaymentSuccess} templateType='black'/>
		</CustomBox>
  );
}

export const MeetingPaywall = memo(Component);
