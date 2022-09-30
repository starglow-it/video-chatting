import { Controller } from '@nestjs/common';
import { CORE_SCOPE } from '@shared/const/api-scopes.const';

@Controller(CORE_SCOPE)
export class CoreController {}
