import { ErrorState } from 'shared-types';
import { UserTemplate } from '../types';

export type CreateMeetingResponse = { template?: UserTemplate; error?: ErrorState };
