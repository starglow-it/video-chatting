import { UserTemplate } from '../types';
import { ErrorState } from 'shared-types';

export type CreateMeetingResponse = { template?: UserTemplate; error?: ErrorState };
