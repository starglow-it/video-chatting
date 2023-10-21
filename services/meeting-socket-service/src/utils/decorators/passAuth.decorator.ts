import { SetMetadata } from '@nestjs/common';

export const PASS_AUTH_KEY = 'passAuthKey';

export const PassAuth = () => SetMetadata(PASS_AUTH_KEY, true);
