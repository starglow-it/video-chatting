import {
	memo, useEffect
} from 'react';
import {
	useStore
} from 'effector-react';

// hooks

// custom
import {
	CustomGrid
} from 'shared-frontend/library/custom/CustomGrid';
// stores
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import {
    $isOwner,
    cancelPaymentIntentWithData,
  createPaymentIntentWithData,
	$isTogglePayment,
	$paymentIntent,
	togglePaymentFormEvent,
} from '../../../store/roomStores';

// types

// styles
import styles from './MeetingPaywall.module.scss';
import { MeetingPreview } from '../MeetingPreview/MeetingPreview';


const Component = () => {
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
						createPaymentIntentWithData();
				}
				if (intentId) cancelPaymentIntentWithData();
				togglePaymentFormEvent();
		}
	};


	useEffect(() => {
		initStripe()
	}, []) 
	return (
		<>
			<MeetingPreview />
			<CustomPaper className={styles.wrapper}>
				<CustomGrid container direction="column" wrap="nowrap">
					<PaymentForm onClose={() => console.log('check payment form')} />
				</CustomGrid>
			</CustomPaper>	
			</>
    );
};

export const MeetingPaywall = memo(Component);
