import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function Test(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'UserExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: TestValidation,
        });
    };
}

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class TestValidation implements ValidatorConstraintInterface {
    constructor() { }

    async validate(value: number) {
        try {
            console.log(value);
            
            return true;
        } catch (e) {
            return false;
        }

    }

    defaultMessage(args: ValidationArguments) {
        return `Test fail`;
    }
}