import { MinLengthError } from '@/validation/errors';
import { MinLengthValidation } from '@/validation/validators/min-length';
import faker from 'faker';

const makeSut = (minLength = 5): MinLengthValidation => {
  return new MinLengthValidation(faker.database.column(), minLength);
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

  test('Should return error if message in sigular', () => {
    const minLength = 1;
    const sut = makeSut(minLength);
    const error = sut.validate('');
    expect(error.message).toEqual(`Minimo ${minLength} caracter`);
  });
});
