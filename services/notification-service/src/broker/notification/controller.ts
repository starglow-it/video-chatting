import { IBrokerHandler, IBrokerHandlerArgs } from '../../../types/broker';
import { sendEmail } from '../../services/email/sendEmail';

export const consumeEmailSend: IBrokerHandler = async ({
    payload,
}: IBrokerHandlerArgs) => {
    return await sendEmail(payload.data);
};
