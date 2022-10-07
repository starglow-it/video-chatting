import { sendContactFormFx } from './model';
import { handleSendContactForm } from './handlers/handleSendContactForm';

sendContactFormFx.use(handleSendContactForm);
