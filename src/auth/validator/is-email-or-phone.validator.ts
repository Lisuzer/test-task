import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'IsEmailOrPhone', async: true })
export class EmailOrPhoneConstraints implements ValidatorConstraintInterface {
    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        const regExpEmail = RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        const isEmail = regExpEmail.test(value);
        const regExpPhone = RegExp('/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;');
        const isPhone = regExpPhone.test(value);
        if (isEmail || isPhone) {
            return true;
        }
        return false;
    }
}

export function IsEmailOrPhone(options?: ValidationOptions) {
    return (o: Object, propertyName: string) => {
        registerDecorator({
            name: 'IsEmailOrPhone',
            target: o.constructor,
            propertyName,
            options,
            constraints: [],
            validator: EmailOrPhoneConstraints
        });
    };
}