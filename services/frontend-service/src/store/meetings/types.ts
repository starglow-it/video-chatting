import { ErrorState, IUserTemplate } from 'shared-types';

export type CreateMeetingResponse = {
    template?: IUserTemplate;
    error?: ErrorState;
};
