import { InvalidFieldError } from '@/validation/errors';
import { FieldValidation } from '@/validation/protocols';

export class CompareFieldsValidation implements FieldValidation {
  constructor(
    readonly fieldName: string,
    private readonly valueToCompare: string,
  ) {}

  validate(field: string): Error {
    return field === this.valueToCompare ? null : new InvalidFieldError();
  }
}
