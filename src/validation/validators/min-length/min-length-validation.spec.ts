import { MinLengthError } from '@/validation/errors';
import { MinLengthValidation } from '@/validation/validators/min-length';
import faker from 'faker';

const makeSut = (): MinLengthValidation => {
  return new MinLengthValidation(faker.database.column(), 5);
};

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const minLength = 5;
    const sut = makeSut();
    const error = sut.validate(faker.datatype.string(3));
    expect(error).toEqual(new MinLengthError(minLength));
  });

  test('Should return falsy if value is valid', () => {
    const sut = makeSut();
    const error = sut.validate(faker.datatype.string(5));
    expect(error).toBeFalsy();
  });
});
