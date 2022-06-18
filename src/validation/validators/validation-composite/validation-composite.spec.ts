import { FieldValidationSpy } from '../test';
import { ValidationComposite } from './validation-composite';

type SutTypes = {
  sut: ValidationComposite;
  fieldValidationsSpy: FieldValidationSpy[];
};

const makeSut = (): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy('any_field'),
    new FieldValidationSpy('any_field'),
  ];
  const sut = new ValidationComposite(fieldValidationsSpy);

  return {
    sut,
    fieldValidationsSpy,
  };
};

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const { sut, fieldValidationsSpy } = makeSut();
    const [fieldValidationSpy, fieldValidationSpy2] = fieldValidationsSpy;
    fieldValidationSpy.error = new Error('first_message');
    fieldValidationSpy2.error = new Error('secound_message');
    const error = sut.validate('any_field', 'any_value');
    expect(error).toBe('first_message');
  });
});
