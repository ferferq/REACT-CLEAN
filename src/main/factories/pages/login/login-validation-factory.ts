import { Validation } from '@/presentation/protocols/validation';
import { ValidationBuilder } from '@/validation/validators/builder';
import { ValidationComposite } from '@/validation/validators/validation-composite';

export const makeLoginValidation = (): Validation => {
  return ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(5).build(),
  ]);
};
