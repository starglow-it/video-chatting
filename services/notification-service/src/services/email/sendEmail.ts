import { logger } from '../../config/logger';
import { EmailServices } from '../../const/email/EmailServices';
import { sendEmail as gmailSendEmail } from '../../externalServices/gmail/sendEmail';
import { sendEmail as mailchimpSendEmail } from '../../externalServices/mailchimp/sendEmail';
import { SendEmailRequest } from 'shared-types';
import { getConfigVar } from '../config';

const send = (sendEmailData: SendEmailRequest, service: EmailServices) => {
    if (service === EmailServices.Gmail) {
        return gmailSendEmail(sendEmailData);
    }
    if (service === EmailServices.Mailchimp) {
        return mailchimpSendEmail(sendEmailData);
    }

    throw new Error('Unknown email service');
};

export const sendEmail = async (sendEmailData: SendEmailRequest) => {
    const service = await getConfigVar('emailService');

    const s = await send(sendEmailData, service);

    logger.info(
        `Email.sendEmail success; ${JSON.stringify({
            to: JSON.stringify(sendEmailData.to),
            service,
        })}`,
    );
    return s;
};
