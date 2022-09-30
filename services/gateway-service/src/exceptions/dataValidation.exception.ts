import { BadRequestException } from '@nestjs/common';

export class DataValidationException extends BadRequestException {
  constructor(error) {
    super(error);
  }
}
