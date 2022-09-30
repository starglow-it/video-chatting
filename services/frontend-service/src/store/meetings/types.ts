import { ErrorState, Template, UserTemplate } from '../types';

export type CreateMeetingPayload = { templateId: Template['id'] };
export type DeleteMeetingPayload = { templateId: Template['id'] };
export type CreateMeetingResponse = { template?: UserTemplate; error?: ErrorState };
