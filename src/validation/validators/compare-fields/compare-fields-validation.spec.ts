import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (
  fieldName: string,
  fieldNameToCompare: string,
): CompareFieldsValidation => {
  return new CompareFieldsValidation(fieldName, fieldNameToCompare);
};

describe('CompareFieldsValidation', () => {
  test('Should return error if compare is invalid', () => {
    const fieldName = faker.database.column();
    const fieldNameToCompare = faker.database.column();
    const sut = makeSut(fieldName, fieldNameToCompare);
    const error = sut.validate({
      [fieldName]: faker.random.word(),
      [fieldNameToCompare]: faker.random.word(),
    });
    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return falsy if compare is valid', () => {
    const fieldName = faker.database.column();
    const fieldNameToCompare = faker.database.column();
    const sut = makeSut(fieldName, fieldNameToCompare);
    const valueToCompare = faker.random.word();
    const error = sut.validate({
      [fieldName]: valueToCompare,
      [fieldNameToCompare]: valueToCompare,
    });
    expect(error).toBeFalsy();
  });
});
