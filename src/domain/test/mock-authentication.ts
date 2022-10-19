import faker from 'faker';
import { Authentication } from '../usecases';
import { mockAccountModel } from './mock-account';

export const mockAuthenticationParams = (): Authentication.Params => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const mockAuthenticationModel = (): Authentication.Model =>
  mockAccountModel();
