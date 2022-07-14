import { InvalidFieldError } from '@/validation/errors';
import { FieldValidation } from '@/validation/protocols';

export class CompareFieldsValidation implements FieldValidation {
  constructor(
    readonly fieldName: string,
    private readonly fieldToCompare: string,
  ) {}

  validate(input: object): Error {
    return input[this.fieldToCompare] === input[this.fieldName]
      ? null
      : new InvalidFieldError();
  }
}
