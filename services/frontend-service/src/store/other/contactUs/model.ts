import { otherStoresDomain, supportDomain } from '../../domains';
import { ContactFormPayload, ContactFormResponse } from '../../types';
import { createEvent } from 'effector-next';

export const $contactForm = supportDomain.createStore<ContactFormPayload>({
    name: '',
    email: '',
    message: '',
});

export const changeContactFormData = createEvent<ContactFormPayload>();

export const sendContactFormFx = otherStoresDomain.createEffect<
    ContactFormPayload,
    ContactFormResponse
>('sendContactFormFx');

