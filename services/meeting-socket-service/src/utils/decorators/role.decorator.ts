import { SetMetadata } from '@nestjs/common';
import { MeetingRole } from 'shared-types';

export const ROLE = 'role';

export const Roles = (roles: MeetingRole[]) => SetMetadata(ROLE, roles);
