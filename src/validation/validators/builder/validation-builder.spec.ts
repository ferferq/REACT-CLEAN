import {
  MinLengthValidation,
  RequiredFieldValidation,
} from '@/validation/validators';
import faker from 'faker';
import { CompareFieldsValidation } from '../compare-fields/compare-fields-validation';
import { EmailValidation } from '../email';
import { ValidationBuilder as sut } from './validation-builder';

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const fieldName = faker.database.column();
    const validations = sut.field(fieldName).required().build();
    expect(validations).toEqual([new RequiredFieldValidation(fieldName)]);
  });
  test('Should return EmailValidation', () => {
    const fieldName = faker.database.column();
    const validations = sut.field(fieldName).email().build();
    expect(validations).toEqual([new EmailValidation(fieldName)]);
  });
  test('Should return MinLengthValidation', () => {
    const fieldName = faker.database.column();
    const length = faker.datatype.number();
    const validations = sut.field(fieldName).min(length).build();
    expect(validations).toEqual([new MinLengthValidation(fieldName, length)]);
  });

  test('Should return CompareFieldsValidation', () => {
    const fieldName = faker.database.column();
    const fieldToCompare = faker.database.column();
    const validations = sut.field(fieldName).sameAs(fieldToCompare).build();
    expect(validations).toEqual([
      new CompareFieldsValidation(fieldName, fieldToCompare),
    ]);
  });

  test('Should return a list of validations', () => {
    const fieldName = faker.database.column();
    const length = faker.datatype.number();
    const validations = sut
      .field(fieldName)
      .required()
      .min(length)
      .email()
      .build();
    expect(validations).toEqual([
      new RequiredFieldValidation(fieldName),
      new MinLengthValidation(fieldName, length),
      new EmailValidation(fieldName),
    ]);
  });
});
