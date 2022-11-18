import faker from 'faker';
import { AddAccount } from '../usecases';
import { mockAccountModel } from './mock-account';

export const mockAddAccountParams = (): AddAccount.Params => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

export const mockAddAccountModel = (): AddAccount.Model => mockAccountModel();
