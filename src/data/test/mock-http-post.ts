import faker from 'faker';
import { HttpPostParams } from '@/data/protocols/http';

export const mockPostRequest = (): HttpPostParams<any> => {
  return {
    url: faker.internet.url(),
    body: faker.random.objectElement(),
  };
};
