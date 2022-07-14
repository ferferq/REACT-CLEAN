import { ValidationBuilder } from '@/validation/validators/builder';
import { ValidationComposite } from '@/validation/validators/validation-composite';
import { makeSignUpValidation } from './signup-validation-factory';

describe('SignupValidationFactory', () => {
  test('Should compose ValidationComposite with correct validations', () => {
    const composite = makeSignUpValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        ...ValidationBuilder.field('name').required().min(5).build(),
        ...ValidationBuilder.field('email').required().email().build(),
        ...ValidationBuilder.field('password').required().min(5).build(),
        ...ValidationBuilder.field('passwordConfirmation')
          .required()
          .sameAs('password')
          .build(),
      ]),
    );
  });
});
