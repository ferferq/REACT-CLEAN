import { InvalidFieldError } from '@/validation/errors';
import { FieldValidation } from '@/validation/protocols';

export class EmailValidation implements FieldValidation {
  constructor(readonly fieldName: string) {}

  validate(input: object): Error {
    const emailRegex =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return !input[this.fieldName] || emailRegex.test(input[this.fieldName])
      ? null
      : new InvalidFieldError();
  }
}
