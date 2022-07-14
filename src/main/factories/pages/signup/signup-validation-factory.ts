import { Validation } from '@/presentation/protocols/validation';
import { ValidationBuilder } from '@/validation/validators/builder';
import { ValidationComposite } from '@/validation/validators/validation-composite';

export const makeSignUpValidation = (): Validation => {
  return ValidationComposite.build([
    ...ValidationBuilder.field('name').required().min(5).build(),
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(5).build(),
    ...ValidationBuilder.field('passwordConfirmation')
      .required()
      .sameAs('password')
      .build(),
  ]);
};
