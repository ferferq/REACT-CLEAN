import { MinLengthError } from '@/validation/errors/min-length-error';
import { FieldValidation } from '@/validation/protocols';

export class MinLengthValidation implements FieldValidation {
  constructor(readonly fieldName: string, private readonly minLength: number) {}

  validate(fieldValue: string): Error {
    return fieldValue.length >= this.minLength
      ? null
      : new MinLengthError(this.minLength);
  }
}
