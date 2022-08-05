import {IBrokerHandler, IBrokerHandlerArgs} from '../../../types/broker';
import { sendEmail } from '../../services/email/sendEmail';

export const consumeEmailSend: IBrokerHandler = async ({ payload }: IBrokerHandlerArgs) => {
    await sendEmail(payload.data);
};
