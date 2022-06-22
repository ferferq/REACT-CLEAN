import { ValidationBuilder } from '@/validation/validators/builder';
import { ValidationComposite } from '@/validation/validators/validation-composite';
import { makeLoginValidation } from './login-validation-factory';

describe('LoginValidationFactory', () => {
  test('Should compose ValidationComposite with correct validations', () => {
    const composite = makeLoginValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        ...ValidationBuilder.field('email').required().email().build(),
        ...ValidationBuilder.field('password').required().min(5).build(),
      ]),
    );
  });
});
