import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsOdd(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOdd',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: number) {
          return value % 2 === 1;
        },
      },
    });
  };
}

// @IsOdd({ message: 'Số phải là số lẻ' })
// num: number;
