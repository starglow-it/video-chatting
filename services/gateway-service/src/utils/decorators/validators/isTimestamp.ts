import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { type } from 'os';
import { ITimestamp } from 'shared-types';

export function IsTimestamp(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsTimestampConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsTimestamp' })
export class IsTimestampConstraint implements ValidatorConstraintInterface {
  validate(value: ITimestamp, args: ValidationArguments) {
    if (
      typeof value?.day === 'number' &&
      typeof value?.hours === 'number' &&
      typeof value?.minutes === 'number' &&
      typeof value?.month === 'number' &&
      typeof value?.year === 'number'
    ) {
      return true;
    }
    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Value does not match';
  }
}
