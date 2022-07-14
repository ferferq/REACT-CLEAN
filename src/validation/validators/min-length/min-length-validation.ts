import { MinLengthError } from '@/validation/errors/min-length-error';
import { FieldValidation } from '@/validation/protocols';

export class MinLengthValidation implements FieldValidation {
  constructor(readonly fieldName: string, private readonly minLength: number) {}

  validate(input: object): Error {
    return input[this.fieldName]?.length < this.minLength
      ? new MinLengthError(this.minLength)
      : null;
  }
}
