import { UseGuards, applyDecorators } from '@nestjs/common';
import { TMultiDecorators } from '../types/multipleDecorator';
import { PermissionGuard } from '../../guards/permission.guard';

export const InjectWsGlobalGuard = (): TMultiDecorators => {
  return applyDecorators(UseGuards(PermissionGuard));
};
