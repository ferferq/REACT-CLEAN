import { InvalidFieldError } from '@/validation/errors';
import { EmailValidation } from '@/validation/validators/email';
import faker from 'faker';

const makeSut = (fieldName: string): EmailValidation => {
  return new EmailValidation(fieldName);
};

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({
      [fieldName]: faker.random.word(),
    });
    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return error if email is invalid', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({
      [fieldName]: faker.internet.email(),
    });
    expect(error).toEqual(null);
  });

  test('Should return falsy if email is empty', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({
      [fieldName]: '',
    });
    expect(error).toEqual(null);
  });
});
