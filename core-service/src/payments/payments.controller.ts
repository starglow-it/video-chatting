import { Controller } from '@nestjs/common';

import { PAYMENTS_SCOPE } from '@shared/const/api-scopes.const';

@Controller(PAYMENTS_SCOPE)
export class PaymentsController {}
