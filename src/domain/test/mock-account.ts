import faker from 'faker';
import { AccountModel } from '../models';

export const mockAccountModel = (): AccountModel => {
  return {
    accessToken: faker.datatype.uuid(),
    name: faker.name.firstName(),
  };
};
