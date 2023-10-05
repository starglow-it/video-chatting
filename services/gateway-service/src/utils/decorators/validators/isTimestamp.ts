import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

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
    validate(value: any, args: ValidationArguments) {
        console.log(value);
        return false;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Value does not match';
    }

}