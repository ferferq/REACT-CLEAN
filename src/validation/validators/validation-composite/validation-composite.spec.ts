import faker from 'faker';
import { FieldValidationSpy } from '@/validation/test';
import { ValidationComposite } from './validation-composite';

type SutTypes = {
  sut: ValidationComposite;
  fieldValidationsSpy: FieldValidationSpy[];
};

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName),
  ];
  const sut = ValidationComposite.build(fieldValidationsSpy);

  return {
    sut,
    fieldValidationsSpy,
  };
};

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = faker.random.word();
    const { sut, fieldValidationsSpy } = makeSut(fieldName);
    const [fieldValidationSpy, fieldValidationSpy2] = fieldValidationsSpy;
    const error1 = faker.random.words();
    const error2 = faker.random.words();
    fieldValidationSpy.error = new Error(error1);
    fieldValidationSpy2.error = new Error(error2);
    const error = sut.validate(fieldName, faker.random.word());
    expect(error).toBe(error1);
  });
  test('Should return falsy if there is no error', () => {
    const fieldName = faker.random.word();
    const { sut } = makeSut(fieldName);
    const error = sut.validate(fieldName, faker.random.word());
    expect(error).toBeFalsy();
  });
});
