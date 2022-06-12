import { MinLengthError } from '@/validation/errors';
import { MinLengthValidation } from '@/validation/validators/min-length';
import faker from 'faker';

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const minLength = faker.datatype.number();
    const sut = new MinLengthValidation(faker.database.column(), minLength);
    const error = sut.validate('123');
    expect(error).toEqual(new MinLengthError(minLength));
  });

  test('Should return falsy if value is valid', () => {
    const sut = new MinLengthValidation(faker.database.column(), 5);
    const error = sut.validate('12345');
    expect(error).toBeFalsy();
  });
});
