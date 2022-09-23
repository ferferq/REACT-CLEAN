import { AuthenticationParams } from '@/domain/usecases';
import faker from 'faker';
import { AccountModel } from '../models';

export const mockAuthentication = (): AuthenticationParams => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const mockAccountModel = (): AccountModel => {
  return {
    accessToken: faker.datatype.uuid(),
    name: faker.name.firstName(),
  };
};
