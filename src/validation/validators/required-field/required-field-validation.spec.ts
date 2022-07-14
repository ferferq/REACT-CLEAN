import { RequiredFieldError } from '@/validation/errors';
import { RequiredFieldValidation } from '@/validation/validators/required-field';
import faker from 'faker';

const makeSut = (fieldName: string): RequiredFieldValidation => {
  return new RequiredFieldValidation(fieldName);
};

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({
      [fieldName]: '',
    });
    expect(error).toEqual(new RequiredFieldError());
  });

  test('Should return error if field is not empty', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({
      [fieldName]: faker.random.words(),
    });
    expect(error).toBeFalsy();
  });
});
