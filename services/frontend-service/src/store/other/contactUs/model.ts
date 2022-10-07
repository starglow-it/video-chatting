import { otherStoresDomain } from '../../domains';
import { ContactFormPayload, ContactFormResponse } from '../../types';

export const sendContactFormFx = otherStoresDomain.createEffect<
    ContactFormPayload,
    ContactFormResponse
>('sendContactFormFx');
