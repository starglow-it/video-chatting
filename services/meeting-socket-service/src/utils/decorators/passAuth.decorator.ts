import { SetMetadata } from '@nestjs/common';

export const PASS_AUTH_KEY = 'isPassAuth';

export const PassAuth = () => SetMetadata(PASS_AUTH_KEY, true);
