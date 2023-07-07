import {
    $contactForm,
    changeContactFormData,
    sendContactFormFx,
} from './model';
import { handleSendContactForm } from './handlers/handleSendContactForm';

sendContactFormFx.use(handleSendContactForm);

$contactForm.on(changeContactFormData, (state, data) => data);
