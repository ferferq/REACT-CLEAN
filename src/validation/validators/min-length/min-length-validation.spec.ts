import { MinLengthError } from '@/validation/errors';
import { MinLengthValidation } from '@/validation/validators/min-length';
import faker from 'faker';

const makeSut = (fieldName: string, minLength = 5): MinLengthValidation => {
  return new MinLengthValidation(fieldName, minLength);
};

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const minLength = 5;
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({
      [fieldName]: faker.datatype.string(3),
    });
    expect(error).toEqual(new MinLengthError(minLength));
  });

  test('Should return falsy if value is valid', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({
      [fieldName]: faker.datatype.string(5),
    });
    expect(error).toBeFalsy();
  });

  test('Should return error if message in sigular', () => {
    const minLength = 1;
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName, minLength);
    const error = sut.validate({
      [fieldName]: '',
    });
    expect(error.message).toEqual(`Minimo ${minLength} caracter`);
  });

  test('Should return falsy if field does not exists in schema', () => {
    const sut = makeSut(faker.database.column());
    const error = sut.validate({
      [faker.database.column()]: faker.datatype.string(5),
    });
    expect(error).toBeFalsy();
  });

  test('Should return falsy if field not exists', () => {
    const sut = makeSut(null);
    const error = sut.validate({});
    expect(error).toBeFalsy();
  });
});
