import { RequiredFieldError } from '@/validation/errors';
import { RequiredFieldValidation } from '@/validation/validators/required-field';
import faker from 'faker';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(faker.database.column());
};

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = makeSut();
    const error = sut.validate('');
    expect(error).toEqual(new RequiredFieldError());
  });

  test('Should return error if field is not empty', () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.words());
    expect(error).toBeFalsy();
  });
});
